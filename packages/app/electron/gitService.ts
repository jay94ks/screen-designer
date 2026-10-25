import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  discoverRepository,
  openRepository,
  createSignature,
  RevwalkSort,
  Repository,
  Tree
} from 'es-git';

export interface DesignGitChange {
  path: string;
  filename: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
}

export interface GitStatusResult {
  isRepo: boolean;
  branch: string;
  tracking: string;
  ahead: number;
  behind: number;
  clean: boolean;
  uiChangesCount: number;
  designChanges: DesignGitChange[];
  allChangesCount: number;
  allChanges: DesignGitChange[];
  error?: string;
}

export interface GitCommitItem {
  hash: string;
  shortHash: string;
  date: string;
  message: string;
  body: string;
  author_name: string;
  author_email: string;
  refs?: string;
}

export interface SideBySideRow {
  oldLineNo?: number;
  oldContent?: string;
  oldType?: 'del' | 'normal' | 'empty';
  newLineNo?: number;
  newContent?: string;
  newType?: 'add' | 'normal' | 'empty';
  isHunkHeader?: boolean;
  hunkHeader?: string;
}

export interface FileDiffResult {
  filePath: string;
  rawDiff: string;
  isBinary: boolean;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  rows: SideBySideRow[];
  lineEndingWarning?: string;
}

export interface CommitDetailsResult {
  hash: string;
  shortHash: string;
  date: string;
  message: string;
  body: string;
  author_name: string;
  author_email: string;
  files: { path: string; filename: string; status: 'modified' | 'added' | 'deleted' }[];
}

let cachedRoot: string | null = null;

export async function getRepoRoot(workspacePath?: string): Promise<string> {
  const targetDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
  try {
    const repo = await discoverRepository(targetDir);
    const workdir = repo.workdir();
    if (workdir) {
      cachedRoot = path.normalize(workdir).replace(/[/\\]$/, '');
      return cachedRoot;
    }
  } catch {}
  return targetDir;
}

async function getRepo(workspacePath?: string): Promise<{ repo: Repository; root: string }> {
  const root = await getRepoRoot(workspacePath);
  const repo = await discoverRepository(root);
  return { repo, root };
}

export async function getGitStatus(
  pageDocsPath = 'docs/ui-boards',
  workspacePath?: string
): Promise<GitStatusResult> {
  try {
    const { repo, root } = await getRepo(workspacePath);

    // 1. Current Branch & Upstream Tracking
    let branch = 'main';
    let tracking = '';
    let ahead = 0;
    let behind = 0;

    try {
      const headRef = repo.head();
      branch = headRef.shorthand() || 'main';

      const localBranch = repo.findBranch(branch, 'Local');
      if (localBranch) {
        const upstream = localBranch.findUpstream();
        if (upstream) {
          tracking = upstream.name() || '';

          // Ahead count
          try {
            const walkerAhead = repo.revwalk();
            walkerAhead.pushRange(`${tracking}..HEAD`);
            while (walkerAhead.next()) ahead++;
          } catch {}

          // Behind count
          try {
            const walkerBehind = repo.revwalk();
            walkerBehind.pushRange(`HEAD..${tracking}`);
            while (walkerBehind.next()) behind++;
          } catch {}
        }
      }
    } catch {}

    // 2. Status entries (include untracked)
    const statuses = repo.statuses();

    const allChanges: DesignGitChange[] = [];
    const normDocsPath = pageDocsPath.replace(/^\/+|\/+$/g, '');
    const statusesCount = Number(statuses.len());

    for (let i = 0; i < statusesCount; i++) {
      const entry = statuses.get(i);
      if (!entry) continue;
      const st = entry.status();
      if (st.ignored) continue;

      const p = entry.path().replace(/\\/g, '/');
      if (p.endsWith('/')) continue;

      let status: 'modified' | 'added' | 'deleted' | 'untracked' = 'modified';
      if (st.wtNew) status = 'untracked';
      else if (st.indexNew) status = 'added';
      else if (st.wtDeleted || st.indexDeleted) status = 'deleted';
      else status = 'modified';

      allChanges.push({
        path: p,
        filename: path.basename(p),
        status
      });
    }

    const designChanges = allChanges.filter(
      (c) =>
        c.path.startsWith(normDocsPath) ||
        c.path.startsWith('.screen-designer') ||
        c.path.startsWith('assets')
    );

    return {
      isRepo: true,
      branch,
      tracking,
      ahead,
      behind,
      clean: allChanges.length === 0,
      uiChangesCount: designChanges.length,
      designChanges,
      allChangesCount: allChanges.length,
      allChanges
    };
  } catch (err: any) {
    console.warn('[gitService] getGitStatus error or not a repo:', err.message);
    return {
      isRepo: false,
      branch: '',
      tracking: '',
      ahead: 0,
      behind: 0,
      clean: true,
      uiChangesCount: 0,
      designChanges: [],
      allChangesCount: 0,
      allChanges: [],
      error: err.message
    };
  }
}

