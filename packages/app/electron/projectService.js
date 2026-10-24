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
import fs from 'fs';
import path from 'path';
import { resolveProjectRoot, materializePresets } from './assetService';
/**
 * Saves project to the exact required folder structure:
 * <rootDir>/<pageDocsPath>/
 *   project.json
 *   design-system.json
 *   pages/{number}.json
 *   assets/
 */
export function saveProjectStructure(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rootDir, docsDir, pagesDir, projectAssetsDir, dotDir, assetFiles, files, _c, _d, pageSummaries, i, page, pageNum, pageFileName, pageFilePath, pageDoc, projectJsonPath, projectMeta, designSystemPath, dsConfig, configPath, existingConfig, raw, _e, updatedConfig, err_1;
        var project = _b.project, pages = _b.pages, designSystem = _b.designSystem, _f = _b.pageDocsPath, pageDocsPath = _f === void 0 ? 'docs/ui-boards' : _f, workspacePath = _b.workspacePath;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 23, , 24]);
                    rootDir = resolveProjectRoot(workspacePath);
                    docsDir = path.join(rootDir, pageDocsPath);
                    pagesDir = path.join(docsDir, 'pages');
                    projectAssetsDir = path.join(docsDir, 'assets');
                    dotDir = path.join(rootDir, '.screen-designer');
                    return [4 /*yield*/, fs.promises.mkdir(docsDir, { recursive: true })];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, fs.promises.mkdir(pagesDir, { recursive: true })];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, fs.promises.mkdir(projectAssetsDir, { recursive: true })];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, fs.promises.mkdir(dotDir, { recursive: true })];
                case 4:
                    _g.sent();
                    assetFiles = [];
                    _g.label = 5;
                case 5:
                    _g.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs.promises.readdir(projectAssetsDir)];
                case 6:
                    files = _g.sent();
                    assetFiles = files.filter(function (f) { return !f.startsWith('.'); }).map(function (f) { return "assets/".concat(f); });
                    return [3 /*break*/, 8];
                case 7:
                    _c = _g.sent();
                    return [3 /*break*/, 8];
                case 8:
                    _g.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, materializePresets(workspacePath)];
                case 9:
                    _g.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _d = _g.sent();
                    return [3 /*break*/, 11];
                case 11:
                    pageSummaries = [];
                    i = 0;
                    _g.label = 12;
                case 12:
                    if (!(i < pages.length)) return [3 /*break*/, 15];
                    page = pages[i];
                    pageNum = page.number || (i + 1);
                    pageFileName = "".concat(pageNum, ".json");
                    pageFilePath = path.join(pagesDir, pageFileName);
                    pageDoc = {
                        id: page.id,
                        name: page.name,
                        number: pageNum,
                        version: page.version || '1.0.0',
                        updatedAt: new Date().toISOString(),
                        artboards: page.artboards || []
                    };
                    return [4 /*yield*/, fs.promises.writeFile(pageFilePath, JSON.stringify(pageDoc, null, 2), 'utf-8')];
                case 13:
                    _g.sent();
                    pageSummaries.push({
                        id: page.id,
                        name: page.name,
                        number: pageNum,
                        fileName: "pages/".concat(pageFileName),
                        artboardsCount: (page.artboards || []).length
                    });
                    _g.label = 14;
                case 14:
                    i++;
                    return [3 /*break*/, 12];
                case 15:
                    projectJsonPath = path.join(docsDir, 'project.json');
                    projectMeta = {
                        name: (project === null || project === void 0 ? void 0 : project.name) || 'Screen Designer Storyboard',
                        version: '1.0.0',
                        updatedAt: new Date().toISOString(),
                        activePageId: (project === null || project === void 0 ? void 0 : project.activePageId) || (pages[0] ? pages[0].id : 'page-1'),
                        pageDocsPath: pageDocsPath,
                        pages: pageSummaries,
                        assets: assetFiles.length > 0 ? assetFiles : ((project === null || project === void 0 ? void 0 : project.assets) || []),
                        settings: (project === null || project === void 0 ? void 0 : project.settings) || {}
                    };
                    return [4 /*yield*/, fs.promises.writeFile(projectJsonPath, JSON.stringify(projectMeta, null, 2), 'utf-8')];
                case 16:
                    _g.sent();
                    designSystemPath = path.join(docsDir, 'design-system.json');
                    dsConfig = {
                        version: '1.0.0',
                        updatedAt: new Date().toISOString(),
                        theme: (designSystem === null || designSystem === void 0 ? void 0 : designSystem.theme) || 'dark',
                        componentDefaults: (designSystem === null || designSystem === void 0 ? void 0 : designSystem.componentDefaults) || {},
                        canvasBackground: (designSystem === null || designSystem === void 0 ? void 0 : designSystem.canvasBackground) || '#e5e7eb',
                        gridSize: (designSystem === null || designSystem === void 0 ? void 0 : designSystem.gridSize) || 24
                    };
                    return [4 /*yield*/, fs.promises.writeFile(designSystemPath, JSON.stringify(dsConfig, null, 2), 'utf-8')];
                case 17:
                    _g.sent();
                    configPath = path.join(dotDir, 'config.json');
                    existingConfig = {};
                    _g.label = 18;
                case 18:
                    _g.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, fs.promises.readFile(configPath, 'utf-8')];
                case 19:
                    raw = _g.sent();
                    existingConfig = JSON.parse(raw);
                    return [3 /*break*/, 21];
                case 20:
                    _e = _g.sent();
                    return [3 /*break*/, 21];
                case 21:
                    updatedConfig = __assign(__assign({}, existingConfig), { version: '1.0.0', pageDocsPath: pageDocsPath, lastActivePage: projectMeta.activePageId, updatedAt: new Date().toISOString() });
                    return [4 /*yield*/, fs.promises.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8')];
                case 22:
                    _g.sent();
                    return [2 /*return*/, { success: true, docsDir: docsDir }];
                case 23:
                    err_1 = _g.sent();
                    console.error('[ProjectService] Save project structure error:', err_1);
                    return [2 /*return*/, { success: false, docsDir: '', error: err_1.message }];
                case 24: return [2 /*return*/];
            }
        });
    });
}
/**
 * Loads project from the structured folder:
 * - project.json
 * - design-system.json
 * - pages/{number}.json
 * - assets/
 *
 * Automatically migrates legacy root docs/*.json if found.
 */
