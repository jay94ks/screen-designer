import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import {
  getGitStatus,
  getFileDiff,
  getGitHistory,
  getCommitDetails,
  commitFiles,
  pushCommits
} from './electron/gitService';

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

export default defineConfig({
  plugins: [
    react(),
    gitApiPlugin(),
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
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
