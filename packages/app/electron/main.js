var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { WebSocket } from 'ws';
import { getGitStatus, getFileDiff, getGitHistory, getCommitDetails, commitFiles, pushCommits } from './gitService';
import { materializePresets, copyAssetFile, listAssets } from './assetService';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public');
var win;
var ws = null;
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
    win.on('maximize', function () {
        win === null || win === void 0 ? void 0 : win.webContents.send('window:maximized-change', true);
    });
    win.on('unmaximize', function () {
        win === null || win === void 0 ? void 0 : win.webContents.send('window:maximized-change', false);
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else {
        win.loadFile(path.join(process.env.DIST || '', 'index.html'));
    }
    setupWebSocket();
}
function setupWebSocket() {
    var tryConnect = function () {
        try {
            ws = new WebSocket('ws://localhost:49494');
            ws.on('open', function () {
                console.log('[Electron Main] Connected to Screen Designer MCP Bridge');
                win === null || win === void 0 ? void 0 : win.webContents.send('bridge-status', { connected: true });
            });
            ws.on('message', function (data) {
                try {
                    var msg = JSON.parse(data.toString());
                    win === null || win === void 0 ? void 0 : win.webContents.send('bridge-message', msg);
                }
                catch (e) {
                    console.error('Failed to parse bridge msg', e);
                }
            });
            ws.on('close', function () {
                win === null || win === void 0 ? void 0 : win.webContents.send('bridge-status', { connected: false });
                setTimeout(tryConnect, 2000);
            });
            ws.on('error', function () {
                ws === null || ws === void 0 ? void 0 : ws.close();
            });
        }
        catch (e) {
            setTimeout(tryConnect, 2000);
        }
    };
    tryConnect();
}
ipcMain.on('renderer-to-bridge', function (_, payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
});
// Window Control IPC Handlers (Custom Caption)
ipcMain.on('window:minimize', function () {
    win === null || win === void 0 ? void 0 : win.minimize();
});
ipcMain.on('window:maximize', function () {
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        }
        else {
            win.maximize();
        }
    }
});
ipcMain.on('window:close', function () {
    win === null || win === void 0 ? void 0 : win.close();
});
ipcMain.handle('window:isMaximized', function () {
    return win ? win.isMaximized() : false;
});
ipcMain.on('window:drag-by', function (_, _a) {
    var dx = _a.dx, dy = _a.dy;
    if (win && !win.isMaximized()) {
        var _b = win.getPosition(), x = _b[0], y = _b[1];
        win.setPosition(Math.round(x + dx), Math.round(y + dy));
    }
});
// Project Storage IPC Handlers (.screen-designer/ & per-page JSON document)
ipcMain.handle('project:save-page', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var rootDir, dotDir, cacheDir, docsDir, pageFileName, pageFilePath, pageDoc, configPath, existingConfig, raw, _c, updatedConfig, cacheManifest, err_1;
    var page = _b.page, _d = _b.pageDocsPath, pageDocsPath = _d === void 0 ? 'docs/ui-boards' : _d, workspacePath = _b.workspacePath;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 11, , 12]);
                rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
                dotDir = path.join(rootDir, '.screen-designer');
                cacheDir = path.join(dotDir, 'cache');
                docsDir = path.join(rootDir, pageDocsPath);
                return [4 /*yield*/, fs.promises.mkdir(dotDir, { recursive: true })];
            case 1:
                _e.sent();
                return [4 /*yield*/, fs.promises.mkdir(cacheDir, { recursive: true })];
            case 2:
                _e.sent();
                return [4 /*yield*/, fs.promises.mkdir(docsDir, { recursive: true })];
            case 3:
                _e.sent();
                pageFileName = "".concat(page.id, ".json");
                pageFilePath = path.join(docsDir, pageFileName);
                pageDoc = {
                    id: page.id,
                    name: page.name,
                    version: '1.0.0',
                    updatedAt: new Date().toISOString(),
                    artboards: page.artboards || []
                };
                return [4 /*yield*/, fs.promises.writeFile(pageFilePath, JSON.stringify(pageDoc, null, 2), 'utf-8')];
            case 4:
                _e.sent();
                configPath = path.join(dotDir, 'config.json');
                existingConfig = {};
                _e.label = 5;
            case 5:
                _e.trys.push([5, 7, , 8]);
                return [4 /*yield*/, fs.promises.readFile(configPath, 'utf-8')];
            case 6:
                raw = _e.sent();
                existingConfig = JSON.parse(raw);
                return [3 /*break*/, 8];
            case 7:
                _c = _e.sent();
                return [3 /*break*/, 8];
            case 8:
                updatedConfig = __assign(__assign({}, existingConfig), { version: '1.0.0', pageDocsPath: pageDocsPath, lastActivePage: page.id, updatedAt: new Date().toISOString() });
                return [4 /*yield*/, fs.promises.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8')];
            case 9:
                _e.sent();
                cacheManifest = path.join(cacheDir, 'manifest.json');
                return [4 /*yield*/, fs.promises.writeFile(cacheManifest, JSON.stringify({
                        lastSavedPage: page.id,
                        lastSavedFile: pageFilePath,
                        savedAt: new Date().toISOString()
                    }, null, 2), 'utf-8')];
            case 10:
                _e.sent();
                return [2 /*return*/, { success: true, savedPath: pageFilePath }];
            case 11:
                err_1 = _e.sent();
                console.error('[Electron Main] Save page error:', err_1);
                return [2 /*return*/, { success: false, error: err_1.message }];
            case 12: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('project:load-pages', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var rootDir, docsDir, files, jsonFiles, pages, _i, jsonFiles_1, f, raw, parsed, e_1, err_2;
    var _c = _b.pageDocsPath, pageDocsPath = _c === void 0 ? 'docs/ui-boards' : _c, workspacePath = _b.workspacePath;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 9, , 10]);
                rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
                docsDir = path.join(rootDir, pageDocsPath);
                return [4 /*yield*/, fs.promises.mkdir(docsDir, { recursive: true })];
            case 1:
                _d.sent();
                return [4 /*yield*/, fs.promises.readdir(docsDir)];
            case 2:
                files = _d.sent();
                jsonFiles = files.filter(function (f) { return f.endsWith('.json'); });
                pages = [];
                _i = 0, jsonFiles_1 = jsonFiles;
                _d.label = 3;
            case 3:
                if (!(_i < jsonFiles_1.length)) return [3 /*break*/, 8];
                f = jsonFiles_1[_i];
                _d.label = 4;
            case 4:
                _d.trys.push([4, 6, , 7]);
                return [4 /*yield*/, fs.promises.readFile(path.join(docsDir, f), 'utf-8')];
            case 5:
                raw = _d.sent();
                parsed = JSON.parse(raw);
                if (parsed && parsed.id && parsed.name) {
                    pages.push(parsed);
                }
                return [3 /*break*/, 7];
            case 6:
                e_1 = _d.sent();
                console.error("Failed to parse page file: ".concat(f), e_1);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8: return [2 /*return*/, { success: true, pages: pages, docsDir: docsDir }];
            case 9:
                err_2 = _d.sent();
                console.error('[Electron Main] Load pages error:', err_2);
                return [2 /*return*/, { success: false, pages: [], error: err_2.message }];
            case 10: return [2 /*return*/];
        }
    });
}); });
ipcMain.handle('project:get-config', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var rootDir, configPath, raw, err_3;
    var workspacePath = _b.workspacePath;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
                configPath = path.join(rootDir, '.screen-designer', 'config.json');
                return [4 /*yield*/, fs.promises.readFile(configPath, 'utf-8')];
            case 1:
                raw = _c.sent();
                return [2 /*return*/, { success: true, config: JSON.parse(raw) }];
            case 2:
                err_3 = _c.sent();
                return [2 /*return*/, { success: false, error: err_3.message }];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Git Status & Version Control IPC Handlers (node.js simple-git)
ipcMain.handle('git:get-status', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var _c = _b.pageDocsPath, pageDocsPath = _c === void 0 ? 'docs/ui-boards' : _c, workspacePath = _b.workspacePath;
    return __generator(this, function (_d) {
        return [2 /*return*/, getGitStatus(pageDocsPath, workspacePath)];
    });
}); });
ipcMain.handle('git:get-diff', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var filePath = _b.filePath, workspacePath = _b.workspacePath, commitHash = _b.commitHash;
    return __generator(this, function (_c) {
        return [2 /*return*/, getFileDiff(filePath, workspacePath, commitHash)];
    });
}); });
ipcMain.handle('git:get-history', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var _c = _b.maxCount, maxCount = _c === void 0 ? 40 : _c, workspacePath = _b.workspacePath;
    return __generator(this, function (_d) {
        return [2 /*return*/, getGitHistory(maxCount, workspacePath)];
    });
}); });
ipcMain.handle('git:get-commit-details', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var commitHash = _b.commitHash, workspacePath = _b.workspacePath;
    return __generator(this, function (_c) {
        return [2 /*return*/, getCommitDetails(commitHash, workspacePath)];
    });
}); });
ipcMain.handle('git:commit', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var files = _b.files, summary = _b.summary, description = _b.description, workspacePath = _b.workspacePath;
    return __generator(this, function (_c) {
        return [2 /*return*/, commitFiles(files, summary, description, workspacePath)];
    });
}); });
ipcMain.handle('git:push', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var workspacePath = _b.workspacePath;
    return __generator(this, function (_c) {
        return [2 /*return*/, pushCommits(workspacePath)];
    });
}); });
ipcMain.handle('git:commit-design', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var rootDir;
    var message = _b.message, _c = _b.pageDocsPath, pageDocsPath = _c === void 0 ? 'docs/ui-boards' : _c, workspacePath = _b.workspacePath;
    return __generator(this, function (_d) {
        rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
        return [2 /*return*/, commitFiles([pageDocsPath, '.screen-designer', 'assets'], message || 'feat(ui): update storyboard canvas design documents and assets', undefined, rootDir)];
    });
}); });
// Assets Management IPC Handlers
ipcMain.handle('assets:materialize-presets', function (_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([_1], args_1, true), void 0, function (_, _a) {
        var _b = _a === void 0 ? {} : _a, workspacePath = _b.workspacePath;
        return __generator(this, function (_c) {
            return [2 /*return*/, materializePresets(workspacePath)];
        });
    });
});
ipcMain.handle('assets:choose-and-copy', function (_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([_1], args_1, true), void 0, function (_, _a) {
        var rootDir, result, sourcePath, copyResult;
        var _b = _a === void 0 ? {} : _a, workspacePath = _b.workspacePath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rootDir = workspacePath || process.env.SCREEN_DESIGNER_WORKSPACE || process.cwd();
                    return [4 /*yield*/, dialog.showOpenDialog(win, {
                            title: '이미지 파일 선택 (assets 폴더로 자동 복사)',
                            buttonLabel: '선택 및 복사',
                            properties: ['openFile'],
                            filters: [
                                { name: '이미지 파일 (Images)', extensions: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'bmp', 'avif'] },
                                { name: '모든 파일 (All Files)', extensions: ['*'] }
                            ]
                        })];
                case 1:
                    result = _c.sent();
                    if (result.canceled || !result.filePaths.length) {
                        return [2 /*return*/, { canceled: true }];
                    }
                    sourcePath = result.filePaths[0];
                    return [4 /*yield*/, copyAssetFile(sourcePath, rootDir)];
                case 2:
                    copyResult = _c.sent();
                    return [2 /*return*/, __assign({ canceled: false }, copyResult)];
            }
        });
    });
});
ipcMain.handle('assets:list', function (_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([_1], args_1, true), void 0, function (_, _a) {
        var _b = _a === void 0 ? {} : _a, workspacePath = _b.workspacePath;
        return __generator(this, function (_c) {
            return [2 /*return*/, listAssets(workspacePath)];
        });
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.whenReady().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, materializePresets()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error('[Electron Main] Error materializing image presets:', err_4);
                return [3 /*break*/, 3];
            case 3:
                createWindow();
                return [2 /*return*/];
        }
    });
}); });
