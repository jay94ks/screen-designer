import { ensureElectronAPI, canUseHttpDevApi } from './electronBridge';

export interface ProjectSavePayload {
  project?: {
    name?: string;
    version?: string;
    activePageId?: string;
    assets?: string[];
    settings?: Record<string, any>;
  };
  pages: Array<{
    id: string;
    name: string;
    number?: number;
    artboards?: any[];
    [key: string]: any;
  }>;
  designSystem?: {
    version?: string;
    updatedAt?: string;
    theme?: string;
    componentDefaults?: Record<string, any>;
    canvasBackground?: string;
    gridSize?: number;
    [key: string]: any;
  };
  pageDocsPath?: string;
  workspacePath?: string;
}

export const projectClient = {
  async saveProject(payload: ProjectSavePayload): Promise<{ success: boolean; docsDir?: string; error?: string }> {
    const api = ensureElectronAPI()?.project;
    if (api?.saveProject) {
      return api.saveProject(payload);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/project/save-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e: any) {
        console.warn('[projectClient] Failed to save project via API', e);
        return { success: false, error: e.message };
      }
    }

    return { success: false, error: 'No storage API available' };
  },

  async loadProject(pageDocsPath = 'docs/ui-boards', workspacePath?: string): Promise<{
    success: boolean;
    project?: any;
    designSystem?: any;
    pages: any[];
    docsDir?: string;
    error?: string;
  }> {
    const api = ensureElectronAPI()?.project;
    if (api?.loadProject) {
      return api.loadProject(pageDocsPath, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/project/load-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageDocsPath, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e: any) {
        console.warn('[projectClient] Failed to load project via API', e);
        return { success: false, pages: [], error: e.message };
      }
    }

    return { success: false, pages: [] };
  },

  async migrateFolder(oldPath: string, newPath: string, workspacePath?: string): Promise<{
    success: boolean;
    movedFilesCount?: number;
    oldPath: string;
    newPath: string;
    error?: string;
  }> {
    const api = ensureElectronAPI()?.project;
    if (api?.migrateFolder) {
      return api.migrateFolder(oldPath, newPath, workspacePath);
    }

    if (canUseHttpDevApi()) {
      try {
        const res = await fetch('/api/project/migrate-folder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPath, newPath, workspacePath })
        });
        if (res.ok) return await res.json();
      } catch (e: any) {
        console.warn('[projectClient] Failed to migrate folder via API', e);
        return { success: false, oldPath, newPath, error: e.message };
      }
    }

    return { success: false, oldPath, newPath, error: 'No migration API available' };
  }
};
