// Ensures window.electronAPI is always initialized when running inside Electron
// even if the preload script was bypassed or reloaded.

export function ensureElectronAPI(): any {
  if (typeof window === 'undefined') return undefined;
  const win = window as any;
  if (win.electronAPI) return win.electronAPI;

  try {
    const req = win.require;
    if (typeof req === 'function') {
      const electron = req('electron');
      const ipcRenderer = electron?.ipcRenderer;
      if (ipcRenderer) {
        win.electronAPI = {
          onBridgeStatus: (callback: (status: { connected: boolean }) => void) => {
            ipcRenderer.on('bridge-status', (_: any, data: any) => callback(data));
          },
          onBridgeMessage: (callback: (msg: any) => void) => {
            ipcRenderer.on('bridge-message', (_: any, data: any) => callback(data));
          },
          sendToBridge: (msg: any) => {
            ipcRenderer.send('renderer-to-bridge', msg);
          },
          minimizeWindow: () => ipcRenderer.send('window:minimize'),
          maximizeWindow: () => ipcRenderer.send('window:maximize'),
          closeWindow: () => ipcRenderer.send('window:close'),
          toggleDevTools: () => ipcRenderer.send('window:toggle-devtools'),
          isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
          onMaximizedChange: (callback: (maximized: boolean) => void) => {
            ipcRenderer.on('window:maximized-change', (_: any, val: boolean) => callback(val));
          },
          dragWindow: (dx: number, dy: number) => {
            ipcRenderer.send('window:drag-by', { dx, dy });
          },
          project: {
            saveProject: (data: any) => ipcRenderer.invoke('project:save-project', data),
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
          assets: {
            materializePresets: (workspacePath?: string) =>
              ipcRenderer.invoke('assets:materialize-presets', { workspacePath }),
            chooseAndCopy: (workspacePath?: string) =>
              ipcRenderer.invoke('assets:choose-and-copy', { workspacePath }),
            list: (workspacePath?: string) =>
              ipcRenderer.invoke('assets:list', { workspacePath })
          }
        };
        return win.electronAPI;
      }
    }
  } catch {}

  return win.electronAPI;
}

export function canUseHttpDevApi(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}
