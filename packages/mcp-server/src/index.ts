#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { discoverRepository } from 'es-git';
import { CanvasBridge } from './bridge.js';
import { renderArtboardToImage } from './imageRenderer.js';

// --- VDOM Code Generators (React, Vue 3, HTML) ---
function vnodeToJsx(node: any, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` className="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `'${v}'`}`)
    .join(', ');

  const styleAttr = inlineStyles ? ` style={{ ${inlineStyles} }}` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenJsx = (node.children || [])
    .map((c: any) => vnodeToJsx(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenJsx}
${indent}</${tag}>`;
}

function generateReactCode(componentName: string, rootNode: any): string {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const jsxBody = vnodeToJsx(rootNode, 4);
  return `import React from 'react';

// Auto-generated React Component by Screen Designer MCP Engine
export default function ${safeName}(props: { tweaks?: Record<string, any> }) {
  const { tweaks = {} } = props;

  return (
${jsxBody}
  );
}
`;
}

function vnodeToVueTemplate(node: any, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>{{ '${textContent.replace(/'/g, "\\'")}' }}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c: any) => vnodeToVueTemplate(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  {{ '${textContent.replace(/'/g, "\\'")}' }}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

function generateVueCode(componentName: string, rootNode: any): string {
  const templateBody = vnodeToVueTemplate(rootNode, 2);
  return `<script setup lang="ts">
// Auto-generated Vue 3 Component by Screen Designer MCP Engine
interface Props {
  tweaks?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  tweaks: () => ({})
});
</script>

<template>
${templateBody}
</template>

<style scoped>
/* Scoped styles managed by Screen Designer */
</style>
`;
}

function vnodeToHtml(node: any, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c: any) => vnodeToHtml(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

function generateHtmlCode(componentName: string, rootNode: any): string {
  const htmlBody = vnodeToHtml(rootNode, 4);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 flex items-center justify-center min-h-screen p-4">
${htmlBody}
</body>
</html>
`;
}

const bridge = new CanvasBridge(49494);
await bridge.start();

const server = new McpServer({
  name: 'screen-designer-mcp',
  version: '0.1.0'
});

// 1. Tool: storyboard_init
server.tool(
  'storyboard_init',
  'Initialize storyboard canvas session for a target project workspace',
  {
    workspacePath: z.string().describe('Absolute path to the target project workspace')
  },
  async ({ workspacePath }) => {
    bridge.setWorkspace(workspacePath);
    const connected = bridge.isConnected();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            workspace: workspacePath,
            canvasConnected: connected,
            message: connected
              ? 'Canvas app is connected and ready.'
              : 'Canvas bridge started. Please ensure Screen Designer Electron app is open.'
          })
        }
      ]
    };
  }
);

// 2. Tool: storyboard_render
server.tool(
  'storyboard_render',
  'Render one or multiple visual storyboard artboards in the Electron canvas',
  {
    artboards: z.array(
      z.object({
        id: z.string().describe('Unique artboard identifier, e.g. "step-1-login"'),
        title: z.string().describe('Display title of the screen'),
        viewport: z.enum(['mobile', 'tablet', 'desktop']).default('mobile'),
        width: z.number().default(375),
        height: z.number().default(812),
        code: z.string().describe('Self-contained React JSX or HTML/Tailwind string to render in the canvas'),
        description: z.string().optional()
      })
    )
  },
  async ({ artboards }) => {
    bridge.setArtboards(artboards as any);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            renderedCount: artboards.length,
            screens: artboards.map((a) => a.title)
          })
        }
      ]
    };
  }
);

// 3. Tool: storyboard_update
server.tool(
  'storyboard_update',
  'Instantly update the code or title of a specific artboard with zero-delay refresh',
  {
    id: z.string().describe('Target artboard ID to update'),
    code: z.string().describe('Updated React JSX or HTML/Tailwind code'),
    title: z.string().optional()
  },
  async ({ id, code, title }) => {
    bridge.updateArtboard(id, code, title);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: 'ok', updatedId: id })
        }
      ]
    };
  }
);

// 4. Tool: storyboard_get_selection
server.tool(
  'storyboard_get_selection',
  'Inspect the current user interaction state from the canvas: clicked element, active comment, and dynamic slider values',
  {},
  async () => {
    const state = bridge.getState();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            selectedElement: state.selectedElement,
            sliderOverrides: state.sliderOverrides,
            designTokens: state.designTokens
          }, null, 2)
        }
      ]
    };
  }
);

