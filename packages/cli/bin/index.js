#!/usr/bin/env node
import { promises as fs, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import os from 'os';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { discoverRepository } from 'es-git';
import Registry from 'winreg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getHtmlTag(type, props) {
  switch (type) {
    case 'heading': return `h${props?.headingLevel || 2}`;
    case 'text': return 'p';
    case 'button': return 'button';
    case 'input': return 'input';
    case 'textarea': return 'textarea';
    case 'select': return 'select';
    case 'image': return 'img';
    case 'video': return 'video';
    case 'audio': return 'audio';
    case 'iframe': return 'iframe';
    case 'dialog': return 'dialog';
    case 'section': return 'section';
    case 'header': return 'header';
    case 'footer': return 'footer';
    case 'nav': return 'nav';
    case 'aside': return 'aside';
    case 'main': return 'main';
    case 'article': return 'article';
    case 'blockquote': return 'blockquote';
    case 'code': return 'code';
    case 'pre': return 'pre';
    case 'span': return 'span';
    case 'label': return 'label';
    case 'form': return 'form';
    case 'table': return 'table';
    case 'thead': return 'thead';
    case 'tbody': return 'tbody';
    case 'tr': return 'tr';
    case 'th': return 'th';
    case 'td': return 'td';
    case 'ul': return 'ul';
    case 'ol': return 'ol';
    case 'li': return 'li';
    case 'details': return 'details';
    case 'summary': return 'summary';
    case 'divider': return 'hr';
    case 'scroll-container':
    case 'frame':
    case 'container':
    case 'box':
    case 'card':
    default:
      return 'div';
  }
}

function normalizeStyle(style = {}) {
  const norm = { ...style };
  if (norm.backgroundImage && !norm.backgroundImage.startsWith('url(') && !norm.backgroundImage.startsWith('linear-gradient(') && !norm.backgroundImage.startsWith('radial-gradient(')) {
    norm.backgroundImage = `url("${norm.backgroundImage}")`;
  }
  const filterParts = [];
  if (norm.brightness !== undefined) filterParts.push(`brightness(${norm.brightness}%)`);
  if (norm.contrast !== undefined) filterParts.push(`contrast(${norm.contrast}%)`);
  if (norm.grayscale !== undefined) filterParts.push(`grayscale(${norm.grayscale}%)`);
  if (norm.blur !== undefined && norm.blur !== 0) filterParts.push(`blur(${typeof norm.blur === 'number' ? `${norm.blur}px` : norm.blur})`);
  if (filterParts.length > 0 && !norm.filter) {
    norm.filter = filterParts.join(' ');
  }
  return norm;
}