export function loadProjectStructure(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rootDir, docsDir, pagesDir, projectJsonPath, designSystemPath, project, designSystem, pages, raw, e_1, raw, e_2, pageFiles, jsonPageFiles, _i, jsonPageFiles_1, pf, raw, parsed, pageNum, e_3, rootFiles, legacyPageFiles, i, f, raw, parsed, e_4, _c, legacyPageFiles_1, f, _d, err_2;
        var _e = _b.pageDocsPath, pageDocsPath = _e === void 0 ? 'docs/ui-boards' : _e, workspacePath = _b.workspacePath;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 33, , 34]);
                    rootDir = resolveProjectRoot(workspacePath);
                    docsDir = path.join(rootDir, pageDocsPath);
                    pagesDir = path.join(docsDir, 'pages');
                    projectJsonPath = path.join(docsDir, 'project.json');
                    designSystemPath = path.join(docsDir, 'design-system.json');
                    return [4 /*yield*/, fs.promises.mkdir(docsDir, { recursive: true })];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, fs.promises.mkdir(pagesDir, { recursive: true })];
                case 2:
                    _f.sent();
                    project = void 0;
                    designSystem = void 0;
                    pages = [];
                    if (!fs.existsSync(projectJsonPath)) return [3 /*break*/, 6];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, fs.promises.readFile(projectJsonPath, 'utf-8')];
                case 4:
                    raw = _f.sent();
                    project = JSON.parse(raw);
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _f.sent();
                    console.warn('[ProjectService] Failed to parse project.json', e_1);
                    return [3 /*break*/, 6];
                case 6:
                    if (!fs.existsSync(designSystemPath)) return [3 /*break*/, 10];
                    _f.label = 7;
                case 7:
                    _f.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, fs.promises.readFile(designSystemPath, 'utf-8')];
                case 8:
                    raw = _f.sent();
                    designSystem = JSON.parse(raw);
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _f.sent();
                    console.warn('[ProjectService] Failed to parse design-system.json', e_2);
                    return [3 /*break*/, 10];
                case 10:
                    if (!fs.existsSync(pagesDir)) return [3 /*break*/, 18];
                    return [4 /*yield*/, fs.promises.readdir(pagesDir)];
                case 11:
                    pageFiles = _f.sent();
                    jsonPageFiles = pageFiles.filter(function (f) { return f.endsWith('.json'); });
                    _i = 0, jsonPageFiles_1 = jsonPageFiles;
                    _f.label = 12;
                case 12:
                    if (!(_i < jsonPageFiles_1.length)) return [3 /*break*/, 17];
                    pf = jsonPageFiles_1[_i];
                    _f.label = 13;
                case 13:
                    _f.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, fs.promises.readFile(path.join(pagesDir, pf), 'utf-8')];
                case 14:
                    raw = _f.sent();
                    parsed = JSON.parse(raw);
                    if (parsed && parsed.id) {
                        pageNum = parsed.number || parseInt(pf.replace('.json', ''), 10) || 1;
                        pages.push(__assign(__assign({}, parsed), { number: pageNum }));
                    }
                    return [3 /*break*/, 16];
                case 15:
                    e_3 = _f.sent();
                    console.error("[ProjectService] Failed to read page file: ".concat(pf), e_3);
                    return [3 /*break*/, 16];
                case 16:
                    _i++;
                    return [3 /*break*/, 12];
                case 17:
                    // Sort by page number ascending
                    pages.sort(function (a, b) { return a.number - b.number; });
                    _f.label = 18;
                case 18:
                    if (!(pages.length === 0)) return [3 /*break*/, 32];
                    return [4 /*yield*/, fs.promises.readdir(docsDir)];
                case 19:
                    rootFiles = _f.sent();
                    legacyPageFiles = rootFiles.filter(function (f) { return f.startsWith('page-') && f.endsWith('.json'); });
                    i = 0;
                    _f.label = 20;
                case 20:
                    if (!(i < legacyPageFiles.length)) return [3 /*break*/, 25];
                    f = legacyPageFiles[i];
                    _f.label = 21;
                case 21:
                    _f.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, fs.promises.readFile(path.join(docsDir, f), 'utf-8')];
                case 22:
                    raw = _f.sent();
                    parsed = JSON.parse(raw);
                    if (parsed && parsed.id) {
                        pages.push({
                            id: parsed.id,
                            name: parsed.name,
                            number: i + 1,
                            artboards: parsed.artboards || []
                        });
                    }
                    return [3 /*break*/, 24];
                case 23:
                    e_4 = _f.sent();
                    console.error("[ProjectService] Failed to parse legacy file: ".concat(f), e_4);
                    return [3 /*break*/, 24];
                case 24:
                    i++;
                    return [3 /*break*/, 20];
                case 25:
                    if (!(pages.length > 0)) return [3 /*break*/, 32];
                    return [4 /*yield*/, saveProjectStructure({
                            project: project,
                            pages: pages,
                            designSystem: designSystem,
                            pageDocsPath: pageDocsPath,
                            workspacePath: workspacePath
                        })];
                case 26:
                    _f.sent();
                    _c = 0, legacyPageFiles_1 = legacyPageFiles;
                    _f.label = 27;
                case 27:
                    if (!(_c < legacyPageFiles_1.length)) return [3 /*break*/, 32];
                    f = legacyPageFiles_1[_c];
                    _f.label = 28;
                case 28:
                    _f.trys.push([28, 30, , 31]);
                    return [4 /*yield*/, fs.promises.unlink(path.join(docsDir, f))];
                case 29:
                    _f.sent();
                    return [3 /*break*/, 31];
                case 30:
                    _d = _f.sent();
                    return [3 /*break*/, 31];
                case 31:
                    _c++;
                    return [3 /*break*/, 27];
                case 32: return [2 /*return*/, {
                        success: true,
                        project: project,
                        designSystem: designSystem,
                        pages: pages,
                        docsDir: docsDir
                    }];
                case 33:
                    err_2 = _f.sent();
                    console.error('[ProjectService] Load project structure error:', err_2);
                    return [2 /*return*/, {
                            success: false,
                            pages: [],
                            docsDir: '',
                            error: err_2.message
                        }];
                case 34: return [2 /*return*/];
            }
        });
    });
}
/**
 * Recursively copies a directory
 */