export function parseUnifiedDiff(rawDiff: string, filePath: string): SideBySideRow[] {
  const lines = rawDiff.split(/\r?\n/);
  const rows: SideBySideRow[] = [];

  let oldLine = 0;
  let newLine = 0;
  let inHunk = false;

  const pendingDels: { lineNo: number; text: string }[] = [];
  const pendingAdds: { lineNo: number; text: string }[] = [];

  const flushPending = () => {
    const maxCount = Math.max(pendingDels.length, pendingAdds.length);
    for (let i = 0; i < maxCount; i++) {
      const del = pendingDels[i];
      const add = pendingAdds[i];
      rows.push({
        oldLineNo: del ? del.lineNo : undefined,
        oldContent: del ? del.text : undefined,
        oldType: del ? 'del' : 'empty',
        newLineNo: add ? add.lineNo : undefined,
        newContent: add ? add.text : undefined,
        newType: add ? 'add' : 'empty'
      });
    }
    pendingDels.length = 0;
    pendingAdds.length = 0;
  };

  for (const line of lines) {
    if (line.startsWith('@@')) {
      flushPending();
      inHunk = true;
      const match = line.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@(.*)/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      rows.push({
        isHunkHeader: true,
        hunkHeader: line
      });
      continue;
    }

    if (!inHunk) continue;

    if (line.startsWith('-')) {
      pendingDels.push({ lineNo: oldLine++, text: line.slice(1) });
    } else if (line.startsWith('+')) {
      pendingAdds.push({ lineNo: newLine++, text: line.slice(1) });
    } else if (line.startsWith(' ') || line === '') {
      flushPending();
      rows.push({
        oldLineNo: oldLine++,
        oldContent: line.slice(1),
        oldType: 'normal',
        newLineNo: newLine++,
        newContent: line.slice(1),
        newType: 'normal'
      });
    }
  }

  flushPending();
  return rows;
}