// 5. Tool: storyboard_set_tokens
server.tool(
  'storyboard_set_tokens',
  'Apply or update design system tokens (colors, font family, border radius, spacing) across all artboards',
  {
    tokens: z.record(z.string()).describe('Key-value pairs of design system tokens (e.g. primaryColor, borderRadius)')
  },
  async ({ tokens }) => {
    bridge.setTokens(tokens);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: 'ok', updatedTokens: tokens })
        }
      ]
    };
  }
);

// 6. Tool: storyboard_export
server.tool(
  'storyboard_export',
  'Export the finalized component code and save it directly into the target project filesystem (Handoff)',
  {
    targetFilePath: z.string().describe('Relative or absolute file path in project to save, e.g. "src/components/LoginModal.tsx"'),
    content: z.string().describe('Full finalized code to write to file')
  },
  async ({ targetFilePath, content }) => {
    const state = bridge.getState();
    let absPath = targetFilePath;
    if (state.workspacePath && !path.isAbsolute(targetFilePath)) {
      absPath = path.resolve(state.workspacePath, targetFilePath);
    }

    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, content, 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            savedPath: absPath,
            message: `Component successfully exported to ${absPath}`
          })
        }
      ]
    };
  }
);

// 7. Tool: storyboard_export_code (On-demand code generator from VDOM JSON documents)
server.tool(
  'storyboard_export_code',
  'Generate production-ready React (TSX), Vue 3 SFC, or HTML code on-demand from structured VDOM page documents (docs/ui-boards/*.json)',
  {
    pageId: z.string().optional().describe('Specific page ID to export (e.g. "page-1"). If omitted, all pages are exported.'),
    format: z.enum(['react', 'vue', 'html']).default('react').describe('Target export format: react (default), vue, or html'),
    outDir: z.string().default('src/components').describe('Target output directory relative to project root'),
    workspacePath: z.string().optional().describe('Project workspace directory (defaults to current workspace)')
  },
  async ({ pageId, format, outDir, workspacePath }) => {
    const state = bridge.getState();
    const ws = workspacePath || state.workspacePath || process.cwd();

    let pageDocsPath = 'docs/ui-boards';
    try {
      const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
      const cfg = JSON.parse(raw);
      if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
    } catch {}

    const fullDocsDir = path.resolve(ws, pageDocsPath);
    const fullOutDir = path.resolve(ws, outDir);
    await fs.mkdir(fullOutDir, { recursive: true });

    let pageFiles: string[] = [];
    try {
      const files = await fs.readdir(fullDocsDir);
      pageFiles = files.filter(f => f.endsWith('.json'));
    } catch (e: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Directory not found or unreadable: ${fullDocsDir}` }]
      };
    }

    if (pageId) {
      pageFiles = pageFiles.filter(f => f === `${pageId}.json` || f.includes(pageId));
    }

    const exportedFiles: string[] = [];

    for (const pageFile of pageFiles) {
      try {
        const raw = await fs.readFile(path.join(fullDocsDir, pageFile), 'utf-8');
        const pageDoc = JSON.parse(raw);

        for (const artboard of pageDoc.artboards || []) {
          if (!artboard.rootNode) continue;

          let code = '';
          let ext = 'tsx';

          if (format === 'vue') {
            code = generateVueCode(artboard.title, artboard.rootNode);
            ext = 'vue';
          } else if (format === 'html') {
            code = generateHtmlCode(artboard.title, artboard.rootNode);
            ext = 'html';
          } else {
            code = generateReactCode(artboard.title, artboard.rootNode);
            ext = 'tsx';
          }

          const safeFilename = artboard.title.replace(/[^a-zA-Z0-9가-힣_-]/g, '_') || 'Screen';
          const outFile = path.join(fullOutDir, `${safeFilename}.${ext}`);
          await fs.writeFile(outFile, code, 'utf-8');
          exportedFiles.push(path.relative(ws, outFile));
        }
      } catch (err: any) {
        console.error(`Error processing ${pageFile}:`, err);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            format,
            outDir,
            exportedCount: exportedFiles.length,
            files: exportedFiles,
            message: `Successfully generated ${exportedFiles.length} file(s) into ${outDir}`
          }, null, 2)
        }
      ]
    };
  }
);

// 8. Tool: storyboard_git_status (Detect modified UI design documents)
server.tool(
  'storyboard_git_status',
  'Inspect Git status to check if any UI design documents (docs/ui-boards/*.json) or .screen-designer configuration have changed',
  {
    workspacePath: z.string().optional().describe('Project workspace directory (defaults to current workspace)')
  },
  async ({ workspacePath }) => {
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
);

// 9. Tool: storyboard_list_pages (List all VDOM pages)
server.tool(
  'storyboard_list_pages',
  'List all structured Virtual DOM page documents in docs/ui-boards/*.json',
  {
    workspacePath: z.string().optional().describe('Project workspace directory')
  },
  async ({ workspacePath }) => {
    const state = bridge.getState();
    const ws = workspacePath || state.workspacePath || process.cwd();

    let pageDocsPath = 'docs/ui-boards';
    try {
      const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
      const cfg = JSON.parse(raw);
      if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
    } catch {}

    const fullDocsDir = path.resolve(ws, pageDocsPath);
    try {
      const files = await fs.readdir(fullDocsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      const pages = [];

      for (const file of jsonFiles) {
        try {
          const raw = await fs.readFile(path.join(fullDocsDir, file), 'utf-8');
          const data = JSON.parse(raw);
          pages.push({
            id: data.id || path.basename(file, '.json'),
            name: data.name || file,
            file,
            artboardCount: (data.artboards || []).length,
            artboards: (data.artboards || []).map((a: any) => ({ id: a.id, title: a.title, viewport: a.viewport }))
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
);

// 10. Tool: storyboard_save_page
server.tool(
  'storyboard_save_page',
  'Save or update a Virtual DOM page document in docs/ui-boards/<pageId>.json and update .screen-designer cache',
  {
    page: z.object({
      id: z.string(),
      name: z.string(),
      artboards: z.array(z.any()),
      version: z.string().optional()
    }).describe('The page document object to save'),
    workspacePath: z.string().optional().describe('Project workspace directory')
  },
  async ({ page, workspacePath }) => {
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
    await fs.mkdir(fullDocsDir, { recursive: true });

    const pagePath = path.join(fullDocsDir, `${page.id}.json`);
    const pageDoc = {
      ...page,
      updatedAt: new Date().toISOString()
    };
    await fs.writeFile(pagePath, JSON.stringify(pageDoc, null, 2), 'utf-8');

    // Update manifest cache
    const manifestPath = path.join(cacheDir, 'manifest.json');
    let manifest: any = { pages: {}, lastUpdated: new Date().toISOString() };
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    } catch {}
    manifest.pages = manifest.pages || {};
    manifest.pages[page.id] = {
      name: page.name,
      file: `${page.id}.json`,
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
          })
        }
      ]
    };
  }
);

// 11. Tool: storyboard_render_artboard_image (Render visual artboard of a page to an image)
server.tool(
  'storyboard_render_artboard_image',
  'Render a visual screenshot image of a specific artboard (시안) from a page document (docs/ui-boards/<pageId>.json). Returns direct image data (base64 PNG) and saves the image to file.',
  {
    pageId: z.string().describe('Page document ID (e.g. "page-1")'),
    artboardId: z.string().optional().describe('Artboard ID, title, or index (0-based). Defaults to the first artboard if omitted.'),
    outPath: z.string().optional().describe('Output PNG file path (defaults to "exports/images/<pageId>_<artboardTitle>.png")'),
    width: z.number().optional().describe('Optional custom viewport width (overrides artboard default width)'),
    height: z.number().optional().describe('Optional custom viewport height (overrides artboard default height)'),
    workspacePath: z.string().optional().describe('Project workspace directory')
  },
  async ({ pageId, artboardId, outPath, width, height, workspacePath }) => {
    const state = bridge.getState();
    const ws = workspacePath || state.workspacePath || process.cwd();

    try {
      const result = await renderArtboardToImage({
        pageId,
        artboardId,
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
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'error',
              message: err.message || 'Failed to render artboard image'
            }, null, 2)
          }
        ]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[ScreenDesigner MCP] Stdio transport connected.');
