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

// Project Storage IPC Handlers (.screen-designer/ & per-page JSON document)
ipcMain.handle('project:save-page', async (_, { page, pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  try {
    const rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
    const dotDir = path.join(rootDir, '.screen-designer');
    const cacheDir = path.join(dotDir, 'cache');
    const docsDir = path.join(rootDir, pageDocsPath);

    await fs.promises.mkdir(dotDir, { recursive: true });
    await fs.promises.mkdir(cacheDir, { recursive: true });
    await fs.promises.mkdir(docsDir, { recursive: true });

    // 1. Save page document as structured VDOM JSON
    const pageFileName = `${page.id}.json`;
    const pageFilePath = path.join(docsDir, pageFileName);
    const pageDoc = {
      id: page.id,
      name: page.name,
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      artboards: page.artboards || []
    };
    await fs.promises.writeFile(pageFilePath, JSON.stringify(pageDoc, null, 2), 'utf-8');

    // 2. Update .screen-designer/config.json
    const configPath = path.join(dotDir, 'config.json');
    let existingConfig: any = {};
    try {
      const raw = await fs.promises.readFile(configPath, 'utf-8');
      existingConfig = JSON.parse(raw);
    } catch {}

    const updatedConfig = {
      ...existingConfig,
      version: '1.0.0',
      pageDocsPath,
      lastActivePage: page.id,
      updatedAt: new Date().toISOString()
    };
    await fs.promises.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    // 3. Cache metadata
    const cacheManifest = path.join(cacheDir, 'manifest.json');
    await fs.promises.writeFile(cacheManifest, JSON.stringify({
      lastSavedPage: page.id,
      lastSavedFile: pageFilePath,
      savedAt: new Date().toISOString()
    }, null, 2), 'utf-8');

    return { success: true, savedPath: pageFilePath };
  } catch (err: any) {
    console.error('[Electron Main] Save page error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('project:load-pages', async (_, { pageDocsPath = 'docs/ui-boards', workspacePath }) => {
  try {
    const rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
    const docsDir = path.join(rootDir, pageDocsPath);

    await fs.promises.mkdir(docsDir, { recursive: true });
    const files = await fs.promises.readdir(docsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const pages = [];
    for (const f of jsonFiles) {
      try {
        const raw = await fs.promises.readFile(path.join(docsDir, f), 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && parsed.name) {
          pages.push(parsed);
        }
      } catch (e) {
        console.error(`Failed to parse page file: ${f}`, e);
      }
    }

    return { success: true, pages, docsDir };
  } catch (err: any) {
    console.error('[Electron Main] Load pages error:', err);
    return { success: false, pages: [], error: err.message };
  }
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
