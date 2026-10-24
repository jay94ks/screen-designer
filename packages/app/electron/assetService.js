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
// Built-in Vector SVG Presets (Electron embedded assets)
export var BUILTIN_IMAGE_PRESETS = [
    {
        fileName: 'preset-gradient.svg',
        name: '오로라 메쉬 그라디언트',
        category: 'gradient',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 500\" width=\"800\" height=\"500\">\n  <defs>\n    <linearGradient id=\"bgGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#0f172a\" />\n      <stop offset=\"50%\" stop-color=\"#1e1b4b\" />\n      <stop offset=\"100%\" stop-color=\"#090514\" />\n    </linearGradient>\n    <radialGradient id=\"blob1\" cx=\"30%\" cy=\"35%\" r=\"60%\">\n      <stop offset=\"0%\" stop-color=\"#6366f1\" stop-opacity=\"0.85\" />\n      <stop offset=\"50%\" stop-color=\"#a855f7\" stop-opacity=\"0.4\" />\n      <stop offset=\"100%\" stop-color=\"#1e1b4b\" stop-opacity=\"0\" />\n    </radialGradient>\n    <radialGradient id=\"blob2\" cx=\"75%\" cy=\"65%\" r=\"55%\">\n      <stop offset=\"0%\" stop-color=\"#06b6d4\" stop-opacity=\"0.8\" />\n      <stop offset=\"50%\" stop-color=\"#3b82f6\" stop-opacity=\"0.3\" />\n      <stop offset=\"100%\" stop-color=\"#0f172a\" stop-opacity=\"0\" />\n    </radialGradient>\n    <radialGradient id=\"blob3\" cx=\"50%\" cy=\"85%\" r=\"45%\">\n      <stop offset=\"0%\" stop-color=\"#ec4899\" stop-opacity=\"0.75\" />\n      <stop offset=\"60%\" stop-color=\"#8b5cf6\" stop-opacity=\"0.2\" />\n      <stop offset=\"100%\" stop-color=\"#090514\" stop-opacity=\"0\" />\n    </radialGradient>\n    <filter id=\"meshBlur\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">\n      <feGaussianBlur stdDeviation=\"40\" />\n    </filter>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"url(#bgGrad)\" />\n  <g filter=\"url(#meshBlur)\">\n    <circle cx=\"260\" cy=\"180\" r=\"220\" fill=\"url(#blob1)\" />\n    <circle cx=\"620\" cy=\"320\" r=\"240\" fill=\"url(#blob2)\" />\n    <circle cx=\"420\" cy=\"400\" r=\"190\" fill=\"url(#blob3)\" />\n  </g>\n  <g opacity=\"0.15\">\n    <circle cx=\"400\" cy=\"250\" r=\"180\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"1.5\" stroke-dasharray=\"6 8\" />\n    <circle cx=\"400\" cy=\"250\" r=\"260\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"1\" />\n  </g>\n</svg>"
    },
    {
        fileName: 'preset-avatar.svg',
        name: '디자이너 사용자 아바타',
        category: 'avatar',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 400\" width=\"400\" height=\"400\">\n  <defs>\n    <linearGradient id=\"avatarBg\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#3b82f6\" />\n      <stop offset=\"50%\" stop-color=\"#8b5cf6\" />\n      <stop offset=\"100%\" stop-color=\"#ec4899\" />\n    </linearGradient>\n    <linearGradient id=\"bodyGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#ffffff\" stop-opacity=\"0.95\" />\n      <stop offset=\"100%\" stop-color=\"#cbd5e1\" stop-opacity=\"0.9\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" rx=\"80\" fill=\"url(#avatarBg)\" />\n  <circle cx=\"200\" cy=\"150\" r=\"65\" fill=\"url(#bodyGrad)\" />\n  <path d=\"M90 340 C90 250, 140 230, 200 230 C260 230, 310 250, 310 340 Z\" fill=\"url(#bodyGrad)\" />\n  <circle cx=\"178\" cy=\"145\" r=\"7\" fill=\"#1e293b\" />\n  <circle cx=\"222\" cy=\"145\" r=\"7\" fill=\"#1e293b\" />\n  <path d=\"M185 172 Q200 185 215 172\" stroke=\"#1e293b\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\" />\n  <circle cx=\"280\" cy=\"120\" r=\"16\" fill=\"#38bdf8\" opacity=\"0.8\" />\n  <path d=\"M280 110 L280 130 M270 120 L290 120\" stroke=\"#ffffff\" stroke-width=\"2.5\" stroke-linecap=\"round\" />\n</svg>"
    },
    {
        fileName: 'preset-chart.svg',
        name: '핀테크 자산 분석 대시보드',
        category: 'finance',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 480\" width=\"800\" height=\"480\">\n  <defs>\n    <linearGradient id=\"chartBg\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#0b1120\" />\n      <stop offset=\"100%\" stop-color=\"#020617\" />\n    </linearGradient>\n    <linearGradient id=\"glowLine\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#06b6d4\" />\n      <stop offset=\"60%\" stop-color=\"#3b82f6\" />\n      <stop offset=\"100%\" stop-color=\"#10b981\" />\n    </linearGradient>\n    <linearGradient id=\"areaFill\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#06b6d4\" stop-opacity=\"0.35\" />\n      <stop offset=\"100%\" stop-color=\"#06b6d4\" stop-opacity=\"0.0\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"url(#chartBg)\" />\n  <g opacity=\"0.08\" stroke=\"#ffffff\" stroke-width=\"1\">\n    <line x1=\"80\" y1=\"100\" x2=\"720\" y2=\"100\" stroke-dasharray=\"4 4\" />\n    <line x1=\"80\" y1=\"180\" x2=\"720\" y2=\"180\" stroke-dasharray=\"4 4\" />\n    <line x1=\"80\" y1=\"260\" x2=\"720\" y2=\"260\" stroke-dasharray=\"4 4\" />\n    <line x1=\"80\" y1=\"340\" x2=\"720\" y2=\"340\" />\n  </g>\n  <path d=\"M 100 320 C 180 290, 240 330, 320 220 C 400 110, 480 250, 560 160 C 640 70, 680 120, 720 90 L 720 340 L 100 340 Z\" fill=\"url(#areaFill)\" />\n  <path d=\"M 100 320 C 180 290, 240 330, 320 220 C 400 110, 480 250, 560 160 C 640 70, 680 120, 720 90\" fill=\"none\" stroke=\"url(#glowLine)\" stroke-width=\"4\" stroke-linecap=\"round\" />\n  <circle cx=\"560\" cy=\"160\" r=\"6\" fill=\"#3b82f6\" stroke=\"#ffffff\" stroke-width=\"2\" />\n  <circle cx=\"720\" cy=\"90\" r=\"7\" fill=\"#10b981\" stroke=\"#ffffff\" stroke-width=\"2.5\" />\n</svg>"
    },
    {
        fileName: 'preset-tech.svg',
        name: '사이버펑크 네온 그리드',
        category: 'tech',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 500\" width=\"800\" height=\"500\">\n  <defs>\n    <linearGradient id=\"cyberSky\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#050515\" />\n      <stop offset=\"60%\" stop-color=\"#180b38\" />\n      <stop offset=\"100%\" stop-color=\"#4c1d95\" />\n    </linearGradient>\n    <linearGradient id=\"sunGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#fde047\" />\n      <stop offset=\"50%\" stop-color=\"#f43f5e\" />\n      <stop offset=\"100%\" stop-color=\"#8b5cf6\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"url(#cyberSky)\" />\n  <circle cx=\"400\" cy=\"240\" r=\"110\" fill=\"url(#sunGrad)\" />\n  <g fill=\"#050515\">\n    <rect x=\"280\" y=\"235\" width=\"240\" height=\"4\" />\n    <rect x=\"280\" y=\"247\" width=\"240\" height=\"6\" />\n    <rect x=\"280\" y=\"261\" width=\"240\" height=\"8\" />\n  </g>\n  <g stroke=\"#06b6d4\" stroke-width=\"1.2\" opacity=\"0.7\">\n    <line x1=\"400\" y1=\"250\" x2=\"50\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"200\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"330\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"400\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"470\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"600\" y2=\"500\" />\n    <line x1=\"400\" y1=\"250\" x2=\"750\" y2=\"500\" />\n    <line x1=\"0\" y1=\"280\" x2=\"800\" y2=\"280\" />\n    <line x1=\"0\" y1=\"315\" x2=\"800\" y2=\"315\" />\n    <line x1=\"0\" y1=\"365\" x2=\"800\" y2=\"365\" />\n    <line x1=\"0\" y1=\"430\" x2=\"800\" y2=\"430\" />\n  </g>\n</svg>"
    },
    {
        fileName: 'preset-minimal.svg',
        name: '미니멀 워크스페이스',
        category: 'minimal',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 400\" width=\"600\" height=\"400\">\n  <defs>\n    <linearGradient id=\"wall\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#f8fafc\" />\n      <stop offset=\"100%\" stop-color=\"#f1f5f9\" />\n    </linearGradient>\n    <linearGradient id=\"desk\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n      <stop offset=\"0%\" stop-color=\"#e2e8f0\" />\n      <stop offset=\"100%\" stop-color=\"#cbd5e1\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"url(#wall)\" />\n  <rect x=\"0\" y=\"270\" width=\"600\" height=\"130\" fill=\"url(#desk)\" />\n  <rect x=\"220\" y=\"160\" width=\"160\" height=\"105\" rx=\"6\" fill=\"#1e293b\" />\n  <rect x=\"228\" y=\"168\" width=\"144\" height=\"88\" rx=\"2\" fill=\"#38bdf8\" opacity=\"0.3\" />\n  <polygon points=\"200,270 400,270 380,265 220,265\" fill=\"#94a3b8\" />\n  <rect x=\"120\" y=\"190\" width=\"45\" height=\"80\" rx=\"8\" fill=\"#10b981\" opacity=\"0.85\" />\n  <rect x=\"133\" y=\"170\" width=\"18\" height=\"20\" fill=\"#059669\" />\n  <ellipse cx=\"480\" cy=\"245\" rx=\"35\" ry=\"4\" fill=\"#94a3b8\" opacity=\"0.4\" />\n  <path d=\"M455 210 L505 210 L495 245 L465 245 Z\" fill=\"#ffffff\" stroke=\"#cbd5e1\" stroke-width=\"2\" />\n</svg>"
    },
    {
        fileName: 'preset-nature.svg',
        name: '자연 풍경 & 산맥 실루엣',
        category: 'nature',
        svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 480\" width=\"800\" height=\"480\">\n  <defs>\n    <linearGradient id=\"sky\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n      <stop offset=\"0%\" stop-color=\"#fdba74\" />\n      <stop offset=\"40%\" stop-color=\"#f472b6\" />\n      <stop offset=\"75%\" stop-color=\"#818cf8\" />\n      <stop offset=\"100%\" stop-color=\"#312e81\" />\n    </linearGradient>\n  </defs>\n  <rect width=\"100%\" height=\"100%\" fill=\"url(#sky)\" />\n  <circle cx=\"400\" cy=\"190\" r=\"50\" fill=\"#fffbeb\" opacity=\"0.9\" />\n  <path d=\"M0 320 L150 210 L320 310 L480 180 L620 270 L800 160 L800 480 L0 480 Z\" fill=\"#1e1b4b\" opacity=\"0.5\" />\n  <path d=\"M0 360 L180 260 L360 350 L520 240 L700 330 L800 250 L800 480 L0 480 Z\" fill=\"#0f172a\" />\n</svg>"
    }
];
export function getMimeType(fileName) {
    var ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.webp':
            return 'image/webp';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}
export function fileToDataUrl(filePath) {
    var data = fs.readFileSync(filePath);
    var mime = getMimeType(filePath);
    return "data:".concat(mime, ";base64,").concat(data.toString('base64'));
}
export function svgToDataUrl(svg) {
    return "data:image/svg+xml;utf8,".concat(encodeURIComponent(svg));
}
export function resolveProjectRoot(workspacePath) {
    if (workspacePath && workspacePath !== '.') {
        return workspacePath;
    }
    if (process.env.SCREEN_DESIGNER_WORKSPACE) {
        return process.env.SCREEN_DESIGNER_WORKSPACE;
    }
    var cwd = process.cwd();
    if (cwd.endsWith(path.join('packages', 'app')) || cwd.endsWith('packages/app') || cwd.endsWith('packages\\app')) {
        return path.resolve(cwd, '../..');
    }
    return cwd;
}
/**
 * Ensures `<rootDir>/assets/` exists and writes all built-in SVG preset files.
 * Also copies them to packages/app/public/assets if that folder exists.
 */
export function materializePresets(workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var rootDir, assetsDir, writtenFiles, _i, BUILTIN_IMAGE_PRESETS_1, preset, targetFile, publicAssetsDir, _a, BUILTIN_IMAGE_PRESETS_2, preset, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rootDir = resolveProjectRoot(workspacePath);
                    assetsDir = path.join(rootDir, 'assets');
                    return [4 /*yield*/, fs.promises.mkdir(assetsDir, { recursive: true })];
                case 1:
                    _b.sent();
                    writtenFiles = [];
                    _i = 0, BUILTIN_IMAGE_PRESETS_1 = BUILTIN_IMAGE_PRESETS;
                    _b.label = 2;
                case 2:
                    if (!(_i < BUILTIN_IMAGE_PRESETS_1.length)) return [3 /*break*/, 5];
                    preset = BUILTIN_IMAGE_PRESETS_1[_i];
                    targetFile = path.join(assetsDir, preset.fileName);
                    // Write preset SVG to disk
                    return [4 /*yield*/, fs.promises.writeFile(targetFile, preset.svg.trim(), 'utf-8')];
                case 3:
                    // Write preset SVG to disk
                    _b.sent();
                    writtenFiles.push(preset.fileName);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    publicAssetsDir = path.join(rootDir, 'packages', 'app', 'public', 'assets');
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 12, , 13]);
                    return [4 /*yield*/, fs.promises.mkdir(publicAssetsDir, { recursive: true })];
                case 7:
                    _b.sent();
                    _a = 0, BUILTIN_IMAGE_PRESETS_2 = BUILTIN_IMAGE_PRESETS;
                    _b.label = 8;
                case 8:
                    if (!(_a < BUILTIN_IMAGE_PRESETS_2.length)) return [3 /*break*/, 11];
                    preset = BUILTIN_IMAGE_PRESETS_2[_a];
                    return [4 /*yield*/, fs.promises.writeFile(path.join(publicAssetsDir, preset.fileName), preset.svg.trim(), 'utf-8')];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_1 = _b.sent();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, { success: true, count: writtenFiles.length, files: writtenFiles }];
            }
        });
    });
}
/**
 * Copies a local file picked by the user into `<rootDir>/assets/<sanitized_name>`.
 * Returns asset info including relativePath and dataUrl.
 */
