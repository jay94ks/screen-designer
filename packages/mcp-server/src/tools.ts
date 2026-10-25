import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { discoverRepository, createSignature } from 'es-git';
import { CanvasBridge } from './bridge.js';
import { renderArtboardToImage } from './imageRenderer.js';
import { generateReactCode, generateVueCode, generateHtmlCode } from './codeGenerator.js';

export interface ToolDefinition {
  name: string;
  aliases?: string[];
  description: string;
  category: 'project' | 'page' | 'design-system' | 'visual' | 'code' | 'git' | 'canvas';
  parameters: z.ZodObject<any>;
  execute: (args: any, bridge: CanvasBridge) => Promise<{
    content: Array<{ type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }>;
    isError?: boolean;
  }>;
}

export const TOOLS: ToolDefinition[] = [
  // 1. Project: screen_designer_get_project
  {
    name: 'screen_designer_get_project',
    aliases: ['storyboard_init', 'storyboard_get_project'],
    category: 'project',
    description: 'Get project configuration, workspace info, design documents path, canvas status, and list of all pages.',
    parameters: z.object({
      workspacePath: z.string().optional().describe('Project workspace directory (defaults to current workspace)')
    }),
    execute: async ({ workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();
      bridge.setWorkspace(ws);

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      let projectData: any = null;
      try {
        const raw = await fs.readFile(path.join(fullDocsDir, 'project.json'), 'utf-8');
        projectData = JSON.parse(raw);
      } catch {}

      let designSystemSummary: any = null;
      try {
        const raw = await fs.readFile(path.join(fullDocsDir, 'design-system.json'), 'utf-8');
        const ds = JSON.parse(raw);
        designSystemSummary = {
          name: ds.name || 'Default Design System',
          colorsCount: Object.keys(ds.colors || {}).length,
          radiiCount: Object.keys(ds.radii || {}).length,
          typographyCount: Object.keys(ds.typography || {}).length
        };
      } catch {}

      // Discover pages
      const pages: any[] = [];
      const pagesDir = path.join(fullDocsDir, 'pages');
      let dirToCheck = fullDocsDir;
      try {
        await fs.access(pagesDir);
        dirToCheck = pagesDir;
      } catch {}

      try {
        const files = await fs.readdir(dirToCheck);
        for (const file of files.filter(f => f.endsWith('.json') && !['project.json', 'design-system.json'].includes(f))) {
          try {
            const raw = await fs.readFile(path.join(dirToCheck, file), 'utf-8');
            const data = JSON.parse(raw);
            pages.push({
              id: data.id || path.basename(file, '.json'),
              name: data.name || file,
              file,
              artboardCount: (data.artboards || []).length
            });
          } catch {}
        }
      } catch {}

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              workspace: ws,
              pageDocsPath,
              canvasConnected: bridge.isConnected(),
              project: projectData,
              designSystemSummary,
              pagesCount: pages.length,
              pages
            }, null, 2)
          }
        ]
      };
    }
  },

  // 2. Page: screen_designer_list_pages
  {
    name: 'screen_designer_list_pages',
    aliases: ['storyboard_list_pages'],
    category: 'page',
    description: 'List all UI screen pages with metadata, artboard counts, viewport information, and summaries.',
    parameters: z.object({
      workspacePath: z.string().optional().describe('Project workspace directory (defaults to current workspace)')
    }),
    execute: async ({ workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      const pagesDir = path.join(fullDocsDir, 'pages');
      let targetDir = fullDocsDir;
      try {
        await fs.access(pagesDir);
        targetDir = pagesDir;
      } catch {}

      try {
        const files = await fs.readdir(targetDir);
        const jsonFiles = files.filter(f => f.endsWith('.json') && !['project.json', 'design-system.json'].includes(f));
        const pages = [];

        for (const file of jsonFiles) {
          try {
            const raw = await fs.readFile(path.join(targetDir, file), 'utf-8');
            const data = JSON.parse(raw);
            pages.push({
              id: String(data.id || path.basename(file, '.json')),
              name: data.name || file,
              file,
              artboardCount: (data.artboards || []).length,
              artboards: (data.artboards || []).map((a: any) => ({
                id: a.id,
                title: a.title,
                viewport: a.viewport,
                width: a.width,
                height: a.height
              }))
            });
          } catch {}
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ pageDocsPath, count: pages.length, pages }, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to list pages in ${fullDocsDir}: ${err.message}` }]
        };
      }
    }
  },

  // 3. Page: screen_designer_get_page
  {
    name: 'screen_designer_get_page',
    aliases: ['storyboard_get_page'],
    category: 'page',
    description: 'Get full details of a specific UI page document (all artboards, elements, coordinates, styling, layers, interactive flow wires, and tweaks).',
    parameters: z.object({
      pageId: z.string().describe('Page identifier or number (e.g. "1" or "page-1")'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      const candidates = [
        path.join(fullDocsDir, 'pages', `${pageId}.json`),
        path.join(fullDocsDir, `${pageId}.json`),
        path.join(fullDocsDir, 'pages', `page-${pageId}.json`),
        path.join(fullDocsDir, `page-${pageId}.json`)
      ];

      for (const p of candidates) {
        try {
          const raw = await fs.readFile(p, 'utf-8');
          const data = JSON.parse(raw);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ status: 'ok', file: path.relative(ws, p), page: data }, null, 2)
              }
            ]
          };
        } catch {}
      }

      return {
        isError: true,
        content: [{ type: 'text', text: `Page "${pageId}" not found in ${fullDocsDir}` }]
      };
    }
  },

  // 4. Page: screen_designer_save_page
  {
    name: 'screen_designer_save_page',
    aliases: ['storyboard_save_page'],
    category: 'page',
    description: 'Create, save, or update a Virtual DOM page document in docs/ui-boards/pages/<pageId>.json and update project manifest.',
    parameters: z.object({
      page: z.object({
        id: z.string().describe('Unique page ID (e.g. "1" or "page-login")'),
        name: z.string().describe('Display title of the page'),
        artboards: z.array(z.any()).describe('Array of artboard objects in this page'),
        version: z.string().optional()
      }).passthrough().describe('Page document object to save'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ page, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      const dotDir = path.join(ws, '.screen-designer');
      const cacheDir = path.join(dotDir, 'cache');
      await fs.mkdir(dotDir, { recursive: true });
      await fs.mkdir(cacheDir, { recursive: true });

      try {
        const raw = await fs.readFile(path.join(dotDir, 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      const pagesDir = path.join(fullDocsDir, 'pages');
      await fs.mkdir(pagesDir, { recursive: true });

      const pagePath = path.join(pagesDir, `${page.id}.json`);
      const pageDoc = {
        ...page,
        updatedAt: new Date().toISOString()
      };
      await fs.writeFile(pagePath, JSON.stringify(pageDoc, null, 2), 'utf-8');

      // Update project.json
      const projectPath = path.join(fullDocsDir, 'project.json');
      try {
        let project: any = { name: 'Screen Designer Project', pages: [] };
        try {
          project = JSON.parse(await fs.readFile(projectPath, 'utf-8'));
        } catch {}
        project.pages = project.pages || [];
        const existingIdx = project.pages.findIndex((p: any) => String(p.id) === String(page.id));
        const pageEntry = { id: page.id, name: page.name, file: `pages/${page.id}.json`, updatedAt: pageDoc.updatedAt };
        if (existingIdx !== -1) {
          project.pages[existingIdx] = pageEntry;
        } else {
          project.pages.push(pageEntry);
        }
        await fs.writeFile(projectPath, JSON.stringify(project, null, 2), 'utf-8');
      } catch {}

      // Update manifest cache
      const manifestPath = path.join(cacheDir, 'manifest.json');
      let manifest: any = { pages: {}, lastUpdated: new Date().toISOString() };
      try {
        manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
      } catch {}
      manifest.pages = manifest.pages || {};
      manifest.pages[page.id] = {
        name: page.name,
        file: `pages/${page.id}.json`,
        artboardCount: page.artboards.length,
        updatedAt: pageDoc.updatedAt
      };
      manifest.lastUpdated = pageDoc.updatedAt;
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              savedFile: path.relative(ws, pagePath),
              pageId: page.id,
              artboardCount: page.artboards.length
            }, null, 2)
          }
        ]
      };
    }
  },

  // 5. Page: screen_designer_delete_page
  {
    name: 'screen_designer_delete_page',
    aliases: ['storyboard_delete_page'],
    category: 'page',
    description: 'Delete a Virtual DOM page document from the project and update project manifest.',
    parameters: z.object({
      pageId: z.string().describe('Page ID to delete'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      const candidates = [
        path.join(fullDocsDir, 'pages', `${pageId}.json`),
        path.join(fullDocsDir, `${pageId}.json`)
      ];

      let deleted = false;
      for (const p of candidates) {
        try {
          await fs.unlink(p);
          deleted = true;
        } catch {}
      }

      if (!deleted) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Page "${pageId}" file not found to delete` }]
        };
      }

      // Clean up project.json
      try {
        const projectPath = path.join(fullDocsDir, 'project.json');
        const raw = await fs.readFile(projectPath, 'utf-8');
        const project = JSON.parse(raw);
        if (project.pages) {
          project.pages = project.pages.filter((p: any) => String(p.id) !== String(pageId));
          await fs.writeFile(projectPath, JSON.stringify(project, null, 2), 'utf-8');
        }
      } catch {}

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ status: 'ok', deletedPageId: pageId, message: `Successfully deleted page ${pageId}` })
          }
        ]
      };
    }
  },

  // 6. Design System: screen_designer_get_design_system
  {
    name: 'screen_designer_get_design_system',
    aliases: ['storyboard_get_design_system'],
    category: 'design-system',
    description: 'Read the design system tokens and component default styles from docs/ui-boards/design-system.json.',
    parameters: z.object({
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const dsPath = path.resolve(ws, pageDocsPath, 'design-system.json');
      try {
        const raw = await fs.readFile(dsPath, 'utf-8');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ status: 'ok', file: path.relative(ws, dsPath), designSystem: JSON.parse(raw) }, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Design system file not found at ${dsPath}: ${err.message}` }]
        };
      }
    }
  },

  // 7. Design System: screen_designer_save_design_system
  {
    name: 'screen_designer_save_design_system',
    aliases: ['storyboard_set_tokens', 'storyboard_save_design_system'],
    category: 'design-system',
    description: 'Update or replace design system tokens or default element styles in docs/ui-boards/design-system.json, and sync with live canvas.',
    parameters: z.object({
      tokens: z.record(z.any()).optional().describe('Key-value pairs of token overrides (e.g. primaryColor, borderRadius)'),
      designSystem: z.record(z.any()).optional().describe('Full design system object to save or merge'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ tokens, designSystem, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      await fs.mkdir(fullDocsDir, { recursive: true });
      const dsPath = path.join(fullDocsDir, 'design-system.json');

      let currentDs: any = {};
      try {
        currentDs = JSON.parse(await fs.readFile(dsPath, 'utf-8'));
      } catch {}

      let updatedDs = { ...currentDs };
      if (designSystem) {
        updatedDs = { ...updatedDs, ...designSystem };
      }
      if (tokens) {
        updatedDs.tokens = { ...(updatedDs.tokens || {}), ...tokens };
        bridge.setTokens(tokens);
      }
      updatedDs.updatedAt = new Date().toISOString();

      await fs.writeFile(dsPath, JSON.stringify(updatedDs, null, 2), 'utf-8');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              savedFile: path.relative(ws, dsPath),
              message: 'Design system successfully updated and synced with canvas'
            }, null, 2)
          }
        ]
      };
    }
  },

  // 8. Visual: screen_designer_render_artboard_image
  {
    name: 'screen_designer_render_artboard_image',
    aliases: ['storyboard_render_artboard_image'],
    category: 'visual',
    description: 'Render a high-resolution screenshot image (base64 PNG) of an artboard using headless Chrome. Returns direct image data for visual inspection and multimodal vision.',
    parameters: z.object({
      pageId: z.string().describe('Page document ID (e.g. "1" or "page-1")'),
      artboardId: z.string().optional().describe('Artboard ID, title, or index (0-based). Defaults to the first artboard if omitted.'),
      outPath: z.string().optional().describe('Output PNG file path (defaults to "exports/images/<pageId>_<artboardTitle>.png")'),
      width: z.number().optional().describe('Optional custom viewport width (overrides artboard default width)'),
      height: z.number().optional().describe('Optional custom viewport height (overrides artboard default height)'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, artboardId, outPath, width, height, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      try {
        const result = await renderArtboardToImage({
          pageId: String(pageId),
          artboardId: artboardId !== undefined ? String(artboardId) : undefined,
          outPath,
          width,
          height,
          workspacePath: ws
        });

        return {
          content: [
            {
              type: 'image',
              data: result.base64Png,
              mimeType: 'image/png'
            },
            {
              type: 'text',
              text: JSON.stringify({
                status: 'ok',
                message: `Successfully rendered artboard "${result.artboardTitle}" to image`,
                pageId: result.pageId,
                pageName: result.pageName,
                artboardId: result.artboardId,
                artboardTitle: result.artboardTitle,
                outPath: result.outPath,
                dimensions: { width: result.width, height: result.height },
                fileSizeBytes: result.fileSizeBytes
              }, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to render artboard image: ${err.message}` }]
        };
      }
    }
  },

  // 9. Code: screen_designer_export_code
  {
    name: 'screen_designer_export_code',
    aliases: ['storyboard_export_code', 'storyboard_export'],
    category: 'code',
    description: 'Generate production-ready React (TSX), Vue 3 SFC, or HTML code on-demand from structured VDOM page documents into project filesystem.',
    parameters: z.object({
      pageId: z.string().optional().describe('Specific page ID to export (e.g. "1"). If omitted, all pages are exported.'),
      format: z.enum(['react', 'vue', 'html']).default('react').describe('Target export format: react (default), vue, or html'),
      outDir: z.string().default('src/components').describe('Target output directory relative to project root'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, format, outDir, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      let pageDocsPath = 'docs/ui-boards';
      try {
        const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
        const cfg = JSON.parse(raw);
        if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
      } catch {}

      const fullDocsDir = path.resolve(ws, pageDocsPath);
      const pagesDir = path.join(fullDocsDir, 'pages');
      let targetDir = fullDocsDir;
      try {
        await fs.access(pagesDir);
        targetDir = pagesDir;
      } catch {}

      const fullOutDir = path.resolve(ws, outDir);
      await fs.mkdir(fullOutDir, { recursive: true });

      let pageFiles: string[] = [];
      try {
        const files = await fs.readdir(targetDir);
        pageFiles = files.filter(f => f.endsWith('.json') && !['project.json', 'design-system.json'].includes(f));
      } catch (e: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Could not read docs directory ${targetDir}: ${e.message}` }]
        };
      }

      if (pageId) {
        pageFiles = pageFiles.filter(f => {
          const base = path.basename(f, '.json');
          return base === pageId || base === `page-${pageId}` || base.endsWith(pageId);
        });
      }

      const generatedFiles: { component: string; filePath: string; format: string }[] = [];

      for (const file of pageFiles) {
        try {
          const raw = await fs.readFile(path.join(targetDir, file), 'utf-8');
          const pageDoc = JSON.parse(raw);
          const artboards = pageDoc.artboards || [];

          for (const ab of artboards) {
            const compName = ab.title || ab.id;
            let code = '';
            let ext = 'tsx';

            if (format === 'vue') {
              code = generateVueCode(compName, ab.root || ab);
              ext = 'vue';
            } else if (format === 'html') {
              code = generateHtmlCode(compName, ab.root || ab);
              ext = 'html';
            } else {
              code = generateReactCode(compName, ab.root || ab);
              ext = 'tsx';
            }

            const safeFilename = `${compName.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}.${ext}`;
            const targetFilePath = path.join(fullOutDir, safeFilename);
            await fs.writeFile(targetFilePath, code, 'utf-8');

            generatedFiles.push({
              component: compName,
              filePath: path.relative(ws, targetFilePath),
              format
            });
          }
        } catch {}
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              format,
              outDir: path.relative(ws, fullOutDir),
              totalExported: generatedFiles.length,
              files: generatedFiles
            }, null, 2)
          }
        ]
      };
    }
  },

  // 10. Git: screen_designer_git_status
  {
    name: 'screen_designer_git_status',
    aliases: ['storyboard_git_status'],
    category: 'git',
    description: 'Inspect Git status using native es-git to detect modified UI design documents (docs/ui-boards/, .screen-designer/) and branch ahead/behind status.',
    parameters: z.object({
      workspacePath: z.string().optional().describe('Project workspace directory (defaults to current workspace)')
    }),
    execute: async ({ workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      try {
        let repo;
        try {
          repo = await discoverRepository(ws);
        } catch {
          return {
            content: [{ type: 'text', text: JSON.stringify({ isRepo: false, message: 'Target directory is not a git repository' }) }]
          };
        }

        let branch = 'HEAD';
        try {
          const head = repo.head();
          branch = head.shorthand() || 'HEAD';
        } catch {}

        let pageDocsPath = 'docs/ui-boards';
        try {
          const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
          const cfg = JSON.parse(raw);
          if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
        } catch {}

        const normDocs = pageDocsPath.replace(/^\/+|\/+$/g, '');
        const statuses = repo.statuses();

        const designChanges: { path: string; status: string }[] = [];
        const statusesCount = Number(statuses.len());
        for (let i = 0; i < statusesCount; i++) {
          const entry = statuses.get(i);
          if (!entry) continue;
          const st = entry.status();
          if (st.ignored) continue;
          const p = entry.path().replace(/\\/g, '/');
          if (p.endsWith('/')) continue;
          if (p.startsWith(normDocs) || p.startsWith('.screen-designer')) {
            let statusStr = 'modified';
            if (st.wtNew) statusStr = 'untracked';
            else if (st.indexNew) statusStr = 'added';
            else if (st.wtDeleted || st.indexDeleted) statusStr = 'deleted';
            designChanges.push({ path: p, status: statusStr });
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                isRepo: true,
                branch,
                pageDocsPath,
                hasDesignChanges: designChanges.length > 0,
                changeCount: designChanges.length,
                changes: designChanges
              }, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to inspect git status: ${err.message}` }]
        };
      }
    }
  },

  // 11. Git: screen_designer_git_commit
  {
    name: 'screen_designer_git_commit',
    aliases: ['storyboard_git_commit'],
    category: 'git',
    description: 'Stage modified design documents and create a Git commit using native es-git.',
    parameters: z.object({
      message: z.string().describe('Commit summary title message'),
      description: z.string().optional().describe('Extended commit description body'),
      files: z.array(z.string()).optional().describe('Specific files to commit. If omitted, all modified design documents in docs/ui-boards/ and .screen-designer/ are committed.'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ message, description, files, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();

      try {
        let repo;
        try {
          repo = await discoverRepository(ws);
        } catch {
          return {
            isError: true,
            content: [{ type: 'text', text: 'Target directory is not a git repository' }]
          };
        }

        let targetFiles: string[] = files || [];
        if (!targetFiles || targetFiles.length === 0) {
          let pageDocsPath = 'docs/ui-boards';
          try {
            const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
            const cfg = JSON.parse(raw);
            if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
          } catch {}

          const normDocs = pageDocsPath.replace(/^\/+|\/+$/g, '');
          const statuses = repo.statuses();
          const count = Number(statuses.len());
          for (let i = 0; i < count; i++) {
            const entry = statuses.get(i);
            if (!entry) continue;
            const st = entry.status();
            if (st.ignored) continue;
            const p = entry.path().replace(/\\/g, '/');
            if (p.endsWith('/')) continue;
            if (p.startsWith(normDocs) || p.startsWith('.screen-designer')) {
              targetFiles.push(p);
            }
          }
        }

        if (targetFiles.length === 0) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ success: false, message: 'No modified design documents to commit' }) }]
          };
        }

        const index = repo.index();
        for (const f of targetFiles) {
          const norm = f.replace(/\\/g, '/');
          try {
            index.addPath(norm);
          } catch {
            index.addAll([norm]);
          }
        }
        index.write();
        const treeOid = index.writeTree();
        const tree = repo.getTree(treeOid);

        let authorName = 'Screen Designer';
        let authorEmail = 'designer@screen-designer.local';
        try {
          const cfg = repo.config();
          const n = cfg.findString('user.name');
          const e = cfg.findString('user.email');
          if (n) authorName = n;
          if (e) authorEmail = e;
        } catch {}
        const sig = createSignature(authorName, authorEmail);

        const parents: string[] = [];
        try {
          const headOid = repo.revparseSingle('HEAD');
          if (headOid) parents.push(headOid);
        } catch {}

        const fullMessage = description && description.trim()
          ? `${message.trim()}\n\n${description.trim()}`
          : message.trim();

        const commitOid = repo.commit(tree, fullMessage, {
          updateRef: 'HEAD',
          author: sig,
          committer: sig,
          parents
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                commitHash: commitOid,
                message: fullMessage,
                filesCommitted: targetFiles
              }, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to commit files: ${err.message}` }]
        };
      }
    }
  },

  // 12. Canvas: screen_designer_canvas_status
  {
    name: 'screen_designer_canvas_status',
    aliases: ['storyboard_get_selection'],
    category: 'canvas',
    description: 'Inspect live canvas status: WebSocket connection, selected element, active tweak slider overrides, and design tokens.',
    parameters: z.object({}),
    execute: async (_args, bridge) => {
      const state = bridge.getState();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              canvasConnected: bridge.isConnected(),
              selectedElement: state.selectedElement,
              sliderOverrides: state.sliderOverrides,
              designTokens: state.designTokens
            }, null, 2)
          }
        ]
      };
    }
  },

  // 13. Canvas: screen_designer_canvas_preview
  {
    name: 'screen_designer_canvas_preview',
    aliases: ['storyboard_render', 'storyboard_update'],
    category: 'canvas',
    description: 'Push live code/artboard updates or temporary previews directly into the active canvas over WebSocket bridge.',
    parameters: z.object({
      artboards: z.array(
        z.object({
          id: z.string().describe('Unique artboard identifier'),
          title: z.string().describe('Display title of the screen'),
          viewport: z.enum(['mobile', 'tablet', 'desktop']).default('mobile'),
          width: z.number().default(375),
          height: z.number().default(812),
          code: z.string().describe('Self-contained React JSX or HTML/Tailwind string to render in the canvas'),
          description: z.string().optional()
        })
      ).optional().describe('Full list of artboards to render in canvas'),
      id: z.string().optional().describe('Target artboard ID to update'),
      code: z.string().optional().describe('Updated React JSX or HTML/Tailwind code'),
      title: z.string().optional()
    }),
    execute: async ({ artboards, id, code, title }, bridge) => {
      if (artboards && artboards.length > 0) {
        bridge.setArtboards(artboards as any);
      }
      if (id && code) {
        bridge.updateArtboard(id, code, title);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              canvasConnected: bridge.isConnected(),
              message: bridge.isConnected()
                ? 'Canvas received preview update'
                : 'Preview updated in bridge (Canvas app is currently not connected)'
            }, null, 2)
          }
        ]
      };
    }
  }
];

export async function executeTool(name: string, args: any, customBridge?: CanvasBridge) {
  const bridge = customBridge || new CanvasBridge(49494);
  const tool = TOOLS.find(t => t.name === name || (t.aliases && t.aliases.includes(name)));
  if (!tool) {
    throw new Error(`Tool "${name}" not found. Available tools: ${TOOLS.map(t => t.name).join(', ')}`);
  }
  return await tool.execute(args || {}, bridge);
}
