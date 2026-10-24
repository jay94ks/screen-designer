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
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';
import fs from 'fs';
import { getGitStatus, getFileDiff, getGitHistory, getCommitDetails, commitFiles, pushCommits } from './electron/gitService';
import { materializePresets, listAssets, getMimeType } from './electron/assetService';
function gitApiPlugin() {
    return {
        name: 'screen-designer-git-api',
        configureServer: function (server) {
            var _this = this;
            server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var endpoint, body, data, data, data, data, data, data, err_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/git/')))
                                return [2 /*return*/, next()];
                            endpoint = req.url.replace('/api/git/', '').split('?')[0];
                            body = {};
                            if (!(req.method === 'POST')) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var data = '';
                                    req.on('data', function (chunk) { return (data += chunk); });
                                    req.on('end', function () {
                                        try {
                                            resolve(data ? JSON.parse(data) : {});
                                        }
                                        catch (_a) {
                                            resolve({});
                                        }
                                    });
                                })];
                        case 1:
                            body = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 15, , 16]);
                            res.setHeader('Content-Type', 'application/json');
                            if (!(endpoint === 'status')) return [3 /*break*/, 4];
                            return [4 /*yield*/, getGitStatus(body.pageDocsPath, body.workspacePath)];
                        case 3:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 4:
                            if (!(endpoint === 'diff')) return [3 /*break*/, 6];
                            return [4 /*yield*/, getFileDiff(body.filePath, body.workspacePath, body.commitHash)];
                        case 5:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 6:
                            if (!(endpoint === 'history')) return [3 /*break*/, 8];
                            return [4 /*yield*/, getGitHistory(body.maxCount, body.workspacePath)];
                        case 7:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 8:
                            if (!(endpoint === 'commit-details')) return [3 /*break*/, 10];
                            return [4 /*yield*/, getCommitDetails(body.commitHash, body.workspacePath)];
                        case 9:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 10:
                            if (!(endpoint === 'commit')) return [3 /*break*/, 12];
                            return [4 /*yield*/, commitFiles(body.files, body.summary, body.description, body.workspacePath)];
                        case 11:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 12:
                            if (!(endpoint === 'push')) return [3 /*break*/, 14];
                            return [4 /*yield*/, pushCommits(body.workspacePath)];
                        case 13:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 14:
                            next();
                            return [3 /*break*/, 16];
                        case 15:
                            err_1 = _b.sent();
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err_1.message }));
                            return [3 /*break*/, 16];
                        case 16: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
}
function assetsApiPlugin() {
    return {
        name: 'screen-designer-assets-api',
        configureServer: function (server) {
            var _this = this;
            // Ensure presets exist when Vite dev server starts
            materializePresets().catch(function () { });
            server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var cleanUrl, projectRootDir, filePath, mime, endpoint, body, data, data, rootDir, assetsDir, fileName, targetPath, base64Data, relativePath, err_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // 1. Static asset serving from project root /assets/
                            if (req.url && (req.url.startsWith('/assets/') || req.url.startsWith('/@fs/assets/'))) {
                                cleanUrl = req.url.replace(/^\/@fs/, '').replace(/^\/assets\//, '').split('?')[0];
                                projectRootDir = path.resolve(__dirname, '../../');
                                filePath = path.join(projectRootDir, 'assets', cleanUrl);
                                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                                    mime = getMimeType(filePath);
                                    res.setHeader('Content-Type', mime);
                                    res.setHeader('Cache-Control', 'public, max-age=3600');
                                    return [2 /*return*/, fs.createReadStream(filePath).pipe(res)];
                                }
                            }
                            // 2. Asset API routes
                            if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/api/assets/')))
                                return [2 /*return*/, next()];
                            endpoint = req.url.replace('/api/assets/', '').split('?')[0];
                            body = {};
                            if (!(req.method === 'POST')) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var data = '';
                                    req.on('data', function (chunk) { return (data += chunk); });
                                    req.on('end', function () {
                                        try {
                                            resolve(data ? JSON.parse(data) : {});
                                        }
                                        catch (_a) {
                                            resolve({});
                                        }
                                    });
                                })];
                        case 1:
                            body = _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 13, , 14]);
                            res.setHeader('Content-Type', 'application/json');
                            if (!(endpoint === 'materialize-presets')) return [3 /*break*/, 4];
                            return [4 /*yield*/, materializePresets(body.workspacePath)];
                        case 3:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 4:
                            if (!(endpoint === 'list')) return [3 /*break*/, 6];
                            return [4 /*yield*/, listAssets(body.workspacePath)];
                        case 5:
                            data = _b.sent();
                            return [2 /*return*/, res.end(JSON.stringify(data))];
                        case 6:
                            if (!(endpoint === 'save-file')) return [3 /*break*/, 12];
                            rootDir = body.workspacePath || path.resolve(__dirname, '../../');
                            assetsDir = path.join(rootDir, 'assets');
                            return [4 /*yield*/, fs.promises.mkdir(assetsDir, { recursive: true })];
                        case 7:
                            _b.sent();
                            fileName = (body.fileName || "image_".concat(Date.now(), ".png")).replace(/[^a-zA-Z0-9_.\-\uac00-\ud7a3]/g, '_');
                            targetPath = path.join(assetsDir, fileName);
                            if (!body.dataUrl) return [3 /*break*/, 9];
                            base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
                            return [4 /*yield*/, fs.promises.writeFile(targetPath, Buffer.from(base64Data, 'base64'))];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 11];
                        case 9:
                            if (!body.content) return [3 /*break*/, 11];
                            return [4 /*yield*/, fs.promises.writeFile(targetPath, body.content, 'utf-8')];
                        case 10:
                            _b.sent();
                            _b.label = 11;
                        case 11:
                            relativePath = "assets/".concat(fileName);
                            return [2 /*return*/, res.end(JSON.stringify({ success: true, relativePath: relativePath, fileName: fileName, dataUrl: body.dataUrl }))];
                        case 12:
                            next();
                            return [3 /*break*/, 14];
                        case 13:
                            err_2 = _b.sent();
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: err_2.message }));
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            }); });
        }
    };
}
export default defineConfig({
    plugins: [
        react(),
        gitApiPlugin(),
        assetsApiPlugin(),
        electron([
            {
                entry: 'electron/main.ts',
                onstart: function (options) {
                    if (process.env.NO_ELECTRON || !process.env.DISPLAY) {
                        console.log('[Vite Electron] Headless/Windows host mode: skipping Linux Electron spawn');
                        return;
                    }
                    options.startup();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        rollupOptions: {
                            external: ['ws', 'bufferutil', 'utf-8-validate']
                        }
                    }
                }
            },
            {
                entry: 'electron/preload.ts',
                onstart: function (options) {
                    options.reload();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron'
                    }
                }
            }
        ]),
        renderer()
    ]
});