export function copyAssetFile(sourcePath, workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var rootDir, assetsDir, originalName, ext, baseWithoutExt, targetFileName, targetPath, existingStat, sourceStat, publicAssetsDir, _a, dataUrl, relativePath, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    rootDir = resolveProjectRoot(workspacePath);
                    assetsDir = path.join(rootDir, 'assets');
                    return [4 /*yield*/, fs.promises.mkdir(assetsDir, { recursive: true })];
                case 1:
                    _b.sent();
                    if (!fs.existsSync(sourcePath)) {
                        return [2 /*return*/, { success: false, relativePath: '', fileName: '', dataUrl: '', error: 'Source file does not exist' }];
                    }
                    originalName = path.basename(sourcePath);
                    ext = path.extname(originalName).toLowerCase();
                    baseWithoutExt = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-\uac00-\ud7a3]/g, '_');
                    targetFileName = "".concat(baseWithoutExt).concat(ext);
                    targetPath = path.join(assetsDir, targetFileName);
                    if (!fs.existsSync(targetPath)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs.promises.stat(targetPath)];
                case 2:
                    existingStat = _b.sent();
                    return [4 /*yield*/, fs.promises.stat(sourcePath)];
                case 3:
                    sourceStat = _b.sent();
                    if (existingStat.size !== sourceStat.size) {
                        targetFileName = "".concat(baseWithoutExt, "_").concat(Date.now()).concat(ext);
                        targetPath = path.join(assetsDir, targetFileName);
                    }
                    _b.label = 4;
                case 4: 
                // Copy file to project assets folder
                return [4 /*yield*/, fs.promises.copyFile(sourcePath, targetPath)];
                case 5:
                    // Copy file to project assets folder
                    _b.sent();
                    publicAssetsDir = path.join(rootDir, 'packages', 'app', 'public', 'assets');
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, fs.promises.mkdir(publicAssetsDir, { recursive: true })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, fs.promises.copyFile(sourcePath, path.join(publicAssetsDir, targetFileName))];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _a = _b.sent();
                    return [3 /*break*/, 10];
                case 10:
                    dataUrl = fileToDataUrl(targetPath);
                    relativePath = "assets/".concat(targetFileName);
                    return [2 /*return*/, {
                            success: true,
                            relativePath: relativePath,
                            fileName: targetFileName,
                            dataUrl: dataUrl
                        }];
                case 11:
                    err_1 = _b.sent();
                    return [2 /*return*/, { success: false, relativePath: '', fileName: '', dataUrl: '', error: err_1.message }];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Lists all assets in `<rootDir>/assets/`
 */
