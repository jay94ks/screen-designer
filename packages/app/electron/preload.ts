import { ipcRenderer } from 'electron';

// Expose safe IPC to renderer
(window as any).electronAPI = {
  onBridgeStatus: (callback: (status: { connected: boolean }) => void) => {
    ipcRenderer.on('bridge-status', (_, data) => callback(data));
  },
  onBridgeMessage: (callback: (msg: any) => void) => {
    ipcRenderer.on('bridge-message', (_, data) => callback(data));
  },
  sendToBridge: (msg: any) => {
    ipcRenderer.send('renderer-to-bridge', msg);
  },
  // Custom Window Caption Controls
  minimizeWindow: () => {
    ipcRenderer.send('window:minimize');
  },
  maximizeWindow: () => {
    ipcRenderer.send('window:maximize');
  },
  closeWindow: () => {
    ipcRenderer.send('window:close');
  },
  toggleDevTools: () => {
    ipcRenderer.send('window:toggle-devtools');
  },
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizedChange: (callback: (maximized: boolean) => void) => {
    ipcRenderer.on('window:maximized-change', (_, val) => callback(val));
  },
  dragWindow: (dx: number, dy: number) => {
    ipcRenderer.send('window:drag-by', { dx, dy });
  },
  // Project Storage (project.json, design-system.json, pages/{number}.json, assets/)
  project: {
    saveProject: (data: { project?: any; pages: any[]; designSystem?: any; pageDocsPath?: string; workspacePath?: string }) =>
      ipcRenderer.invoke('project:save-project', data),
    loadProject: (pageDocsPath?: string, workspacePath?: string) =>
      ipcRenderer.invoke('project:load-project', { pageDocsPath, workspacePath }),
    migrateFolder: (oldPath: string, newPath: string, workspacePath?: string) =>
      ipcRenderer.invoke('project:migrate-folder', { oldPath, newPath, workspacePath }),
    savePage: (page: any, pageDocsPath: string, workspacePath?: string) =>
      ipcRenderer.invoke('project:save-page', { page, pageDocsPath, workspacePath }),
    loadPages: (pageDocsPath: string, workspacePath?: string) =>
      ipcRenderer.invoke('project:load-pages', { pageDocsPath, workspacePath }),
    getConfig: (workspacePath?: string) =>
      ipcRenderer.invoke('project:get-config', { workspacePath })
  },
  // Git Status & Version Control
  git: {
    getStatus: (pageDocsPath: string, workspacePath?: string) =>
      ipcRenderer.invoke('git:get-status', { pageDocsPath, workspacePath }),
    getDiff: (filePath: string, workspacePath?: string, commitHash?: string) =>
      ipcRenderer.invoke('git:get-diff', { filePath, workspacePath, commitHash }),
    getHistory: (maxCount?: number, workspacePath?: string) =>
      ipcRenderer.invoke('git:get-history', { maxCount, workspacePath }),
    getCommitDetails: (commitHash: string, workspacePath?: string) =>
      ipcRenderer.invoke('git:get-commit-details', { commitHash, workspacePath }),
    commit: (files: string[], summary: string, description?: string, workspacePath?: string) =>
      ipcRenderer.invoke('git:commit', { files, summary, description, workspacePath }),
    push: (workspacePath?: string) =>
      ipcRenderer.invoke('git:push', { workspacePath }),
    commitDesign: (message: string, pageDocsPath: string, workspacePath?: string) =>
      ipcRenderer.invoke('git:commit-design', { message, pageDocsPath, workspacePath })
  },
  // Assets Management
  assets: {
    materializePresets: (workspacePath?: string) =>
      ipcRenderer.invoke('assets:materialize-presets', { workspacePath }),
    chooseAndCopy: (workspacePath?: string) =>
      ipcRenderer.invoke('assets:choose-and-copy', { workspacePath }),
    list: (workspacePath?: string) =>
      ipcRenderer.invoke('assets:list', { workspacePath })
  }
};