export async function getFileDiff(
  filePath: string,
  workspacePath?: string,
  commitHash?: string
): Promise<FileDiffResult> {
  try {
    const { repo, root } = await getRepo(workspacePath);
    let rawDiff = '';
    let status: 'modified' | 'added' | 'deleted' | 'untracked' = 'modified';

    const normalizedPath = filePath.replace(/\\/g, '/');

    if (commitHash) {
      try {
        const commit = repo.getCommit(commitHash);
        let parentTree: Tree | null = null;
        try {
          const parentOid = repo.revparseSingle(`${commitHash}~1`);
          if (parentOid) {
            parentTree = repo.getCommit(parentOid).tree();
          }
        } catch {}

        const diff = repo.diffTreeToTree(parentTree, commit.tree(), {
          pathspecs: [normalizedPath]
        });
        rawDiff = diff.print();
      } catch (err: any) {
        console.warn('[gitService] commit diff error:', err.message);
      }
    } else {
      let headTree: Tree | null = null;
      try {
        const headRef = repo.head();
        headTree = headRef.peelToTree();
      } catch {}

      try {
        const diff = repo.diffTreeToWorkdir(headTree, {
          pathspecs: [normalizedPath],
          includeUntracked: true,
          showUntrackedContent: true,
          recurseUntrackedDirs: true
        });
        rawDiff = diff.print();
      } catch {}

      // Fallback for untracked new files
      if (!rawDiff) {
        const fullPath = path.resolve(root, normalizedPath);
        const exists = await fs.access(fullPath).then(() => true).catch(() => false);
        if (exists) {
          status = 'untracked';
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split(/\r?\n/);
            rawDiff = `@@ -0,0 +1,${lines.length} @@\n` + lines.map((l) => `+${l}`).join('\n');
          } catch {}
        }
      }
    }

    const isBinary = rawDiff.includes('Binary files') || rawDiff.includes('GIT binary patch');
    const rows = isBinary ? [] : parseUnifiedDiff(rawDiff, normalizedPath);

    return {
      filePath: normalizedPath,
      rawDiff,
      isBinary,
      status,
      rows,
      lineEndingWarning:
        "This file uses 'LF' line endings, but Git is configured to convert them to 'CRLF' the next time the file is checked out."
    };
  } catch (err: any) {
    console.error('[gitService] getFileDiff error:', err);
    return {
      filePath,
      rawDiff: '',
      isBinary: false,
      status: 'modified',
      rows: []
    };
  }
}

export async function getGitHistory(
  maxCount = 40,
  workspacePath?: string
): Promise<GitCommitItem[]> {
  try {
    const { repo } = await getRepo(workspacePath);
    let headTarget = null;
    try {
      headTarget = repo.revparseSingle('HEAD');
    } catch {
      return [];
    }
    if (!headTarget) return [];

    const walker = repo.revwalk();
    walker.pushHead();
    walker.setSorting(RevwalkSort.Time);

    const commits: GitCommitItem[] = [];
    for (let i = 0; i < maxCount; i++) {
      const oid = walker.next();
      if (!oid) break;
      const c = repo.getCommit(oid);
      commits.push({
        hash: c.id(),
        shortHash: c.id().slice(0, 7),
        date: c.time().toISOString(),
        message: c.summary() || c.message(),
        body: c.body() || '',
        author_name: c.author().name,
        author_email: c.author().email
      });
    }

    return commits;
  } catch (err: any) {
    console.warn('[gitService] getGitHistory empty or error:', err.message);
    return [];
  }
}

export async function getCommitDetails(
  commitHash: string,
  workspacePath?: string
): Promise<CommitDetailsResult | null> {
  try {
    const { repo } = await getRepo(workspacePath);
    const commit = repo.getCommit(commitHash);
    if (!commit) return null;

    let parentTree: Tree | null = null;
    try {
      const parentOid = repo.revparseSingle(`${commitHash}~1`);
      if (parentOid) {
        parentTree = repo.getCommit(parentOid).tree();
      }
    } catch {}

    const diff = repo.diffTreeToTree(parentTree, commit.tree());
    const files: { path: string; filename: string; status: 'modified' | 'added' | 'deleted' }[] = [];

    const deltasIter = diff.deltas();
    let dItem = deltasIter.next();
    while (!dItem.done) {
      const delta = dItem.value;
      const newFile = delta.newFile();
      const filePath = (newFile.path() || delta.oldFile().path() || '').replace(/\\/g, '/');
      let st: 'modified' | 'added' | 'deleted' = 'modified';
      const deltaStatus = delta.status();
      if (deltaStatus === 'Added') st = 'added';
      else if (deltaStatus === 'Deleted') st = 'deleted';
      else st = 'modified';

      files.push({
        path: filePath,
        filename: path.basename(filePath),
        status: st
      });
      dItem = deltasIter.next();
    }

    return {
      hash: commit.id(),
      shortHash: commit.id().slice(0, 7),
      date: commit.time().toISOString(),
      message: commit.summary() || commit.message(),
      body: commit.body() || '',
      author_name: commit.author().name,
      author_email: commit.author().email,
      files
    };
  } catch (err: any) {
    console.error('[gitService] getCommitDetails error:', err);
    return null;
  }
}