export function listAssets(workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var rootDir, assetsDir, files, assets, presetNames, _i, files_1, file, fullPath, stat, mime, dataUrl, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    rootDir = resolveProjectRoot(workspacePath);
                    assetsDir = path.join(rootDir, 'assets');
                    if (!fs.existsSync(assetsDir)) {
                        return [2 /*return*/, { success: true, assets: [] }];
                    }
                    return [4 /*yield*/, fs.promises.readdir(assetsDir)];
                case 1:
                    files = _a.sent();
                    assets = [];
                    presetNames = new Set(BUILTIN_IMAGE_PRESETS.map(function (p) { return p.fileName; }));
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    fullPath = path.join(assetsDir, file);
                    return [4 /*yield*/, fs.promises.stat(fullPath)];
                case 3:
                    stat = _a.sent();
                    if (stat.isFile()) {
                        mime = getMimeType(file);
                        dataUrl = void 0;
                        try {
                            // Read up to 2MB as dataUrl for preview
                            if (stat.size < 2 * 1024 * 1024) {
                                dataUrl = fileToDataUrl(fullPath);
                            }
                        }
                        catch (_b) {
                            // skip
                        }
                        assets.push({
                            fileName: file,
                            relativePath: "assets/".concat(file),
                            size: stat.size,
                            isPreset: presetNames.has(file),
                            mimeType: mime,
                            dataUrl: dataUrl
                        });
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, { success: true, assets: assets }];
                case 6:
                    err_2 = _a.sent();
                    return [2 /*return*/, { success: false, assets: [] }];
                case 7: return [2 /*return*/];
            }
        });
    });
}
