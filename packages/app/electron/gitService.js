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
import { promises as fs } from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';
var cachedRoot = null;
export function getRepoRoot(workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var git, top_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (workspacePath)
                        return [2 /*return*/, workspacePath];
                    if (process.env.SCREEN_DESIGNER_WORKSPACE)
                        return [2 /*return*/, process.env.SCREEN_DESIGNER_WORKSPACE];
                    if (cachedRoot)
                        return [2 /*return*/, cachedRoot];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    git = simpleGit(process.cwd());
                    return [4 /*yield*/, git.revparse(['--show-toplevel'])];
                case 2:
                    top_1 = _b.sent();
                    if (top_1) {
                        cachedRoot = top_1.trim();
                        return [2 /*return*/, cachedRoot];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, process.cwd()];
            }
        });
    });
}
function getGit(workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var root;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRepoRoot(workspacePath)];
                case 1:
                    root = _a.sent();
                    return [2 /*return*/, { git: simpleGit(root), root: root }];
            }
        });
    });
}
export function getGitStatus() {
    return __awaiter(this, arguments, void 0, function (pageDocsPath, workspacePath) {
        var git, isRepo, status_1, normDocsPath_1, allChanges, designChanges, err_1;
        if (pageDocsPath === void 0) { pageDocsPath = 'docs/ui-boards'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    git = (_a.sent()).git;
                    return [4 /*yield*/, git.checkIsRepo()];
                case 2:
                    isRepo = _a.sent();
                    if (!isRepo) {
                        return [2 /*return*/, {
                                isRepo: false,
                                branch: '',
                                tracking: '',
                                ahead: 0,
                                behind: 0,
                                clean: true,
                                uiChangesCount: 0,
                                designChanges: [],
                                allChangesCount: 0,
                                allChanges: []
                            }];
                    }
                    return [4 /*yield*/, git.status()];
                case 3:
                    status_1 = _a.sent();
                    normDocsPath_1 = pageDocsPath.replace(/^\/+|\/+$/g, '');
                    allChanges = status_1.files.map(function (f) {
                        var st = 'modified';
                        if (f.index === '?' || f.working_dir === '?')
                            st = 'untracked';
                        else if (f.index === 'A' || f.working_dir === 'A')
                            st = 'added';
                        else if (f.index === 'D' || f.working_dir === 'D')
                            st = 'deleted';
                        return {
                            path: f.path,
                            filename: path.basename(f.path),
                            status: st
                        };
                    });
                    designChanges = allChanges.filter(function (c) { return c.path.startsWith(normDocsPath_1) || c.path.startsWith('.screen-designer'); });
                    return [2 /*return*/, {
                            isRepo: true,
                            branch: status_1.current || 'main',
                            tracking: status_1.tracking || '',
                            ahead: status_1.ahead || 0,
                            behind: status_1.behind || 0,
                            clean: allChanges.length === 0,
                            uiChangesCount: designChanges.length,
                            designChanges: designChanges,
                            allChangesCount: allChanges.length,
                            allChanges: allChanges
                        }];
                case 4:
                    err_1 = _a.sent();
                    console.error('[gitService] getGitStatus error:', err_1);
                    return [2 /*return*/, {
                            isRepo: false,
                            branch: '',
                            tracking: '',
                            ahead: 0,
                            behind: 0,
                            clean: true,
                            uiChangesCount: 0,
                            designChanges: [],
                            allChangesCount: 0,
                            allChanges: [],
                            error: err_1.message
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export function parseUnifiedDiff(rawDiff, filePath) {
    var lines = rawDiff.split(/\r?\n/);
    var rows = [];
    var oldLine = 0;
    var newLine = 0;
    var inHunk = false;
    var pendingDels = [];
    var pendingAdds = [];
    var flushPending = function () {
        var maxCount = Math.max(pendingDels.length, pendingAdds.length);
        for (var i = 0; i < maxCount; i++) {
            var del = pendingDels[i];
            var add = pendingAdds[i];
            rows.push({
                oldLineNo: del ? del.lineNo : undefined,
                oldContent: del ? del.text : undefined,
                oldType: del ? 'del' : 'empty',
                newLineNo: add ? add.lineNo : undefined,
                newContent: add ? add.text : undefined,
                newType: add ? 'add' : 'empty'
            });
        }
        pendingDels.length = 0;
        pendingAdds.length = 0;
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.startsWith('@@')) {
            flushPending();
            inHunk = true;
            var match = line.match(/@@\s*-(\d+)(?:,\d+)?\s*\+(\d+)(?:,\d+)?\s*@@(.*)/);
            if (match) {
                oldLine = parseInt(match[1], 10);
                newLine = parseInt(match[2], 10);
            }
            rows.push({
                isHunkHeader: true,
                hunkHeader: line
            });
            continue;
        }
        if (!inHunk)
            continue;
        if (line.startsWith('-')) {
            pendingDels.push({ lineNo: oldLine++, text: line.slice(1) });
        }
        else if (line.startsWith('+')) {
            pendingAdds.push({ lineNo: newLine++, text: line.slice(1) });
        }
        else if (line.startsWith(' ') || line === '') {
            flushPending();
            rows.push({
                oldLineNo: oldLine++,
                oldContent: line.slice(1),
                oldType: 'normal',
                newLineNo: newLine++,
                newContent: line.slice(1),
                newType: 'normal'
            });
        }
    }
    flushPending();
    return rows;
}
export function getFileDiff(filePath, workspacePath, commitHash) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, git, root, rawDiff, status_2, _b, content, st, fileEntry, fullPath, exists, e_1, content, lines, hasHead, e_2, fullPath, exists, content, lines, isBinary, rows, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 29, , 30]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    _a = _c.sent(), git = _a.git, root = _a.root;
                    rawDiff = '';
                    status_2 = 'modified';
                    if (!commitHash) return [3 /*break*/, 8];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, git.diff(["".concat(commitHash, "^!"), '--', filePath])];
                case 3:
                    rawDiff = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (!!rawDiff) return [3 /*break*/, 7];
                    return [4 /*yield*/, git.show(["".concat(commitHash, ":").concat(filePath)]).catch(function () { return ''; })];
                case 6:
                    content = _c.sent();
                    rawDiff = content
                        ? "@@ -0,0 +1,".concat(content.split('\n').length, " @@\n") +
                            content.split('\n').map(function (l) { return "+".concat(l); }).join('\n')
                        : '';
                    _c.label = 7;
                case 7: return [3 /*break*/, 28];
                case 8: return [4 /*yield*/, git.status()];
                case 9:
                    st = _c.sent();
                    fileEntry = st.files.find(function (f) { return f.path === filePath; });
                    if (!(fileEntry && (fileEntry.index === '?' || fileEntry.working_dir === '?'))) return [3 /*break*/, 17];
                    status_2 = 'untracked';
                    fullPath = path.resolve(root, filePath);
                    return [4 /*yield*/, fs.access(fullPath).then(function () { return true; }).catch(function () { return false; })];
                case 10:
                    exists = _c.sent();
                    if (!exists) return [3 /*break*/, 16];
                    _c.label = 11;
                case 11:
                    _c.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, git.raw(['diff', '--no-index', '--', '/dev/null', filePath])];
                case 12:
                    rawDiff = _c.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_1 = _c.sent();
                    rawDiff = e_1.stdout || '';
                    return [3 /*break*/, 14];
                case 14:
                    if (!!rawDiff) return [3 /*break*/, 16];
                    return [4 /*yield*/, fs.readFile(fullPath, 'utf-8')];
                case 15:
                    content = _c.sent();
                    lines = content.split(/\r?\n/);
                    rawDiff = "@@ -0,0 +1,".concat(lines.length, " @@\n") + lines.map(function (l) { return "+".concat(l); }).join('\n');
                    _c.label = 16;
                case 16: return [3 /*break*/, 28];
                case 17: return [4 /*yield*/, git.revparse(['HEAD']).then(function () { return true; }).catch(function () { return false; })];
                case 18:
                    hasHead = _c.sent();
                    if (!hasHead) return [3 /*break*/, 22];
                    return [4 /*yield*/, git.diff(['HEAD', '--', filePath])];
                case 19:
                    rawDiff = _c.sent();
                    if (!!rawDiff) return [3 /*break*/, 21];
                    return [4 /*yield*/, git.diff(['--', filePath])];
                case 20:
                    rawDiff = _c.sent();
                    _c.label = 21;
                case 21: return [3 /*break*/, 28];
                case 22:
                    _c.trys.push([22, 24, , 25]);
                    return [4 /*yield*/, git.raw(['diff', '--no-index', '--', '/dev/null', filePath])];
                case 23:
                    rawDiff = _c.sent();
                    return [3 /*break*/, 25];
                case 24:
                    e_2 = _c.sent();
                    rawDiff = e_2.stdout || '';
                    return [3 /*break*/, 25];
                case 25:
                    if (!!rawDiff) return [3 /*break*/, 28];
                    fullPath = path.resolve(root, filePath);
                    return [4 /*yield*/, fs.access(fullPath).then(function () { return true; }).catch(function () { return false; })];
                case 26:
                    exists = _c.sent();
                    if (!exists) return [3 /*break*/, 28];
                    return [4 /*yield*/, fs.readFile(fullPath, 'utf-8')];
                case 27:
                    content = _c.sent();
                    lines = content.split(/\r?\n/);
                    rawDiff = "@@ -0,0 +1,".concat(lines.length, " @@\n") + lines.map(function (l) { return "+".concat(l); }).join('\n');
                    _c.label = 28;
                case 28:
                    isBinary = rawDiff.includes('Binary files') || rawDiff.includes('GIT binary patch');
                    rows = isBinary ? [] : parseUnifiedDiff(rawDiff, filePath);
                    return [2 /*return*/, {
                            filePath: filePath,
                            rawDiff: rawDiff,
                            isBinary: isBinary,
                            status: status_2,
                            rows: rows,
                            lineEndingWarning: "This file uses 'LF' line endings, but Git is configured to convert them to 'CRLF' the next time the file is checked out."
                        }];
                case 29:
                    err_2 = _c.sent();
                    console.error('[gitService] getFileDiff error:', err_2);
                    return [2 /*return*/, {
                            filePath: filePath,
                            rawDiff: '',
                            isBinary: false,
                            status: 'modified',
                            rows: []
                        }];
                case 30: return [2 /*return*/];
            }
        });
    });
}
export function getGitHistory() {
    return __awaiter(this, arguments, void 0, function (maxCount, workspacePath) {
        var git, hasHead, log, err_3;
        if (maxCount === void 0) { maxCount = 40; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    git = (_a.sent()).git;
                    return [4 /*yield*/, git.revparse(['HEAD']).then(function () { return true; }).catch(function () { return false; })];
                case 2:
                    hasHead = _a.sent();
                    if (!hasHead)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, git.log({ maxCount: maxCount })];
                case 3:
                    log = _a.sent();
                    return [2 /*return*/, log.all.map(function (c) { return ({
                            hash: c.hash,
                            shortHash: c.hash.slice(0, 7),
                            date: c.date,
                            message: c.message,
                            body: c.body || '',
                            author_name: c.author_name,
                            author_email: c.author_email,
                            refs: c.refs
                        }); })];
                case 4:
                    err_3 = _a.sent();
                    console.warn('[gitService] getGitHistory empty or error:', err_3.message);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export function getCommitDetails(commitHash, workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var git_1, log, commit, rawStat, files, lines, _i, lines_2, l, parts, type, p, st, err_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    git_1 = (_a.sent()).git;
                    return [4 /*yield*/, git_1.log({ from: "".concat(commitHash, "~1"), to: commitHash, maxCount: 1 }).catch(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, git_1.log({ maxCount: 1 })];
                            });
                        }); })];
                case 2:
                    log = _a.sent();
                    commit = log.latest || log.all[0];
                    if (!commit)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, git_1.show(['--name-status', '--format=', commitHash])];
                case 3:
                    rawStat = _a.sent();
                    files = [];
                    lines = rawStat.split('\n');
                    for (_i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
                        l = lines_2[_i];
                        parts = l.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            type = parts[0];
                            p = parts.slice(1).join(' ');
                            st = 'modified';
                            if (type.startsWith('A'))
                                st = 'added';
                            else if (type.startsWith('D'))
                                st = 'deleted';
                            files.push({
                                path: p,
                                filename: path.basename(p),
                                status: st
                            });
                        }
                    }
                    return [2 /*return*/, {
                            hash: commit.hash,
                            shortHash: commit.hash.slice(0, 7),
                            date: commit.date,
                            message: commit.message,
                            body: commit.body || '',
                            author_name: commit.author_name,
                            author_email: commit.author_email,
                            files: files
                        }];
                case 4:
                    err_4 = _a.sent();
                    console.error('[gitService] getCommitDetails error:', err_4);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
