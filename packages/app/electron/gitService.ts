import { promises as fs } from 'fs';
import path from 'path';
import { simpleGit, SimpleGit } from 'simple-git';

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
  if (workspacePath) return workspacePath;
  if (process.env.SCREEN_DESIGNER_WORKSPACE) return process.env.SCREEN_DESIGNER_WORKSPACE;
  if (cachedRoot) return cachedRoot;
  try {
    const git = simpleGit(process.cwd());
    const top = await git.revparse(['--show-toplevel']);
    if (top) {
      cachedRoot = top.trim();
      return cachedRoot;
    }
  } catch {}
  return process.cwd();
}

async function getGit(workspacePath?: string): Promise<{ git: SimpleGit; root: string }> {
  const root = await getRepoRoot(workspacePath);
  return { git: simpleGit(root), root };
}

export async function getGitStatus(
  pageDocsPath = 'docs/ui-boards',
  workspacePath?: string
): Promise<GitStatusResult> {
  try {
    const { git } = await getGit(workspacePath);
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
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
        allChanges: []
      };
    }

    const status = await git.status();
    const normDocsPath = pageDocsPath.replace(/^\/+|\/+$/g, '');

    const allChanges: DesignGitChange[] = status.files.map((f) => {
      let st: 'modified' | 'added' | 'deleted' | 'untracked' = 'modified';
      if (f.index === '?' || f.working_dir === '?') st = 'untracked';
      else if (f.index === 'A' || f.working_dir === 'A') st = 'added';
      else if (f.index === 'D' || f.working_dir === 'D') st = 'deleted';

      return {
        path: f.path,
        filename: path.basename(f.path),
        status: st
      };
    });

    const designChanges = allChanges.filter(
      (c) => c.path.startsWith(normDocsPath) || c.path.startsWith('.screen-designer')
    );

    return {
      isRepo: true,
      branch: status.current || 'main',
      tracking: status.tracking || '',
      ahead: status.ahead || 0,
      behind: status.behind || 0,
      clean: allChanges.length === 0,
      uiChangesCount: designChanges.length,
      designChanges,
      allChangesCount: allChanges.length,
      allChanges
    };
  } catch (err: any) {
    console.error('[gitService] getGitStatus error:', err);
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
    const { git, root } = await getGit(workspacePath);
    let rawDiff = '';
    let status: 'modified' | 'added' | 'deleted' | 'untracked' = 'modified';

    if (commitHash) {
      // Diff in specific commit
      try {
        rawDiff = await git.diff([`${commitHash}^!`, '--', filePath]);
      } catch {}
      if (!rawDiff) {
        // Fallback: show file content at commit
        const content = await git.show([`${commitHash}:${filePath}`]).catch(() => '');
        rawDiff = content
          ? `@@ -0,0 +1,${content.split('\n').length} @@\n` +
            content.split('\n').map((l) => `+${l}`).join('\n')
          : '';
      }
    } else {
      // Working tree / staged diff
      const st = await git.status();
      const fileEntry = st.files.find((f) => f.path === filePath);

      if (fileEntry && (fileEntry.index === '?' || fileEntry.working_dir === '?')) {
        status = 'untracked';
        const fullPath = path.resolve(root, filePath);
        const exists = await fs.access(fullPath).then(() => true).catch(() => false);
        if (exists) {
          try {
            rawDiff = await git.raw(['diff', '--no-index', '--', '/dev/null', filePath]);
          } catch (e: any) {
            rawDiff = e.stdout || '';
          }
          if (!rawDiff) {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split(/\r?\n/);
            rawDiff = `@@ -0,0 +1,${lines.length} @@\n` + lines.map((l) => `+${l}`).join('\n');
          }
        }
      } else {
        // Check if repo has HEAD
        const hasHead = await git.revparse(['HEAD']).then(() => true).catch(() => false);
        if (hasHead) {
          rawDiff = await git.diff(['HEAD', '--', filePath]);
          if (!rawDiff) {
            rawDiff = await git.diff(['--', filePath]);
          }
        } else {
          // Empty repo with no commits yet
          try {
            rawDiff = await git.raw(['diff', '--no-index', '--', '/dev/null', filePath]);
          } catch (e: any) {
            rawDiff = e.stdout || '';
          }
          if (!rawDiff) {
            const fullPath = path.resolve(root, filePath);
            const exists = await fs.access(fullPath).then(() => true).catch(() => false);
            if (exists) {
              const content = await fs.readFile(fullPath, 'utf-8');
              const lines = content.split(/\r?\n/);
              rawDiff = `@@ -0,0 +1,${lines.length} @@\n` + lines.map((l) => `+${l}`).join('\n');
            }
          }
        }
      }
    }

    const isBinary = rawDiff.includes('Binary files') || rawDiff.includes('GIT binary patch');
    const rows = isBinary ? [] : parseUnifiedDiff(rawDiff, filePath);

    return {
      filePath,
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
    const { git } = await getGit(workspacePath);
    const hasHead = await git.revparse(['HEAD']).then(() => true).catch(() => false);
    if (!hasHead) return [];

    const log = await git.log({ maxCount });
    return log.all.map((c) => ({
      hash: c.hash,
      shortHash: c.hash.slice(0, 7),
      date: c.date,
      message: c.message,
      body: c.body || '',
      author_name: c.author_name,
      author_email: c.author_email,
      refs: c.refs
    }));
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
    const { git } = await getGit(workspacePath);
    const log = await git.log({ from: `${commitHash}~1`, to: commitHash, maxCount: 1 }).catch(async () => {
      return git.log({ maxCount: 1 });
    });

    const commit = log.latest || log.all[0];
    if (!commit) return null;

    const rawStat = await git.show(['--name-status', '--format=', commitHash]);
    const files: { path: string; filename: string; status: 'modified' | 'added' | 'deleted' }[] = [];

    const lines = rawStat.split('\n');
    for (const l of lines) {
      const parts = l.trim().split(/\s+/);
      if (parts.length >= 2) {
        const type = parts[0];
        const p = parts.slice(1).join(' ');
        let st: 'modified' | 'added' | 'deleted' = 'modified';
        if (type.startsWith('A')) st = 'added';
        else if (type.startsWith('D')) st = 'deleted';
        files.push({
          path: p,
          filename: path.basename(p),
          status: st
        });
      }
    }

    return {
      hash: commit.hash,
      shortHash: commit.hash.slice(0, 7),
      date: commit.date,
      message: commit.message,
      body: commit.body || '',
      author_name: commit.author_name,
      author_email: commit.author_email,
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
    const { git } = await getGit(workspacePath);
    if (!files || files.length === 0) {
      return { success: false, error: 'No files selected to commit' };
    }

    await git.add(files);
    const fullMessage = description && description.trim()
      ? `${summary.trim()}\n\n${description.trim()}`
      : summary.trim();

    const result = await git.commit(fullMessage);
    const st = await git.status();

    return {
      success: true,
      commitHash: result.commit,
      ahead: st.ahead || 1
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
    const { git } = await getGit(workspacePath);
    const st = await git.status();
    const branch = st.current || 'main';

    // Push to current branch or origin
    try {
      await git.push('origin', branch);
    } catch {
      // Try setting upstream if needed
      await git.push(['-u', 'origin', branch]);
    }

    const updatedStatus = await git.status();
    return {
      success: true,
      ahead: updatedStatus.ahead || 0
    };
  } catch (err: any) {
    console.error('[gitService] pushCommits error:', err);
    return { success: false, error: err.message };
  }
}