function copyDirRecursive(src, dest) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _i, entries_1, entry, srcPath, destPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.mkdir(dest, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(src, { withFileTypes: true })];
                case 2:
                    entries = _a.sent();
                    _i = 0, entries_1 = entries;
                    _a.label = 3;
                case 3:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 8];
                    entry = entries_1[_i];
                    srcPath = path.join(src, entry.name);
                    destPath = path.join(dest, entry.name);
                    if (!entry.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, copyDirRecursive(srcPath, destPath)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, fs.promises.copyFile(srcPath, destPath)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Migrates all contents from old project folder to new project folder.
 * Invoked when the user updates `pageDocsPath` in Settings.
 */
export function migrateProjectFolder(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rootDir, cleanOld, cleanNew, oldDir, newDir, movedCount_1, countEntries_1, _c, e_5, dotDir, configPath, existingConfig, raw, _d, err_3;
        var _this = this;
        var oldPath = _b.oldPath, newPath = _b.newPath, workspacePath = _b.workspacePath;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 16, , 17]);
                    rootDir = resolveProjectRoot(workspacePath);
                    cleanOld = path.normalize(oldPath).replace(/^(\.\/|\/)/, '');
                    cleanNew = path.normalize(newPath).replace(/^(\.\/|\/)/, '');
                    if (cleanOld === cleanNew) {
                        return [2 /*return*/, { success: true, movedFilesCount: 0, oldPath: oldPath, newPath: newPath }];
                    }
                    oldDir = path.join(rootDir, cleanOld);
                    newDir = path.join(rootDir, cleanNew);
                    if (!!fs.existsSync(oldDir)) return [3 /*break*/, 2];
                    // Old dir didn't exist yet, simply create newDir
                    return [4 /*yield*/, fs.promises.mkdir(newDir, { recursive: true })];
                case 1:
                    // Old dir didn't exist yet, simply create newDir
                    _e.sent();
                    return [2 /*return*/, { success: true, movedFilesCount: 0, oldPath: oldPath, newPath: newPath }];
                case 2: 
                // 1. Copy all contents from oldDir to newDir recursively
                return [4 /*yield*/, copyDirRecursive(oldDir, newDir)];
                case 3:
                    // 1. Copy all contents from oldDir to newDir recursively
                    _e.sent();
                    movedCount_1 = 0;
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    countEntries_1 = function (dir) { return __awaiter(_this, void 0, void 0, function () {
                        var entries, _i, entries_2, e;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs.promises.readdir(dir, { withFileTypes: true })];
                                case 1:
                                    entries = _a.sent();
                                    _i = 0, entries_2 = entries;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < entries_2.length)) return [3 /*break*/, 6];
                                    e = entries_2[_i];
                                    if (!e.isDirectory()) return [3 /*break*/, 4];
                                    return [4 /*yield*/, countEntries_1(path.join(dir, e.name))];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    movedCount_1++;
                                    _a.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, countEntries_1(newDir)];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = _e.sent();
                    return [3 /*break*/, 7];
                case 7:
                    _e.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, fs.promises.rm(oldDir, { recursive: true, force: true })];
                case 8:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_5 = _e.sent();
                    console.warn('[ProjectService] Failed to clean up old directory after migration:', e_5);
                    return [3 /*break*/, 10];
                case 10:
                    dotDir = path.join(rootDir, '.screen-designer');
                    configPath = path.join(dotDir, 'config.json');
                    existingConfig = {};
                    _e.label = 11;
                case 11:
                    _e.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, fs.promises.readFile(configPath, 'utf-8')];
                case 12:
                    raw = _e.sent();
                    existingConfig = JSON.parse(raw);
                    return [3 /*break*/, 14];
                case 13:
                    _d = _e.sent();
                    return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, fs.promises.writeFile(configPath, JSON.stringify(__assign(__assign({}, existingConfig), { pageDocsPath: cleanNew, migratedFrom: cleanOld, migratedAt: new Date().toISOString() }), null, 2), 'utf-8')];
                case 15:
                    _e.sent();
                    console.log("[ProjectService] Successfully migrated ".concat(movedCount_1, " files from \"").concat(cleanOld, "\" to \"").concat(cleanNew, "\""));
                    return [2 /*return*/, { success: true, movedFilesCount: movedCount_1, oldPath: cleanOld, newPath: cleanNew }];
                case 16:
                    err_3 = _e.sent();
                    console.error('[ProjectService] Folder migration failed:', err_3);
                    return [2 /*return*/, { success: false, movedFilesCount: 0, oldPath: oldPath, newPath: newPath, error: err_3.message }];
                case 17: return [2 /*return*/];
            }
        });
    });
}