export async function commitFiles(
  files: string[],
  summary: string,
  description?: string,
  workspacePath?: string
): Promise<{ success: boolean; commitHash?: string; ahead?: number; error?: string }> {
  try {
    const { repo } = await getRepo(workspacePath);
    if (!files || files.length === 0) {
      return { success: false, error: 'No files selected to commit' };
    }

    const index = repo.index();
    for (const f of files) {
      const norm = f.replace(/\\/g, '/');
      try {
        index.addPath(norm);
      } catch {
        index.addAll([norm]);
      }
    }
    index.write();
    const treeOid = index.writeTree();
    const tree = repo.getTree(treeOid);

    let authorName = 'Screen Designer';
    let authorEmail = 'designer@screen-designer.local';
    try {
      const cfg = repo.config();
      const n = cfg.findString('user.name');
      const e = cfg.findString('user.email');
      if (n) authorName = n;
      if (e) authorEmail = e;
    } catch {}
    const sig = createSignature(authorName, authorEmail);

    const parents: string[] = [];
    try {
      const headOid = repo.revparseSingle('HEAD');
      if (headOid) parents.push(headOid);
    } catch {}

    const fullMessage = description && description.trim()
      ? `${summary.trim()}\n\n${description.trim()}`
      : summary.trim();

    const commitOid = repo.commit(tree, fullMessage, {
      updateRef: 'HEAD',
      author: sig,
      committer: sig,
      parents
    });

    // Check updated ahead count
    let ahead = 1;
    try {
      const headRef = repo.head();
      const branch = headRef.shorthand() || 'main';
      const localBranch = repo.findBranch(branch, 'Local');
      const upstream = localBranch?.findUpstream();
      if (upstream) {
        const walker = repo.revwalk();
        walker.pushRange(`${upstream.name()}..HEAD`);
        let count = 0;
        while (walker.next()) count++;
        ahead = count;
      }
    } catch {}

    return {
      success: true,
      commitHash: commitOid,
      ahead
    };
  } catch (err: any) {
    console.error('[gitService] commitFiles error:', err);
    return { success: false, error: err.message };
  }
}

export async function pushCommits(
  workspacePath?: string
): Promise<{ success: boolean; ahead?: number; error?: string }> {
  try {
    const { repo, root } = await getRepo(workspacePath);
    let branch = 'main';
    try {
      branch = repo.head().shorthand() || 'main';
    } catch {}

    // First attempt native remote.push with es-git
    try {
      const remote = repo.getRemote('origin');
      await remote.push([`refs/heads/${branch}:refs/heads/${branch}`]);
    } catch (pushErr: any) {
      // Fallback using system git CLI for OS credential helpers
      try {
        execSync(`git push origin ${branch}`, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
      } catch (cliErr: any) {
        throw new Error(cliErr.message || pushErr.message);
      }
    }

    // Refresh ahead count
    let ahead = 0;
    try {
      const localBranch = repo.findBranch(branch, 'Local');
      const upstream = localBranch?.findUpstream();
      if (upstream) {
        const walker = repo.revwalk();
        walker.pushRange(`${upstream.name()}..HEAD`);
        while (walker.next()) ahead++;
      }
    } catch {}

    return {
      success: true,
      ahead
    };
  } catch (err: any) {
    console.error('[gitService] pushCommits error:', err);
    return { success: false, error: err.message };
  }
}
