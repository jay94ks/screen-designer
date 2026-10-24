import { ipcRenderer } from 'electron';
// Expose safe IPC to renderer
window.electronAPI = {
    onBridgeStatus: function (callback) {
        ipcRenderer.on('bridge-status', function (_, data) { return callback(data); });
    },
    onBridgeMessage: function (callback) {
        ipcRenderer.on('bridge-message', function (_, data) { return callback(data); });
    },
    sendToBridge: function (msg) {
        ipcRenderer.send('renderer-to-bridge', msg);
    },
    // Custom Window Caption Controls
    minimizeWindow: function () {
        ipcRenderer.send('window:minimize');
    },
    maximizeWindow: function () {
        ipcRenderer.send('window:maximize');
    },
    closeWindow: function () {
        ipcRenderer.send('window:close');
    },
    isMaximized: function () { return ipcRenderer.invoke('window:isMaximized'); },
    onMaximizedChange: function (callback) {
        ipcRenderer.on('window:maximized-change', function (_, val) { return callback(val); });
    },
    dragWindow: function (dx, dy) {
        ipcRenderer.send('window:drag-by', { dx: dx, dy: dy });
    },
    // Project Storage (.screen-designer/ & per-page JSON)
    project: {
        savePage: function (page, pageDocsPath, workspacePath) {
            return ipcRenderer.invoke('project:save-page', { page: page, pageDocsPath: pageDocsPath, workspacePath: workspacePath });
        },
        loadPages: function (pageDocsPath, workspacePath) {
            return ipcRenderer.invoke('project:load-pages', { pageDocsPath: pageDocsPath, workspacePath: workspacePath });
        },
        getConfig: function (workspacePath) {
            return ipcRenderer.invoke('project:get-config', { workspacePath: workspacePath });
        }
    },
    // Git Status & Version Control
    git: {
        getStatus: function (pageDocsPath, workspacePath) {
            return ipcRenderer.invoke('git:get-status', { pageDocsPath: pageDocsPath, workspacePath: workspacePath });
        },
        getDiff: function (filePath, workspacePath, commitHash) {
            return ipcRenderer.invoke('git:get-diff', { filePath: filePath, workspacePath: workspacePath, commitHash: commitHash });
        },
        getHistory: function (maxCount, workspacePath) {
            return ipcRenderer.invoke('git:get-history', { maxCount: maxCount, workspacePath: workspacePath });
        },
        getCommitDetails: function (commitHash, workspacePath) {
            return ipcRenderer.invoke('git:get-commit-details', { commitHash: commitHash, workspacePath: workspacePath });
        },
        commit: function (files, summary, description, workspacePath) {
            return ipcRenderer.invoke('git:commit', { files: files, summary: summary, description: description, workspacePath: workspacePath });
        },
        push: function (workspacePath) {
            return ipcRenderer.invoke('git:push', { workspacePath: workspacePath });
        },
        commitDesign: function (message, pageDocsPath, workspacePath) {
            return ipcRenderer.invoke('git:commit-design', { message: message, pageDocsPath: pageDocsPath, workspacePath: workspacePath });
        }
    }
};
