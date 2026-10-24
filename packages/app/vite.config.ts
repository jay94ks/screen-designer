import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';
import fs from 'fs';
import {
  getGitStatus,
  getFileDiff,
  getGitHistory,
  getCommitDetails,
  commitFiles,
  pushCommits
} from './electron/gitService';
import {
  materializePresets,
  listAssets,
  copyAssetFile,
  getMimeType
} from './electron/assetService';
import {
  saveProjectStructure,
  loadProjectStructure,
  migrateProjectFolder
} from './electron/projectService';

function gitApiPlugin(): Plugin {
  return {
    name: 'screen-designer-git-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/git/')) return next();

        const endpoint = req.url.replace('/api/git/', '').split('?')[0];
        let body: any = {};
        if (req.method === 'POST') {
          body = await new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => (data += chunk));
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });
        }

        try {
          res.setHeader('Content-Type', 'application/json');
          if (endpoint === 'status') {
            const data = await getGitStatus(body.pageDocsPath, body.workspacePath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'diff') {
            const data = await getFileDiff(body.filePath, body.workspacePath, body.commitHash);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'history') {
            const data = await getGitHistory(body.maxCount, body.workspacePath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'commit-details') {
            const data = await getCommitDetails(body.commitHash, body.workspacePath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'commit') {
            const data = await commitFiles(body.files, body.summary, body.description, body.workspacePath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'push') {
            const data = await pushCommits(body.workspacePath);
            return res.end(JSON.stringify(data));
          }
          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

function projectApiPlugin(): Plugin {
  return {
    name: 'screen-designer-project-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/project/')) return next();

        const endpoint = req.url.replace('/api/project/', '').split('?')[0];
        let body: any = {};
        if (req.method === 'POST') {
          body = await new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => (data += chunk));
            req.on('end', () => {
              try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
            });
          });
        }

        try {
          res.setHeader('Content-Type', 'application/json');
          if (endpoint === 'save-project') {
            const data = await saveProjectStructure(body);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'load-project') {
            const data = await loadProjectStructure(body);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'migrate-folder') {
            const data = await migrateProjectFolder(body);
            return res.end(JSON.stringify(data));
          }
          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

function assetsApiPlugin(): Plugin {
  return {
    name: 'screen-designer-assets-api',
    configureServer(server) {
      // Ensure presets exist when Vite dev server starts
      materializePresets().catch(() => {});

      server.middlewares.use(async (req, res, next) => {
        // 1. Static asset serving from project docs/ui-boards/assets/ or root assets/
        if (req.url && (req.url.startsWith('/assets/') || req.url.startsWith('/@fs/assets/'))) {
          const cleanUrl = req.url.replace(/^\/@fs/, '').replace(/^\/assets\//, '').split('?')[0];
          const projectRootDir = path.resolve(__dirname, '../../');
          const primaryPath = path.join(projectRootDir, 'docs/ui-boards/assets', cleanUrl);
          const fallbackPath = path.join(projectRootDir, 'assets', cleanUrl);
          const filePath = fs.existsSync(primaryPath) && fs.statSync(primaryPath).isFile()
            ? primaryPath
            : fallbackPath;

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const mime = getMimeType(filePath);
            res.setHeader('Content-Type', mime);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        // 2. Asset API routes
        if (!req.url?.startsWith('/api/assets/')) return next();

        const endpoint = req.url.replace('/api/assets/', '').split('?')[0];
        let body: any = {};
        if (req.method === 'POST') {
          body = await new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => (data += chunk));
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });
        }

        try {
          res.setHeader('Content-Type', 'application/json');
          if (endpoint === 'materialize-presets') {
            const data = await materializePresets(body.workspacePath, body.pageDocsPath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'list') {
            const data = await listAssets(body.workspacePath, body.pageDocsPath);
            return res.end(JSON.stringify(data));
          } else if (endpoint === 'save-file') {
            // Allows saving uploaded base64 data to docs/ui-boards/assets/ & assets/
            const rootDir = body.workspacePath || path.resolve(__dirname, '../../');
            const pageDocsPath = body.pageDocsPath || 'docs/ui-boards';
            const docsAssetsDir = path.join(rootDir, pageDocsPath, 'assets');
            const fallbackAssetsDir = path.join(rootDir, 'assets');

            await fs.promises.mkdir(docsAssetsDir, { recursive: true });
            await fs.promises.mkdir(fallbackAssetsDir, { recursive: true });

            const fileName = (body.fileName || `image_${Date.now()}.png`).replace(/[^a-zA-Z0-9_.\-\uac00-\ud7a3]/g, '_');
            const targetPath = path.join(docsAssetsDir, fileName);
            const fallbackPath = path.join(fallbackAssetsDir, fileName);

            if (body.dataUrl) {
              const base64Data = body.dataUrl.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              await fs.promises.writeFile(targetPath, buffer);
              await fs.promises.writeFile(fallbackPath, buffer);
            } else if (body.content) {
              await fs.promises.writeFile(targetPath, body.content, 'utf-8');
              await fs.promises.writeFile(fallbackPath, body.content, 'utf-8');
            }

            const relativePath = `assets/${fileName}`;
            return res.end(JSON.stringify({ success: true, relativePath, fileName, dataUrl: body.dataUrl }));
          }
          next();
        } catch (err: any) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    gitApiPlugin(),
    projectApiPlugin(),
    assetsApiPlugin(),
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
          const isHeadlessLinux = process.platform === 'linux' && !process.env.DISPLAY;
          if (process.env.NO_ELECTRON || isHeadlessLinux) {
            console.log('[Vite Electron] Headless/Linux host mode: skipping Electron spawn');
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
        onstart(options) {
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