export function commitFiles(files, summary, description, workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var git, fullMessage, result, st, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    git = (_a.sent()).git;
                    if (!files || files.length === 0) {
                        return [2 /*return*/, { success: false, error: 'No files selected to commit' }];
                    }
                    return [4 /*yield*/, git.add(files)];
                case 2:
                    _a.sent();
                    fullMessage = description && description.trim()
                        ? "".concat(summary.trim(), "\n\n").concat(description.trim())
                        : summary.trim();
                    return [4 /*yield*/, git.commit(fullMessage)];
                case 3:
                    result = _a.sent();
                    return [4 /*yield*/, git.status()];
                case 4:
                    st = _a.sent();
                    return [2 /*return*/, {
                            success: true,
                            commitHash: result.commit,
                            ahead: st.ahead || 1
                        }];
                case 5:
                    err_5 = _a.sent();
                    console.error('[gitService] commitFiles error:', err_5);
                    return [2 /*return*/, { success: false, error: err_5.message }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
export function pushCommits(workspacePath) {
    return __awaiter(this, void 0, void 0, function () {
        var git, st, branch, _a, updatedStatus, err_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, getGit(workspacePath)];
                case 1:
                    git = (_b.sent()).git;
                    return [4 /*yield*/, git.status()];
                case 2:
                    st = _b.sent();
                    branch = st.current || 'main';
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 7]);
                    return [4 /*yield*/, git.push('origin', branch)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    _a = _b.sent();
                    // Try setting upstream if needed
                    return [4 /*yield*/, git.push(['-u', 'origin', branch])];
                case 6:
                    // Try setting upstream if needed
                    _b.sent();
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, git.status()];
                case 8:
                    updatedStatus = _b.sent();
                    return [2 /*return*/, {
                            success: true,
                            ahead: updatedStatus.ahead || 0
                        }];
                case 9:
                    err_6 = _b.sent();
                    console.error('[gitService] pushCommits error:', err_6);
                    return [2 /*return*/, { success: false, error: err_6.message }];
                case 10: return [2 /*return*/];
            }
        });
    });
}
