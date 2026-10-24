import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { WebSocket } from 'ws';
import { simpleGit } from 'simple-git';
import {
  getGitStatus,
  getFileDiff,
  getGitHistory,
  getCommitDetails,
  commitFiles,
  pushCommits
} from './gitService';
import {
  materializePresets,
  copyAssetFile,
  listAssets
} from './assetService';
import {
  saveProjectStructure,
  loadProjectStructure,
  migrateProjectFolder
} from './projectService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let ws: WebSocket | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Hide native OS window caption / titlebar
    title: 'Screen Designer - Live Storyboard Canvas',
    backgroundColor: '#020617',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.on('maximize', () => {
    win?.webContents.send('window:maximized-change', true);
  });

  win.on('unmaximize', () => {
    win?.webContents.send('window:maximized-change', false);
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'));
  }

  setupWebSocket();
}

function setupWebSocket() {
  const tryConnect = () => {
    try {
      ws = new WebSocket('ws://localhost:49494');

      ws.on('open', () => {
        console.log('[Electron Main] Connected to Screen Designer MCP Bridge');
        win?.webContents.send('bridge-status', { connected: true });
      });

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          win?.webContents.send('bridge-message', msg);
        } catch (e) {
          console.error('Failed to parse bridge msg', e);
        }
      });

      ws.on('close', () => {
        win?.webContents.send('bridge-status', { connected: false });
        setTimeout(tryConnect, 2000);
      });

      ws.on('error', () => {
        ws?.close();
      });
    } catch (e) {
      setTimeout(tryConnect, 2000);
    }
  };

  tryConnect();
}

ipcMain.on('renderer-to-bridge', (_, payload) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
});

// Window Control IPC Handlers (Custom Caption)
ipcMain.on('window:minimize', () => {
  win?.minimize();
});

ipcMain.on('window:maximize', () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  win?.close();
});

ipcMain.handle('window:isMaximized', () => {
  return win ? win.isMaximized() : false;
});

ipcMain.on('window:drag-by', (_, { dx, dy }) => {
  if (win && !win.isMaximized()) {
    const [x, y] = win.getPosition();
    win.setPosition(Math.round(x + dx), Math.round(y + dy));
  }
});

// Project Storage IPC Handlers (project.json, design-system.json, pages/{number}.json, assets/)
ipcMain.handle('project:save-project', async (_, { project, pages, designSystem, pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  return saveProjectStructure({ project, pages, designSystem, pageDocsPath, workspacePath });
});

ipcMain.handle('project:load-project', async (_, { pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  return loadProjectStructure({ pageDocsPath, workspacePath });
});

ipcMain.handle('project:migrate-folder', async (_, { oldPath, newPath, workspacePath }) => {
  return migrateProjectFolder({ oldPath, newPath, workspacePath });
});

// Legacy backwards compatibility aliases
ipcMain.handle('project:save-page', async (_, { page, pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  return saveProjectStructure({
    pages: [page],
    pageDocsPath,
    workspacePath
  });
});

ipcMain.handle('project:load-pages', async (_, { pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  const result = await loadProjectStructure({ pageDocsPath, workspacePath });
  return {
    success: result.success,
    pages: result.pages,
    docsDir: result.docsDir,
    error: result.error
  };
});

ipcMain.handle('project:get-config', async (_, { workspacePath }) => {
  try {
    const rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
    const configPath = path.join(rootDir, '.screen-designer', 'config.json');
    const raw = await fs.promises.readFile(configPath, 'utf-8');
    return { success: true, config: JSON.parse(raw) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});

// Git Status & Version Control IPC Handlers (node.js simple-git)
ipcMain.handle('git:get-status', async (_, { pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  return getGitStatus(pageDocsPath, workspacePath);
});

ipcMain.handle('git:get-diff', async (_, { filePath, workspacePath, commitHash }) => {
  return getFileDiff(filePath, workspacePath, commitHash);
});

ipcMain.handle('git:get-history', async (_, { maxCount = 40, workspacePath }) => {
  return getGitHistory(maxCount, workspacePath);
});

ipcMain.handle('git:get-commit-details', async (_, { commitHash, workspacePath }) => {
  return getCommitDetails(commitHash, workspacePath);
});

ipcMain.handle('git:commit', async (_, { files, summary, description, workspacePath }) => {
  return commitFiles(files, summary, description, workspacePath);
});

ipcMain.handle('git:push', async (_, { workspacePath }) => {
  return pushCommits(workspacePath);
});

ipcMain.handle('git:commit-design', async (_, { message, pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  const rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
  return commitFiles([pageDocsPath, '.screen-designer', 'assets'], message || 'feat(ui): update storyboard canvas design documents and assets', undefined, rootDir);
});

// Assets Management IPC Handlers
ipcMain.handle('assets:materialize-presets', async (_, { workspacePath } = {}) => {
  return materializePresets(workspacePath);
});

ipcMain.handle('assets:choose-and-copy', async (_, { workspacePath } = {}) => {
  const rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
  const result = await dialog.showOpenDialog(win!, {
    title: '이미지 파일 선택 (assets 폴더로 자동 복사)',
    buttonLabel: '선택 및 복사',
    properties: ['openFile'],
    filters: [
      { name: '이미지 파일 (Images)', extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp', 'avif'] },
      { name: '모든 파일 (All Files)', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePaths.length) {
    return { canceled: true };
  }

  const sourcePath = result.filePaths[0];
  const copyResult = await copyAssetFile(sourcePath, rootDir);
  return { canceled: false, ...copyResult };
});

ipcMain.handle('assets:list', async (_, { workspacePath } = {}) => {
  return listAssets(workspacePath);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(async () => {
  try {
    await materializePresets();
  } catch (err) {
    console.error('[Electron Main] Error materializing image presets:', err);
  }
  createWindow();
});