// --- Code Generators (React, Vue.js, HTML) from VDOM ---
function vnodeToJsx(node, indentLevel = 2) {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);
  const style = normalizeStyle(node.style || {});

  const classAttr = node.className ? ` className="${node.className}"` : '';
  const inlineStyles = Object.entries(style)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `'${v}'`}`)
    .join(', ');

  const styleAttr = inlineStyles ? ` style={{ ${inlineStyles} }}` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'textarea') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    return `${indent}<textarea${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
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
    .map((c) => vnodeToJsx(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenJsx}
${indent}</${tag}>`;
}

function generateReactCode(componentName, rootNode) {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const jsxBody = vnodeToJsx(rootNode, 4);
  return `import React from 'react';

// Auto-generated React Component by Screen Designer CLI
export default function ${safeName}(props: { tweaks?: Record<string, any> }) {
  const { tweaks = {} } = props;

  return (
${jsxBody}
  );
}
`;
}

function vnodeToVueTemplate(node, indentLevel = 2) {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);
  const style = normalizeStyle(node.style || {});

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(style)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight', 'flexGrow', 'flexShrink'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
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
    .map((c) => vnodeToVueTemplate(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  {{ '${textContent.replace(/'/g, "\\'")}' }}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

function generateVueCode(componentName, rootNode) {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const templateBody = vnodeToVueTemplate(rootNode, 2);
  return `<script setup lang="ts">
// Auto-generated Vue 3 Component by Screen Designer CLI
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
/* Utility and scoped styles managed by Screen Designer */
</style>
`;
}

function vnodeToHtml(node, indentLevel = 2) {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);
  const style = normalizeStyle(node.style || {});

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(style)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight', 'flexGrow', 'flexShrink'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
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
    .map((c) => vnodeToHtml(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

function generateHtmlCode(componentName, rootNode) {
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

// --- CLI Commands ---
const AGENTS_TEMPLATE = `# Screen Designer Storyboard Integration
This project is integrated with Screen Designer Storyboard Canvas.
- Page documents: docs/ui-boards/*.json (Raw Virtual DOM JSON)
- Settings & Cache: .screen-designer/
- On-demand Code Generation: npx screen-designer export --format=react|vue|html
`;

async function init(targetDir = process.cwd()) {
  const resolvedTarget = path.resolve(process.cwd(), targetDir);
  console.log(`[Screen Designer] Initializing in: ${resolvedTarget}`);

  // 1. Create .screen-designer directory & cache
  const dotDir = path.join(resolvedTarget, '.screen-designer');
  const cacheDir = path.join(dotDir, 'cache');
  await fs.mkdir(dotDir, { recursive: true });
  await fs.mkdir(cacheDir, { recursive: true });

  const config = {
    version: '1.0.0',
    workspace: resolvedTarget,
    pageDocsPath: 'docs/ui-boards',
    mcpServer: '@screen-designer/mcp-server',
    bridgePort: 49494,
    updatedAt: new Date().toISOString()
  };
  await fs.writeFile(path.join(dotDir, 'config.json'), JSON.stringify(config, null, 2), 'utf-8');
  console.log('  ✔ Created .screen-designer/ directory & config.json');

  // 2. Create docs/ui-boards/ directory structure
  const docsDir = path.join(resolvedTarget, 'docs', 'ui-boards');
  const pagesDir = path.join(docsDir, 'pages');
  const assetsDir = path.join(docsDir, 'assets');
  await fs.mkdir(docsDir, { recursive: true });
  await fs.mkdir(pagesDir, { recursive: true });
  await fs.mkdir(assetsDir, { recursive: true });

  // 2.1 project.json
  const initialProject = {
    name: path.basename(resolvedTarget) + ' UI Storyboard',
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    activePageId: 'page-1',
    pageDocsPath: 'docs/ui-boards',
    pages: [
      {
        id: 'page-1',
        name: 'Page 1 (서비스 기획 보드)',
        number: 1,
        fileName: 'pages/1.json',
        artboardsCount: 1
      }
    ],
    assets: [
      'assets/preset-gradient.svg',
      'assets/preset-tech.svg',
      'assets/preset-nature.svg'
    ],
    settings: {
      theme: 'light',
      gridVisible: true,
      gridSize: 24,
      canvasBackground: '#e5e7eb'
    }
  };
  await fs.writeFile(path.join(docsDir, 'project.json'), JSON.stringify(initialProject, null, 2), 'utf-8');
  console.log('  ✔ Created docs/ui-boards/project.json');

  // 2.2 design-system.json
  const initialDesignSystem = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    theme: 'light',
    componentDefaults: {
      frame: { backgroundColor: '#0f172a', color: '#f8fafc', padding: 20, borderRadius: 0 },
      card: { backgroundColor: '#1e293b', color: '#f8fafc', padding: 16, borderRadius: 16, borderColor: '#334155', borderWidth: 1 },
      button: { backgroundColor: '#4f46e5', color: '#ffffff', padding: 12, borderRadius: 12, fontWeight: 'bold' }
    }
  };
  await fs.writeFile(path.join(docsDir, 'design-system.json'), JSON.stringify(initialDesignSystem, null, 2), 'utf-8');
  console.log('  ✔ Created docs/ui-boards/design-system.json');

  // 2.3 pages/1.json
  const initialPage = {
    id: 'page-1',
    name: 'Page 1 (서비스 기획 보드)',
    number: 1,
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    artboards: [
      {
        id: 'screen-1-main',
        title: '1. 메인 홈 화면',
        viewport: 'mobile',
        width: 375,
        height: 812,
        rootNode: {
          id: 'root-1',
          type: 'frame',
          name: 'Home Frame',
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#ffffff'
          },
          children: [
            {
              id: 'text-title',
              type: 'text',
              name: 'App Title',
              content: '새로운 서비스 시작하기',
              style: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' }
            },
            {
              id: 'btn-cta',
              type: 'button',
              name: 'Start Button',
              content: '시작하기',
              style: { padding: 14, borderRadius: 12, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }
            }
          ]
        },
        tweaksSchema: [],
        tweakValues: {}
      }
    ]
  };

  await fs.writeFile(path.join(pagesDir, '1.json'), JSON.stringify(initialPage, null, 2), 'utf-8');
  await fs.writeFile(path.join(docsDir, 'page-1.json'), JSON.stringify(initialPage, null, 2), 'utf-8');
  console.log('  ✔ Created docs/ui-boards/pages/1.json');

  // 3. Write LLM guideline files
  await fs.writeFile(path.join(resolvedTarget, 'AGENTS.md'), AGENTS_TEMPLATE, 'utf-8');
  await fs.writeFile(path.join(resolvedTarget, 'CLAUDE.md'), AGENTS_TEMPLATE, 'utf-8');
  console.log('  ✔ Created AGENTS.md & CLAUDE.md guidelines');

  console.log('\n🎉 Screen Designer successfully initialized in target directory!');
  console.log(`  - Storyboard Project: ${path.join(docsDir, 'project.json')}`);
  console.log(`  - Design System:     ${path.join(docsDir, 'design-system.json')}`);
  console.log(`  - Page Documents:    ${path.join(pagesDir, '1.json')}`);
  console.log(`  - Assets Folder:     ${assetsDir}`);
}

async function exportCode() {
  const cwd = process.cwd();
  
  // Parse flags
  let format = 'react';
  let outDir = 'src/components';
  let targetPageId = null;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--format=')) {
      format = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--out=')) {
      outDir = arg.split('=')[1];
    } else if (!arg.startsWith('--') && !targetPageId) {
      targetPageId = arg;
    }
  }

  // Read config if available
  let pageDocsPath = 'docs/ui-boards';
  try {
    const raw = await fs.readFile(path.join(cwd, '.screen-designer', 'config.json'), 'utf-8');
    const cfg = JSON.parse(raw);
    if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
  } catch {}

  const fullDocsDir = path.resolve(cwd, pageDocsPath);
  const fullOutDir = path.resolve(cwd, outDir);
  await fs.mkdir(fullOutDir, { recursive: true });

  console.log(`[Screen Designer Export] Format: ${format.toUpperCase()} | Out: ${outDir}`);

  let pageFiles = [];
  try {
    const files = await fs.readdir(fullDocsDir);
    pageFiles = files.filter(f => f.endsWith('.json'));
  } catch (e) {
    console.error(`[Error] Could not find page documents in: ${fullDocsDir}`);
    process.exit(1);
  }

  if (targetPageId) {
    pageFiles = pageFiles.filter(f => f === `${targetPageId}.json` || f.includes(targetPageId));
  }

  if (pageFiles.length === 0) {
    console.log(`No matching page documents found in ${pageDocsPath}/`);
    return;
  }

  let totalExported = 0;

  for (const pageFile of pageFiles) {
    try {
      const raw = await fs.readFile(path.join(fullDocsDir, pageFile), 'utf-8');
      const pageDoc = JSON.parse(raw);

      console.log(`\n📄 Processing Page: "${pageDoc.name || pageDoc.id}"`);

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

        console.log(`  ✔ Exported [${format}]: ${path.relative(cwd, outFile)}`);
        totalExported++;
      }
    } catch (err) {
      console.error(`  ✖ Failed to export ${pageFile}:`, err.message);
    }
  }

  console.log(`\n✨ Successfully generated ${totalExported} component(s) into ${outDir}/`);
}

async function status() {
  const cwd = process.cwd();
  console.log(`[Screen Designer] Checking Git status in: ${cwd}`);

  try {
    let repo;
    try {
      repo = await discoverRepository(cwd);
    } catch {
      console.log('⚠️ Not a git repository.');
      return;
    }

    let branch = 'HEAD';
    try {
      const head = repo.head();
      branch = head.shorthand() || 'HEAD';
    } catch {}
    console.log(`🌿 Git Branch: ${branch}`);

    let pageDocsPath = 'docs/ui-boards';
    try {
      const raw = await fs.readFile(path.join(cwd, '.screen-designer', 'config.json'), 'utf-8');
      const cfg = JSON.parse(raw);
      if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
    } catch {}

    const normDocs = pageDocsPath.replace(/^\/+|\/+$/g, '');
    const statuses = repo.statuses();

    const designChanges = [];
    const statusesCount = Number(statuses.len());
    for (let i = 0; i < statusesCount; i++) {
      const entry = statuses.get(i);
      if (!entry) continue;
      const st = entry.status();
      if (st.ignored) continue;
      const p = entry.path().replace(/\\/g, '/');
      if (p.endsWith('/')) continue;
      if (p.startsWith(normDocs) || p.startsWith('.screen-designer')) {
        let statusStr = 'MODIFIED';
        if (st.wtNew) statusStr = 'UNTRACKED';
        else if (st.indexNew) statusStr = 'ADDED';
        else if (st.wtDeleted || st.indexDeleted) statusStr = 'DELETED';
        designChanges.push({ path: p, status: statusStr });
      }
    }

    console.log(`📂 Design documents path: ${pageDocsPath}/`);
    console.log(`⚙️ Cache directory:      .screen-designer/`);

    if (designChanges.length === 0) {
      console.log('✔ All screen designer documents are clean and up-to-date.');
    } else {
      console.log(`\n⚠️  Found ${designChanges.length} modified design document(s):`);
      for (const f of designChanges) {
        console.log(`  - [${f.status}] ${f.path}`);
      }
      console.log('\nTip: Use Git commit in Screen Designer Canvas UI or run "git commit" to commit your design changes.');
    }
  } catch (err) {
    console.error('[Error checking git status]', err);
  }
}

function parseCliArgs(rawArgs) {
  let parsed = {};
  for (const arg of rawArgs) {
    if (arg.startsWith('{') && arg.endsWith('}')) {
      try {
        parsed = { ...parsed, ...JSON.parse(arg) };
        continue;
      } catch {}
    }
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx);
        let val = arg.slice(eqIdx + 1);
        if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (/^\d+$/.test(val)) val = parseInt(val, 10);
        parsed[key] = val;
      } else {
        parsed[arg.slice(2)] = true;
      }
      continue;
    }
    if (arg.includes('=')) {
      const [k, v] = arg.split('=');
      parsed[k] = v;
      continue;
    }
  }
  return parsed;
}

async function getMcpModule() {
  try {
    return await import('@screen-designer/mcp-server');
  } catch {
    const localPath = path.resolve(__dirname, '../../mcp-server/dist/index.js');
    return await import(localPath);
  }
}

async function handleMcpCommand(subArgs) {
  const mod = await getMcpModule();
  const action = subArgs[0] || 'serve';

  if (action === 'serve' || action === 'start' || !subArgs[0]) {
    process.env.MCP_SERVER_AUTO_START = 'true';
    await mod.runServer();
    return;
  }

  if (action === 'list' || action === 'ls') {
    console.log(`\n🛠️  Screen Designer MCP Tools (${mod.TOOLS.length} tools registered)\n`);

    const categories = {
      project: '📁 Project & Workspace',
      page: '📄 Screen Pages (VDOM)',
      'design-system': '🎨 Design System & Tokens',
      visual: '👁️ Visual Inspection & Screenshots',
      code: '💻 Code Generation & Handoff',
      git: '🌿 Git Version Control (es-git)',
      canvas: '⚡ Live Canvas Remote Control'
    };

    for (const [catKey, catTitle] of Object.entries(categories)) {
      const catTools = mod.TOOLS.filter(t => t.category === catKey);
      if (catTools.length === 0) continue;

      console.log(`\x1b[1m\x1b[36m${catTitle}\x1b[0m:`);
      for (const t of catTools) {
        const aliasStr = t.aliases && t.aliases.length > 0 ? ` \x1b[90m(alias: ${t.aliases.join(', ')})\x1b[0m` : '';
        console.log(`  \x1b[32m• ${t.name}\x1b[0m${aliasStr}`);
        console.log(`    ${t.description}`);

        const shape = t.parameters.shape || {};
        const paramKeys = Object.keys(shape);
        if (paramKeys.length > 0) {
          const paramsList = paramKeys.map(k => {
            const isOpt = shape[k].isOptional();
            return isOpt ? `[${k}]` : `<${k}>`;
          }).join(' ');
          console.log(`    \x1b[90mParameters: ${paramsList}\x1b[0m`);
        }
        console.log('');
      }
    }

    console.log('\x1b[90mUsage: screen-designer mcp call <tool-name> [--param=value] or \'{"param":"value"}\'\x1b[0m\n');
    return;
  }

  if (action === 'call' || action === 'run') {
    const toolName = subArgs[1];
    if (!toolName) {
      console.error('❌ Error: Tool name required. Example: screen-designer mcp call screen_designer_list_pages');
      process.exit(1);
    }

    const rawToolArgs = subArgs.slice(2);
    const parsedArgs = parseCliArgs(rawToolArgs);
    if (!parsedArgs.workspacePath) {
      parsedArgs.workspacePath = process.cwd();
    }

    try {
      console.log(`🚀 Executing MCP tool \x1b[36m${toolName}\x1b[0m...`);
      const result = await mod.executeTool(toolName, parsedArgs);

      if (result.isError) {
        console.error(`\n❌ Tool returned an error:`);
        for (const item of result.content) {
          if (item.type === 'text') console.error(item.text);
        }
        process.exit(1);
      }

      for (const item of result.content) {
        if (item.type === 'text') {
          try {
            const obj = JSON.parse(item.text);
            console.log('\n✔ Result:');
            console.log(JSON.stringify(obj, null, 2));
          } catch {
            console.log('\n✔ Result:', item.text);
          }
        } else if (item.type === 'image') {
          console.log(`\n🖼️  Image output received (${item.mimeType}, base64 length: ${item.data.length})`);
        }
      }
    } catch (err) {
      console.error(`\n❌ Failed to execute MCP tool: ${err.message}`);
      process.exit(1);
    }
    return;
  }

  console.error(`Unknown mcp subcommand "${action}". Available: serve, list, call`);
  process.exit(1);
}

async function handlePageCommand(subArgs) {
  const mod = await getMcpModule();
  const action = subArgs[0] || 'list';
  const cwd = process.cwd();

  if (action === 'list' || action === 'ls') {
    const targetDir = subArgs[1] || cwd;
    const res = await mod.executeTool('screen_designer_list_pages', { workspacePath: targetDir });
    const data = JSON.parse(res.content[0].text);
    console.log(`\n📂 Pages in ${data.pageDocsPath}/ (Total: ${data.count})`);
    for (const p of data.pages) {
      console.log(`  • [${p.id}] ${p.name} (${p.artboardCount} artboards, file: ${p.file})`);
      if (p.artboards && p.artboards.length > 0) {
        for (const ab of p.artboards) {
          console.log(`      - [${ab.viewport || 'mobile'} ${ab.width || 375}x${ab.height || 812}] ${ab.title || ab.id}`);
        }
      }
    }
    console.log('');
    return;
  }

  if (action === 'get' || action === 'show') {
    const pageId = subArgs[1];
    if (!pageId) {
      console.error('❌ Error: pageId required. Example: screen-designer page show 1');
      process.exit(1);
    }
    const targetDir = subArgs[2] || cwd;
    const res = await mod.executeTool('screen_designer_get_page', { pageId, workspacePath: targetDir });
    if (res.isError) {
      console.error(res.content[0].text);
      process.exit(1);
    }
    const data = JSON.parse(res.content[0].text);
    console.log(JSON.stringify(data.page, null, 2));
    return;
  }

  if (action === 'save' || action === 'import') {
    const filePath = subArgs[1];
    if (!filePath) {
      console.error('❌ Error: JSON file path required. Example: screen-designer page save my-page.json');
      process.exit(1);
    }
    const targetDir = subArgs[2] || cwd;
    const raw = await fs.readFile(path.resolve(cwd, filePath), 'utf-8');
    const pageObj = JSON.parse(raw);
    const res = await mod.executeTool('screen_designer_save_page', { page: pageObj, workspacePath: targetDir });
    const data = JSON.parse(res.content[0].text);
    console.log(`✔ Page "${data.pageId}" saved to ${data.savedFile} (${data.artboardCount} artboards)`);
    return;
  }

  if (action === 'delete' || action === 'rm') {
    const pageId = subArgs[1];
    if (!pageId) {
      console.error('❌ Error: pageId required. Example: screen-designer page delete 2');
      process.exit(1);
    }
    const targetDir = subArgs[2] || cwd;
    const res = await mod.executeTool('screen_designer_delete_page', { pageId, workspacePath: targetDir });
    if (res.isError) {
      console.error(res.content[0].text);
      process.exit(1);
    }
    console.log(`✔ Successfully deleted page "${pageId}"`);
    return;
  }

  console.error(`Unknown page subcommand "${action}". Available: list, get, save, delete`);
  process.exit(1);
}

async function handleTokensCommand(subArgs) {
  const mod = await getMcpModule();
  const targetDir = subArgs[0] || process.cwd();
  const res = await mod.executeTool('screen_designer_get_design_system', { workspacePath: targetDir });
  if (res.isError) {
    console.error(res.content[0].text);
    process.exit(1);
  }
  const data = JSON.parse(res.content[0].text);
  console.log(JSON.stringify(data.designSystem, null, 2));
}

async function handleCommitCommand(subArgs) {
  const mod = await getMcpModule();
  let message = '';
  let targetDir = process.cwd();

  for (let i = 0; i < subArgs.length; i++) {
    const arg = subArgs[i];
    if (arg === '-m' || arg === '--message') {
      message = subArgs[i + 1] || '';
      i++;
    } else if (arg.startsWith('-m=')) {
      message = arg.slice(3);
    } else if (arg.startsWith('--message=')) {
      message = arg.slice(10);
    } else if (!arg.startsWith('-')) {
      targetDir = arg;
    }
  }

  if (!message) {
    console.error('❌ Error: Commit message required. Example: screen-designer commit -m "feat: add login artboard"');
    process.exit(1);
  }

  const res = await mod.executeTool('screen_designer_git_commit', {
    message,
    workspacePath: targetDir
  });

  const data = JSON.parse(res.content[0].text);
  if (!data.success) {
    console.log(`⚠️ ${data.message || 'No changes to commit'}`);
    return;
  }

  console.log(`✔ Committed [${data.commitHash.slice(0, 7)}] "${data.message}"`);
  console.log(`  Files (${data.filesCommitted.length}):`);
  for (const f of data.filesCommitted) {
    console.log(`    - ${f}`);
  }
}

function winToWslPath(winPath) {
  if (process.platform === 'win32') return winPath;
  const match = winPath.match(/^([A-Za-z]):[\\/](.*)$/);
  if (match) {
    const drive = match[1].toLowerCase();
    const rest = match[2].replace(/\\/g, '/');
    return `/mnt/${drive}/${rest}`;
  }
  return winPath;
}

function getWindowsSystemRoot() {
  if (process.platform === 'win32') {
    const sysRoot = process.env.SystemRoot || process.env.windir || 'C:\\Windows';
    const drive = process.env.SystemDrive || sysRoot.slice(0, 2);
    return { winRoot: sysRoot, wslRoot: sysRoot, systemDrive: drive };
  }

  // Under WSL: query Windows environment for SystemDrive & SystemRoot dynamically (handles OS on D:, E:, etc.)
  try {
    const out = execSync('cmd.exe /c "echo %SystemDrive%,%SystemRoot%"', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const parts = out.split(',');
    if (parts.length === 2 && parts[0].includes(':')) {
      const driveLetter = parts[0].trim().replace(':', '').toLowerCase();
      const winRoot = parts[1].trim();
      const wslRoot = `/mnt/${driveLetter}/${winRoot.slice(3).replace(/\\/g, '/')}`;
      return { winRoot, wslRoot, systemDrive: `${driveLetter.toUpperCase()}:` };
    }
  } catch {}

  // Scan all mounted drives in /mnt/ for Windows/System32
  try {
    const entries = ['c', 'd', 'e', 'f', 'g', 'h', 'w'];
    for (const d of entries) {
      const candidate = `/mnt/${d}/Windows/System32`;
      if (existsSync(candidate)) {
        return {
          winRoot: `${d.toUpperCase()}:\\Windows`,
          wslRoot: `/mnt/${d}/Windows`,
          systemDrive: `${d.toUpperCase()}:`
        };
      }
    }
  } catch {}

  return { winRoot: 'C:\\Windows', wslRoot: '/mnt/c/Windows', systemDrive: 'C:' };
}

function getWindowsTempDir() {
  if (process.platform === 'win32') {
    return process.env.TEMP || process.env.TMP || 'C:\\Windows\\Temp';
  }
  // Query dynamic %TEMP% on whatever drive Windows / User profile is located
  try {
    const out = execSync('cmd.exe /c "echo %TEMP%"', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (out && out.includes(':')) {
      return winToWslPath(out);
    }
  } catch {}

  const sys = getWindowsSystemRoot();
  return path.join(sys.wslRoot, 'Temp');
}

function ensureWinregSupport() {
  if (process.platform === 'win32') return;
  try {
    const regDir = path.join(os.tmpdir(), '.screen-designer-bin');
    const regScript = path.join(regDir, 'REG');
    if (!existsSync(regScript)) {
      mkdirSync(regDir, { recursive: true });
      const sys = getWindowsSystemRoot();
      const winRegCandidate = path.join(sys.wslRoot, 'System32', 'reg.exe');
      const winRegExe = existsSync(winRegCandidate) ? winRegCandidate : 'reg.exe';
      writeFileSync(regScript, `#!/bin/sh\nexec "${winRegExe}" "$@"\n`, { mode: 0o755 });
    }
    if (!process.env.PATH || !process.env.PATH.includes(regDir)) {
      process.env.PATH = `${regDir}:${process.env.PATH || ''}`;
    }
  } catch {}
}

function queryWinregValue(hive, key, valueName = '') {
  return new Promise((resolve) => {
    try {
      const regKey = new Registry({ hive, key });
      regKey.get(valueName, (err, item) => {
        if (err || !item || !item.value) resolve(null);
        else resolve(item.value);
      });
    } catch {
      resolve(null);
    }
  });
}

function getWinregSubkeys(hive, key) {
  return new Promise((resolve) => {
    try {
      const regKey = new Registry({ hive, key });
      regKey.keys((err, items) => {
        if (err || !items) resolve([]);
        else resolve(items);
      });
    } catch {
      resolve([]);
    }
  });
}

async function findBrowserFromWindowsRegistry() {
  ensureWinregSupport();
  const isWin = process.platform === 'win32';

  // 1. Check App Paths using 'winreg' module
  const appPathExecutables = ['chrome.exe', 'msedge.exe', 'brave.exe', 'chromium.exe', 'vivaldi.exe'];
  const hives = [Registry.HKLM, Registry.HKCU];
  const subPaths = [
    '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths',
    '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\App Paths'
  ];

  for (const exeName of appPathExecutables) {
    for (const hive of hives) {
      for (const sub of subPaths) {
        const val = await queryWinregValue(hive, `${sub}\\${exeName}`);
        if (val) {
          const rawExe = val.trim().replace(/^"|"$/g, '').trim();
          const targetPath = !isWin ? winToWslPath(rawExe) : rawExe;
          if (existsSync(targetPath)) {
            return targetPath;
          }
        }
      }
    }
  }

  // 2. Query registered Internet clients (StartMenuInternet) using 'winreg' module
  for (const hive of hives) {
    const clients = await getWinregSubkeys(hive, '\\SOFTWARE\\Clients\\StartMenuInternet');
    for (const client of clients) {
      if (client.key && !client.key.includes('IEXPLORE')) {
        const val = await queryWinregValue(hive, `${client.key}\\shell\\open\\command`);
        if (val) {
          const rawExe = val.trim().replace(/^"|"$/g, '').replace(/\s+--.*$/, '').trim();
          const targetPath = !isWin ? winToWslPath(rawExe) : rawExe;
          if (existsSync(targetPath)) {
            return targetPath;
          }
        }
      }
    }
  }

  return null;
}

async function findBrowserBinary() {
  // 1. Explicit environment variables take top priority
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  // 2. Dynamic Windows Registry lookup via 'winreg' module (Windows & WSL)
  try {
    const registryBrowser = await findBrowserFromWindowsRegistry();
    if (registryBrowser) {
      return registryBrowser;
    }
  } catch {}

  // 3. Linux/POSIX PATH lookup
  const linuxBinaries = ['google-chrome-stable', 'google-chrome', 'chromium-browser', 'chromium', 'brave-browser'];
  for (const bin of linuxBinaries) {
    try {
      const out = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf-8' }).trim();
      if (out && existsSync(out)) return out;
    } catch {}
  }

  // 4. macOS Application bundle lookup
  const macCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'
  ];
  for (const c of macCandidates) {
    if (existsSync(c)) return c;
  }

  throw new Error('Chromium/Chrome executable not found via winreg registry module or system PATH. Please ensure Google Chrome or Microsoft Edge is installed.');
}

function toWindowsPath(posixPath) {
  if (posixPath.startsWith('/mnt/')) {
    const drive = posixPath.charAt(5).toUpperCase();
    const rest = posixPath.slice(7).split('/').join('\\');
    return `${drive}:\\${rest}`;
  }
  return posixPath.replace(/\//g, '\\');
}

async function renderImage() {
  const cwd = process.cwd();
  const positional = args.slice(1).filter(a => !a.startsWith('--'));

  const pageId = positional[0];
  const artboardId = positional[1];

  let outPath = null;
  let customWidth = null;
  let customHeight = null;

  for (const a of args.slice(1)) {
    if (a.startsWith('--out=')) {
      outPath = a.split('=')[1];
    } else if (a.startsWith('--width=')) {
      customWidth = parseInt(a.split('=')[1], 10);
    } else if (a.startsWith('--height=')) {
      customHeight = parseInt(a.split('=')[1], 10);
    }
  }

  if (!pageId) {
    console.error('❌ Error: Missing page ID.');
    console.error('Usage: npx screen-designer render-image <pageId> [artboardId] [--out=<path>]');
    process.exit(1);
  }

  // 1. Resolve pageDocsPath from config.json
  let pageDocsPath = 'docs/ui-boards';
  try {
    const raw = await fs.readFile(path.join(cwd, '.screen-designer', 'config.json'), 'utf-8');
    const cfg = JSON.parse(raw);
    if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
  } catch {}

  const fullDocsDir = path.resolve(cwd, pageDocsPath);

  // 2. Find target page JSON file
  let pageFileName = pageId.endsWith('.json') ? pageId : `${pageId}.json`;
  let fullPagePath = path.join(fullDocsDir, pageFileName);

  try {
    await fs.access(fullPagePath);
  } catch {
    const files = await fs.readdir(fullDocsDir);
    const matched = files.find(f => f.includes(pageId) && f.endsWith('.json'));
    if (!matched) {
      console.error(`❌ Page document not found for "${pageId}" in ${pageDocsPath}/`);
      console.error(`Available pages: ${files.join(', ')}`);
      process.exit(1);
    }
    fullPagePath = path.join(fullDocsDir, matched);
  }

  const pageRaw = await fs.readFile(fullPagePath, 'utf-8');
  const pageDoc = JSON.parse(pageRaw);

  const artboards = pageDoc.artboards || [];
  if (artboards.length === 0) {
    console.error(`❌ Page "${pageDoc.name || pageDoc.id}" does not have any artboards.`);
    process.exit(1);
  }

  // 3. Select target artboard
  let artboard = artboards[0];
  if (artboardId !== undefined && artboardId !== '') {
    const query = artboardId.trim();
    const isIndex = /^\d+$/.test(query);
    if (isIndex) {
      const idx = parseInt(query, 10);
      if (idx >= 0 && idx < artboards.length) {
        artboard = artboards[idx];
      }
    }
    if (!artboard || (isIndex && !artboards[parseInt(query, 10)])) {
      artboard = artboards.find(a => a.id === query || a.title === query || (a.title && a.title.includes(query))) || artboards[0];
    }
  }

  const width = customWidth || artboard.width || 375;
  const height = customHeight || artboard.height || 812;
  const artboardTitle = artboard.title || 'Screen';
  const safeTitle = artboardTitle.replace(/[^a-zA-Z0-9가-힣_-]/g, '_');

  console.log(`[Screen Designer] Rendering Artboard to Image...`);
  console.log(`  📄 Page:     ${pageDoc.name || pageDoc.id} (${pageDoc.id})`);
  console.log(`  🖼️  Artboard: ${artboardTitle} (${artboard.id})`);
  console.log(`  📐 Viewport: ${width} x ${height} px`);

  // 4. Generate HTML content
  const contentHtml = artboard.rootNode
    ? vnodeToHtml(artboard.rootNode, 4)
    : (artboard.code || '<div class="text-white p-8">No Content</div>');

  const htmlDoc = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artboardTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Pretendard", sans-serif;
    }
    html, body {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #0f172a;
    }
    #screen-viewport {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="screen-viewport">
${contentHtml}
  </div>
</body>
</html>`;

  // 5. Setup Temporary Directory for Browser
  const browserBin = await findBrowserBinary();
  const isWslWithWinBrowser = browserBin.startsWith('/mnt/') || browserBin.endsWith('.exe');

  let tempDir = path.join(os.tmpdir(), 'screen-designer-render');
  if (isWslWithWinBrowser) {
    const winTemp = getWindowsTempDir();
    tempDir = path.join(winTemp, '.screen-designer-tmp');
  }
  await fs.mkdir(tempDir, { recursive: true });

  const tempHtmlFile = path.join(tempDir, `render_${Date.now()}.html`);
  const tempPngFile = path.join(tempDir, `render_${Date.now()}.png`);
  await fs.writeFile(tempHtmlFile, htmlDoc, 'utf-8');

  // 6. Execute Chrome Headless
  let chromeHtmlUrl = `file://${tempHtmlFile}`;
  let chromeScreenshotArg = tempPngFile;

  if (isWslWithWinBrowser) {
    chromeHtmlUrl = `file:///${toWindowsPath(tempHtmlFile).replace(/\\/g, '/')}`;
    chromeScreenshotArg = toWindowsPath(tempPngFile);
  }

  const chromeCmd = `"${browserBin}" --headless --disable-gpu --virtual-time-budget=1500 --hide-scrollbars --window-size=${width},${height} --screenshot="${chromeScreenshotArg}" "${chromeHtmlUrl}"`;
  execSync(chromeCmd, { stdio: ['ignore', 'pipe', 'pipe'] });

  // 7. Target Destination File
  let finalOut = outPath;
  if (!finalOut) {
    finalOut = path.join(cwd, 'exports', 'images', `${pageDoc.id}_${safeTitle}.png`);
  } else if (!path.isAbsolute(finalOut)) {
    finalOut = path.resolve(cwd, finalOut);
  }

  await fs.mkdir(path.dirname(finalOut), { recursive: true });
  await fs.copyFile(tempPngFile, finalOut);

  const stats = await fs.stat(finalOut);

  // Cleanup temporary files
  try {
    await fs.unlink(tempHtmlFile);
    await fs.unlink(tempPngFile);
  } catch {}

  console.log(`\n🎉 Image successfully rendered!`);
  console.log(`  💾 Output:   ${path.relative(cwd, finalOut)} (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log(`  🌐 Absolute: ${finalOut}`);
}

function openBrowser(url) {
  const platform = process.platform;
  try {
    if (platform === 'win32') {
      execSync(`start "" "${url}"`);
    } else if (platform === 'darwin') {
      execSync(`open "${url}"`);
    } else {
      let isWsl = false;
      try {
        if (existsSync('/proc/version')) {
          const v = readFileSync('/proc/version', 'utf8').toLowerCase();
          if (v.includes('microsoft')) isWsl = true;
        }
      } catch {}

      if (isWsl) {
        execSync(`cmd.exe /c start "${url}" 2>/dev/null || xdg-open "${url}"`);
      } else {
        execSync(`xdg-open "${url}" 2>/dev/null`);
      }
    }
  } catch {
    console.log(`\n  👉 브라우저를 열어 다음 주소로 접속하세요: ${url}\n`);
  }
}

async function launch(targetDir = '.', opts = {}) {
  const resolvedTarget = path.resolve(process.cwd(), targetDir);
  console.log(`\n🚀 [Screen Designer] Starting workspace: ${resolvedTarget}`);

  if (!existsSync(resolvedTarget)) {
    await fs.mkdir(resolvedTarget, { recursive: true });
  }

  const docsDir = path.join(resolvedTarget, 'docs', 'ui-boards');
  const projectJson = path.join(docsDir, 'project.json');
  if (!existsSync(projectJson)) {
    console.log('  ✨ No storyboard found in target directory. Auto-initializing docs/ui-boards/...');
    await init(resolvedTarget);
  }

  let appDir = path.resolve(__dirname, '../../app');
  if (!existsSync(path.join(appDir, 'package.json'))) {
    appDir = path.resolve(__dirname, '..');
  }

  const isHeadlessLinux = process.platform === 'linux' && !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY;
  const forceWeb = opts.web || isHeadlessLinux;
  const port = opts.port || 5173;

  process.env.SCREEN_DESIGNER_WORKSPACE = resolvedTarget;

  if (!forceWeb && (process.platform === 'win32' || process.platform === 'darwin' || process.env.DISPLAY || process.env.WAYLAND_DISPLAY)) {
    console.log('  🖥️  Launching Electron Desktop App...');
    try {
      execSync('npx electron .', {
        cwd: appDir,
        stdio: 'inherit',
        env: {
          ...process.env,
          SCREEN_DESIGNER_WORKSPACE: resolvedTarget
        }
      });
      return;
    } catch (err) {
      console.warn('  ⚠️ Electron desktop launch failed or exited, falling back to Web browser mode...');
    }
  }

  console.log(`  🌐 Starting Screen Designer Web Server on port ${port}...`);
  console.log(`  📁 Target Workspace: ${resolvedTarget}`);

  const viteProc = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', String(port)], {
    cwd: appDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      SCREEN_DESIGNER_WORKSPACE: resolvedTarget,
      NO_ELECTRON: 'true'
    }
  });

  const url = `http://localhost:${port}`;
  if (!opts.noOpen) {
    setTimeout(() => {
      openBrowser(url);
    }, 1500);
  }

  process.on('SIGINT', () => {
    viteProc.kill();
    process.exit(0);
  });
}

function help() {
  console.log(`
Screen Designer CLI
Usage:
  screen-designer [target-path] [options]                       Open Screen Designer on target project (default: .)
  screen-designer init [target-path]                            Initialize .screen-designer & docs/ui-boards
  screen-designer status [target-path]                          Check git status of UI design documents
  screen-designer export [pageId] [options]                     Generate code on-demand from VDOM JSON
  screen-designer render-image <pageId> [artboard] [opts]       Render specific artboard (시안) to an image
  screen-designer tokens [target-path]                          Inspect design system tokens and colors
  screen-designer commit -m "<message>" [target-path]           Commit modified design documents via es-git

Screen Pages (VDOM) Operations:
  screen-designer page list [target-path]                       List all screen pages in project
  screen-designer page show <pageId> [target-path]              Display full JSON of a screen page
  screen-designer page save <pageFile.json> [target-path]       Save/import a page from JSON file
  screen-designer page delete <pageId> [target-path]            Delete a screen page from project

MCP Server & Cross-Agent Operations:
  screen-designer mcp [serve]                                   Start MCP Server on Stdio (for Claude/Cursor/Codex)
  screen-designer mcp list                                      List all 13 registered MCP tools & parameters
  screen-designer mcp call <tool-name> [args...]                Execute any MCP tool directly from CLI

Launch Options:
  --web, -w                 Run in Web Browser mode instead of Electron Desktop
  --port=<num>, -p=<num>    Custom port for Web server (default: 5173)
  --no-open                 Do not automatically open the default web browser
  --init, -i                Scaffold docs/ui-boards structure without launching GUI

Export Options:
  --format=react|vue|html   Output language format (default: react)
  --out=<directory>         Target destination folder (default: src/components)

Render Image Options:
  --out=<filepath>          Target PNG image file path (default: exports/images/<page>_<title>.png)
  --width=<pixels>          Custom viewport width (e.g. 375)
  --height=<pixels>         Custom viewport height (e.g. 812)

Examples:
  screen-designer .                                  # Open Screen Designer for current directory
  screen-designer mcp list                           # View all 13 MCP tools with parameters
  screen-designer mcp call screen_designer_list_pages
  screen-designer mcp call screen_designer_render_artboard_image --pageId=1 --outPath=test.png
  screen-designer page list
  screen-designer page show 1
  screen-designer commit -m "feat: design completed"
  screen-designer export --format=react              # Generate React code
  screen-designer render-image 1                     # Render page 1 to PNG image
`);
}

// Parse arguments and route
const args = process.argv.slice(2);
const firstArg = args[0];

const isWeb = args.includes('--web') || args.includes('-w');
const isNoOpen = args.includes('--no-open');
const isInitOnly = args.includes('--init') || args.includes('-i');
const portArg = args.find(a => a.startsWith('--port=') || a.startsWith('-p='));
const port = portArg ? parseInt(portArg.split('=')[1], 10) : 5173;

const SUB_COMMANDS = [
  'init', 'export', 'status', 'render-image', 'render', 'screenshot', 'image',
  'mcp', 'page', 'tokens', 'commit',
  'help', '--help', '-h', 'version', '--version', '-v'
];

if (!firstArg || (!firstArg.startsWith('-') && !SUB_COMMANDS.includes(firstArg)) || firstArg.startsWith('--web') || firstArg.startsWith('--port') || firstArg.startsWith('--no-open') || firstArg.startsWith('--init') || firstArg.startsWith('-w') || firstArg.startsWith('-p') || firstArg.startsWith('-i')) {
  const targetDir = (!firstArg || firstArg.startsWith('-')) ? '.' : firstArg;
  if (isInitOnly) {
    init(targetDir).catch(console.error);
  } else {
    launch(targetDir, { web: isWeb, port, noOpen: isNoOpen }).catch(console.error);
  }
} else {
  switch (firstArg) {
    case 'init':
      init(args[1] || '.').catch(console.error);
      break;
    case 'export':
      exportCode().catch(console.error);
      break;
    case 'status':
      status().catch(console.error);
      break;
    case 'render-image':
    case 'render':
    case 'screenshot':
    case 'image':
      renderImage().catch(console.error);
      break;
    case 'mcp':
      handleMcpCommand(args.slice(1)).catch(console.error);
      break;
    case 'page':
      handlePageCommand(args.slice(1)).catch(console.error);
      break;
    case 'tokens':
      handleTokensCommand(args.slice(1)).catch(console.error);
      break;
    case 'commit':
      handleCommitCommand(args.slice(1)).catch(console.error);
      break;
    case 'version':
    case '--version':
    case '-v':
      console.log('Screen Designer v0.1.0');
      break;
    case 'help':
    case '--help':
    case '-h':
    default:
      help();
      break;
  }
}
