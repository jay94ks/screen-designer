import {
  GitStatusInfo,
  GitCommitItem,
  FileDiffResult,
  CommitDetailsResult
} from '../types';
import { ensureElectronAPI, canUseHttpDevApi } from './electronBridge';

export const gitClient = {
  async getStatus(pageDocsPath = 'docs/ui-boards', workspacePath?: string): Promise<GitStatusInfo> {
    const api = ensureElectronAPI()?.git;
    if (api?.getStatus) {
      return api.getStatus(pageDocsPath, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageDocsPath, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('[gitClient] Failed to fetch git status via API', e);
      }
    }

    return {
      isRepo: false,
      branch: 'main',
      clean: true,
      uiChangesCount: 0,
      designChanges: [],
      allChangesCount: 0
    };
  },

  async getDiff(filePath: string, workspacePath?: string, commitHash?: string): Promise<FileDiffResult> {
    const api = ensureElectronAPI()?.git;
    if (api?.getDiff) {
      return api.getDiff(filePath, workspacePath, commitHash);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/diff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath, workspacePath, commitHash })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('[gitClient] Failed to fetch diff via API', e);
      }
    }

    return {
      filePath,
      rawDiff: '',
      isBinary: false,
      status: 'modified',
      rows: []
    };
  },

  async getHistory(maxCount = 40, workspacePath?: string): Promise<GitCommitItem[]> {
    const api = ensureElectronAPI()?.git;
    if (api?.getHistory) {
      return api.getHistory(maxCount, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maxCount, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('[gitClient] Failed to fetch git history via API', e);
      }
    }

    return [];
  },

  async getCommitDetails(commitHash: string, workspacePath?: string): Promise<CommitDetailsResult | null> {
    const api = ensureElectronAPI()?.git;
    if (api?.getCommitDetails) {
      return api.getCommitDetails(commitHash, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/commit-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commitHash, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('[gitClient] Failed to fetch commit details via API', e);
      }
    }

    return null;
  },

  async commit(
    files: string[],
    summary: string,
    description?: string,
    workspacePath?: string
  ): Promise<{ success: boolean; commitHash?: string; ahead?: number; error?: string }> {
    const api = ensureElectronAPI()?.git;
    if (api?.commit) {
      return api.commit(files, summary, description, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files, summary, description, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    return { success: false, error: 'Git commit not available' };
  },

  async push(workspacePath?: string): Promise<{ success: boolean; ahead?: number; error?: string }> {
    const api = ensureElectronAPI()?.git;
    if (api?.push) {
      return api.push(workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/git/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    return { success: false, error: 'Git push not available' };
  }
};
