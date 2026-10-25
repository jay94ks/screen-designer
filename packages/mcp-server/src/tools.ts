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

// --- Common Helper Functions for Page & Artboard Management ---

async function resolvePageDocs(ws: string) {
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

  return { pageDocsPath, fullDocsDir, pagesDir, cacheDir };
}

async function findPageDoc(fullDocsDir: string, pageId: string): Promise<{ fullPath: string; page: any } | null> {
  const cleanId = String(pageId).replace(/\.json$/, '');
  const isPrefixed = cleanId.startsWith('page-');
  const numericOrStripped = isPrefixed ? cleanId.slice(5) : cleanId;

  const candidates = [
    path.join(fullDocsDir, 'pages', `${cleanId}.json`),
    path.join(fullDocsDir, 'pages', `${numericOrStripped}.json`),
    path.join(fullDocsDir, 'pages', `page-${numericOrStripped}.json`),
    path.join(fullDocsDir, `${cleanId}.json`),
    path.join(fullDocsDir, `${numericOrStripped}.json`),
    path.join(fullDocsDir, `page-${numericOrStripped}.json`)
  ];

  for (const p of candidates) {
    try {
      const raw = await fs.readFile(p, 'utf-8');
      const doc = JSON.parse(raw);
      doc.file = path.relative(fullDocsDir, p).replace(/\\/g, '/');
      return { fullPath: p, page: doc };
    } catch {}
  }

  const pagesDir = path.join(fullDocsDir, 'pages');
  try {
    const files = await fs.readdir(pagesDir);
    for (const f of files.filter(f => f.endsWith('.json'))) {
      const p = path.join(pagesDir, f);
      try {
        const raw = await fs.readFile(p, 'utf-8');
        const doc = JSON.parse(raw);
        if (
          String(doc.id) === cleanId ||
          String(doc.id) === numericOrStripped ||
          String(doc.number) === numericOrStripped ||
          String(doc.name) === cleanId
        ) {
          doc.file = path.relative(fullDocsDir, p).replace(/\\/g, '/');
          return { fullPath: p, page: doc };
        }
      } catch {}
    }
  } catch {}

  return null;
}

async function persistPageDoc(ws: string, fullDocsDir: string, pagesDir: string, cacheDir: string, pageDoc: any, targetFilePath?: string): Promise<string> {
  let pagePath = targetFilePath;
  if (!pagePath) {
    if (pageDoc.file) {
      pagePath = path.resolve(fullDocsDir, pageDoc.file);
    } else if (pageDoc.fileName) {
      pagePath = path.resolve(fullDocsDir, pageDoc.fileName);
    } else {
      pagePath = path.join(pagesDir, `${pageDoc.id}.json`);
    }
  }
  pageDoc.updatedAt = new Date().toISOString();
  await fs.writeFile(pagePath, JSON.stringify(pageDoc, null, 2), 'utf-8');

  const relativeFile = path.relative(fullDocsDir, pagePath).replace(/\\/g, '/');

  // Update project.json
  const projectPath = path.join(fullDocsDir, 'project.json');
  try {
    let project: any = { name: 'Screen Designer Project', pages: [] };
    try {
      project = JSON.parse(await fs.readFile(projectPath, 'utf-8'));
    } catch {}
    project.pages = project.pages || [];
    const existingIdx = project.pages.findIndex((p: any) =>
      String(p.id) === String(pageDoc.id) ||
      p.file === relativeFile ||
      p.fileName === relativeFile ||
      p.file === `pages/${pageDoc.id}.json` ||
      p.fileName === `pages/${pageDoc.id}.json`
    );
    const pageEntry = { id: pageDoc.id, name: pageDoc.name, file: relativeFile, updatedAt: pageDoc.updatedAt };
    if (existingIdx !== -1) {
      project.pages[existingIdx] = { ...project.pages[existingIdx], ...pageEntry };
    } else {
      project.pages.push(pageEntry);
    }
    await fs.writeFile(projectPath, JSON.stringify(project, null, 2), 'utf-8');
  } catch {}

  // Update manifest cache
  const manifestPath = path.join(cacheDir, 'manifest.json');
  try {
    let manifest: any = { pages: {}, lastUpdated: pageDoc.updatedAt };
    try {
      manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    } catch {}
    manifest.pages = manifest.pages || {};
    manifest.pages[pageDoc.id] = {
      name: pageDoc.name,
      file: relativeFile,
      artboardCount: (pageDoc.artboards || []).length,
      updatedAt: pageDoc.updatedAt
    };
    manifest.lastUpdated = pageDoc.updatedAt;
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  } catch {}

  return pagePath;
}

function buildTemplateArtboard(title: string, viewport: 'mobile' | 'tablet' | 'desktop' | 'custom' = 'mobile', template?: string, customWidth?: number, customHeight?: number): any {
  const ts = Date.now();
  const width = customWidth || (viewport === 'desktop' ? 1280 : viewport === 'tablet' ? 768 : 375);
  const height = customHeight || (viewport === 'desktop' ? 800 : viewport === 'tablet' ? 1024 : 812);

  let rootNode: any;

  if (template === 'login') {
    rootNode = {
      id: `node-${ts}-root`,
      type: 'frame',
      name: '로그인 화면 루트',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: 20
      },
      children: [
        {
          id: `node-header-${ts}`,
          type: 'box',
          name: '헤더 영역',
          style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 8 },
          children: [
            {
              id: `node-logo-${ts}`,
              type: 'circle',
              name: '로고 심볼',
              content: '',
              style: { width: 56, height: 56, backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }
            },
            {
              id: `node-title-${ts}`,
              type: 'heading',
              name: '로그인 타이틀',
              content: '환영합니다',
              style: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' }
            },
            {
              id: `node-sub-${ts}`,
              type: 'text',
              name: '서브텍스트',
              content: '계정에 로그인하여 서비스를 이용하세요.',
              style: { fontSize: 13, color: '#64748b' }
            }
          ]
        },
        {
          id: `node-form-${ts}`,
          type: 'form',
          name: '로그인 폼',
          style: { display: 'flex', flexDirection: 'column', gap: 12 },
          children: [
            {
              id: `node-email-${ts}`,
              type: 'input',
              name: '이메일 입력창',
              content: '',
              props: { type: 'email', placeholder: 'name@example.com' },
              style: { width: '100%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff', fontSize: 13 }
            },
            {
              id: `node-pwd-${ts}`,
              type: 'input',
              name: '비밀번호 입력창',
              content: '',
              props: { type: 'password', placeholder: '비밀번호를 입력하세요' },
              style: { width: '100%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff', fontSize: 13 }
            },
            {
              id: `node-btn-${ts}`,
              type: 'button',
              name: '로그인 버튼',
              content: '로그인',
              style: { width: '100%', padding: 12, borderRadius: 10, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' }
            }
          ]
        },
        {
          id: `node-footer-${ts}`,
          type: 'text',
          name: '하단 링크',
          content: '비밀번호 찾기 | 회원가입',
          style: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 12 }
        }
      ]
    };
  } else if (template === 'dashboard') {
    rootNode = {
      id: `node-${ts}-root`,
      type: 'frame',
      name: '대시보드 루트',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: '#ffffff'
      },
      children: [
        {
          id: `node-title-${ts}`,
          type: 'heading',
          name: '대시보드 타이틀',
          content: '대시보드 요약',
          style: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc' }
        },
        {
          id: `node-kpis-${ts}`,
          type: 'box',
          name: 'KPI 카드 행',
          style: { display: 'flex', flexDirection: 'row', gap: 12, width: '100%' },
          children: [
            {
              id: `node-card1-${ts}`,
              type: 'card',
              name: '수익 카드',
              style: { flex: 1, backgroundColor: '#1e293b', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
              children: [
                { id: `node-c1-t-${ts}`, type: 'text', name: '라벨', content: '총 매출', style: { fontSize: 11, color: '#94a3b8' } },
                { id: `node-c1-v-${ts}`, type: 'text', name: '금액', content: '₩24,500,000', style: { fontSize: 16, fontWeight: 'bold', color: '#38bdf8', marginTop: 4 } }
              ]
            },
            {
              id: `node-card2-${ts}`,
              type: 'card',
              name: '사용자 카드',
              style: { flex: 1, backgroundColor: '#1e293b', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
              children: [
                { id: `node-c2-t-${ts}`, type: 'text', name: '라벨', content: '신규 가입', style: { fontSize: 11, color: '#94a3b8' } },
                { id: `node-c2-v-${ts}`, type: 'text', name: '수치', content: '+1,280명', style: { fontSize: 16, fontWeight: 'bold', color: '#4ade80', marginTop: 4 } }
              ]
            }
          ]
        },
        {
          id: `node-chart-${ts}`,
          type: 'card',
          name: '차트 영역',
          style: { flex: 1, backgroundColor: '#1e293b', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
          children: [
            { id: `node-chart-lbl-${ts}`, type: 'text', name: '플레이스홀더', content: '📊 실시간 통계 차트 영역', style: { fontSize: 13, color: '#64748b' } }
          ]
        }
      ]
    };
  } else if (template === 'hero') {
    rootNode = {
      id: `node-${ts}-root`,
      type: 'frame',
      name: '히어로 섹션 루트',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16
      },
      children: [
        {
          id: `node-badge-${ts}`,
          type: 'badge',
          name: '알림 배지',
          content: '🚀 신규 버전 v2.0 릴리즈',
          style: { fontSize: 11, fontWeight: 600, color: '#4f46e5', backgroundColor: '#eef2ff', padding: 6, borderRadius: 999 }
        },
        {
          id: `node-headline-${ts}`,
          type: 'heading',
          name: '메인 헤드라인',
          content: '최고의 화면 디자인을\n단 몇 분 만에 완성하세요',
          style: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', lineHeight: 1.3 }
        },
        {
          id: `node-desc-${ts}`,
          type: 'text',
          name: '보조 설명',
          content: '개발자와 디자이너가 실시간으로 소통하는 인터랙티브 가상 DOM 프로토타이핑 도구',
          style: { fontSize: 13, color: '#64748b', lineHeight: 1.5 }
        },
        {
          id: `node-btn-${ts}`,
          type: 'button',
          name: 'CTA 버튼',
          content: '무료로 시작하기',
          style: { padding: 12, borderRadius: 10, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
        }
      ]
    };
  } else {
    // Blank
    rootNode = {
      id: `node-${ts}-root`,
      type: 'frame',
      name: 'Frame Root',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
      },
      children: [
        {
          id: `node-title-${ts}`,
          type: 'text',
          name: 'Title Text',
          content: title,
          style: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' }
        },
        {
          id: `node-desc-${ts}`,
          type: 'text',
          name: 'Subtitle Text',
          content: '새로 생성된 가상 DOM 캔버스',
          style: { fontSize: 12, color: '#64748b' }
        }
      ]
    };
  }

  return {
    id: `artboard-${ts}`,
    title,
    viewport,
    x: 0,
    y: 0,
    width,
    height,
    rootNode,
    tweaksSchema: [],
    tweakValues: {}
  };
}

function updateVNodesRecursively(root: any, updates: Array<{ nodeId: string; name?: string; content?: string; style?: any; className?: string; props?: any }>): number {
  let count = 0;
  const updateMap = new Map<string, any>();
  for (const u of updates) {
    updateMap.set(u.nodeId, u);
  }

  function traverse(node: any) {
    if (!node) return;
    if (updateMap.has(node.id)) {
      const u = updateMap.get(node.id);
      if (u.name !== undefined) node.name = u.name;
      if (u.content !== undefined) node.content = u.content;
      if (u.className !== undefined) node.className = u.className;
      if (u.style) {
        node.style = { ...(node.style || {}), ...u.style };
      }
      if (u.props) {
        node.props = { ...(node.props || {}), ...u.props };
      }
      count++;
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return count;
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
      const found = await findPageDoc(fullDocsDir, pageId);
      if (found) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ status: 'ok', file: path.relative(ws, found.fullPath), page: found.page }, null, 2)
            }
          ]
        };
      }

      return {
        isError: true,
        content: [{ type: 'text', text: `Page "${pageId}" not found in ${fullDocsDir}` }]
      };
    }
  },

  // 4. Page: screen_designer_create_page
  {
    name: 'screen_designer_create_page',
    aliases: ['create_page', 'page_create'],
    category: 'page',
    description: 'Create a new screen page document in the project with an ID, title/name, and optional initial artboard or template.',
    parameters: z.object({
      name: z.string().describe('Display name or title of the new page (e.g. "온보딩 화면", "마이페이지")'),
      pageId: z.string().optional().describe('Unique page ID (e.g. "onboarding" or "page-2"). Auto-generated if omitted.'),
      initialArtboardTitle: z.string().optional().describe('Title of an initial artboard to create in this page'),
      viewport: z.enum(['mobile', 'tablet', 'desktop', 'custom']).optional().default('mobile').describe('Viewport device type for initial artboard'),
      template: z.enum(['blank', 'login', 'dashboard', 'hero']).optional().default('blank').describe('Template preset for initial artboard'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ name, pageId, initialArtboardTitle, viewport, template, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();
      const { fullDocsDir, pagesDir, cacheDir } = await resolvePageDocs(ws);

      const actualPageId = pageId ? String(pageId).replace(/\.json$/, '') : `page-${Date.now()}`;
      const artboards: any[] = [];

      if (initialArtboardTitle || (template && template !== 'blank')) {
        const board = buildTemplateArtboard(initialArtboardTitle || name, viewport || 'mobile', template || 'blank');
        artboards.push(board);
      }

      const pageDoc = {
        id: actualPageId,
        name,
        artboards,
        version: '1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const savedPath = await persistPageDoc(ws, fullDocsDir, pagesDir, cacheDir, pageDoc);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              message: `Page "${name}" successfully created`,
              pageId: actualPageId,
              file: path.relative(ws, savedPath),
              artboardCount: artboards.length,
              artboards: artboards.map(a => ({ id: a.id, title: a.title, viewport: a.viewport, width: a.width, height: a.height }))
            }, null, 2)
          }
        ]
      };
    }
  },

  // 5. Page: screen_designer_save_page
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

  // 7. Artboard: screen_designer_add_artboard
  {
    name: 'screen_designer_add_artboard',
    aliases: ['add_artboard', 'create_artboard', 'artboard_create'],
    category: 'page',
    description: 'Add a new artboard (screen canvas) to a page with title, dimensions, viewport, and optional template or custom VDOM rootNode.',
    parameters: z.object({
      pageId: z.string().optional().describe('Target page ID to add the artboard to. If omitted, adds to the first available page.'),
      title: z.string().describe('Title of the new artboard (e.g. "로그인 화면", "회원가입", "결제 완료")'),
      viewport: z.enum(['mobile', 'tablet', 'desktop', 'custom']).optional().default('mobile').describe('Device viewport type'),
      width: z.number().optional().describe('Canvas width in pixels (defaults: mobile=375, tablet=768, desktop=1280)'),
      height: z.number().optional().describe('Canvas height in pixels (defaults: mobile=812, tablet=1024, desktop=800)'),
      template: z.enum(['blank', 'login', 'dashboard', 'hero']).optional().describe('Prebuilt template for rootNode'),
      rootNode: z.any().optional().describe('Custom Virtual DOM root VNode (overrides template if provided)'),
      tweaksSchema: z.array(z.any()).optional().describe('Optional dynamic tweaks schema definitions'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, title, viewport, width, height, template, rootNode, tweaksSchema, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();
      const { fullDocsDir, pagesDir, cacheDir } = await resolvePageDocs(ws);

      let targetPageId = pageId;
      if (!targetPageId) {
        try {
          const files = await fs.readdir(pagesDir);
          const first = files.find(f => f.endsWith('.json'));
          if (first) targetPageId = path.basename(first, '.json');
        } catch {}
      }
      if (!targetPageId) targetPageId = '1';

      const found = await findPageDoc(fullDocsDir, targetPageId);
      let pageDoc: any;
      if (!found) {
        pageDoc = {
          id: targetPageId,
          name: `Page ${targetPageId}`,
          artboards: [],
          version: '1.0'
        };
      } else {
        pageDoc = found.page;
      }

      pageDoc.artboards = pageDoc.artboards || [];

      const newBoard = buildTemplateArtboard(title, viewport || 'mobile', template || 'blank', width, height);
      if (rootNode) {
        newBoard.rootNode = rootNode;
      }
      if (tweaksSchema) {
        newBoard.tweaksSchema = tweaksSchema;
      }

      pageDoc.artboards.push(newBoard);
      const savedPath = await persistPageDoc(ws, fullDocsDir, pagesDir, cacheDir, pageDoc, found?.fullPath);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              message: `Artboard "${title}" successfully added to page "${pageDoc.name || pageDoc.id}"`,
              pageId: pageDoc.id,
              artboard: {
                id: newBoard.id,
                title: newBoard.title,
                viewport: newBoard.viewport,
                width: newBoard.width,
                height: newBoard.height
              },
              file: path.relative(ws, savedPath),
              totalArtboardsInPage: pageDoc.artboards.length
            }, null, 2)
          }
        ]
      };
    }
  },

  // 8. Artboard: screen_designer_update_artboard
  {
    name: 'screen_designer_update_artboard',
    aliases: ['update_artboard', 'edit_artboard', 'artboard_update', 'artboard_edit'],
    category: 'page',
    description: 'Update and modify an existing artboard on a page. Supports editing metadata (title, dimensions, viewport), replacing rootNode, or targeting specific nodes by ID to update text/styles/props without rewriting the whole tree.',
    parameters: z.object({
      pageId: z.string().describe('Target page ID containing the artboard'),
      artboardId: z.string().describe('Target artboard ID or title to modify'),
      title: z.string().optional().describe('New title for the artboard'),
      viewport: z.enum(['mobile', 'tablet', 'desktop', 'custom']).optional().describe('Updated viewport device type'),
      width: z.number().optional().describe('Updated width in pixels'),
      height: z.number().optional().describe('Updated height in pixels'),
      x: z.number().optional().describe('Canvas X position'),
      y: z.number().optional().describe('Canvas Y position'),
      rootNode: z.any().optional().describe('Complete replacement Virtual DOM rootNode'),
      nodeUpdates: z.array(z.object({
        nodeId: z.string().describe('ID of the VNode to update inside the artboard'),
        name: z.string().optional(),
        content: z.string().optional().describe('Updated text or content'),
        style: z.record(z.any()).optional().describe('Style updates (e.g. { backgroundColor: "#10b981", color: "#fff" })'),
        className: z.string().optional().describe('Tailwind CSS classes'),
        props: z.record(z.any()).optional().describe('HTML/component props')
      })).optional().describe('Targeted updates to specific VNodes inside this artboard by nodeId'),
      tweaksSchema: z.array(z.any()).optional().describe('Updated dynamic tweaks schema'),
      tweakValues: z.record(z.any()).optional().describe('Updated tweak values'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, artboardId, title, viewport, width, height, x, y, rootNode, nodeUpdates, tweaksSchema, tweakValues, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();
      const { fullDocsDir, pagesDir, cacheDir } = await resolvePageDocs(ws);

      const found = await findPageDoc(fullDocsDir, pageId);
      if (!found) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Page "${pageId}" not found in ${fullDocsDir}` }]
        };
      }

      const pageDoc = found.page;
      const artboards: any[] = pageDoc.artboards || [];
      const boardIndex = artboards.findIndex((a: any) =>
        String(a.id) === String(artboardId) ||
        String(a.title).toLowerCase() === String(artboardId).toLowerCase()
      );

      if (boardIndex === -1) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Artboard "${artboardId}" not found in page "${pageDoc.name || pageId}". Available artboards: ${artboards.map(a => `"${a.title}" (${a.id})`).join(', ')}`
          }]
        };
      }

      const board = artboards[boardIndex];
      const updatedFields: string[] = [];

      if (title !== undefined) { board.title = title; updatedFields.push('title'); }
      if (viewport !== undefined) { board.viewport = viewport; updatedFields.push('viewport'); }
      if (width !== undefined) { board.width = width; updatedFields.push('width'); }
      if (height !== undefined) { board.height = height; updatedFields.push('height'); }
      if (x !== undefined) { board.x = x; updatedFields.push('x'); }
      if (y !== undefined) { board.y = y; updatedFields.push('y'); }
      if (tweaksSchema !== undefined) { board.tweaksSchema = tweaksSchema; updatedFields.push('tweaksSchema'); }
      if (tweakValues !== undefined) { board.tweakValues = { ...(board.tweakValues || {}), ...tweakValues }; updatedFields.push('tweakValues'); }

      if (rootNode !== undefined) {
        board.rootNode = rootNode;
        updatedFields.push('rootNode');
      } else if (nodeUpdates && nodeUpdates.length > 0 && board.rootNode) {
        const updatedCount = updateVNodesRecursively(board.rootNode, nodeUpdates);
        updatedFields.push(`nodeUpdates (${updatedCount} nodes modified)`);
      }

      artboards[boardIndex] = board;
      pageDoc.artboards = artboards;

      const savedPath = await persistPageDoc(ws, fullDocsDir, pagesDir, cacheDir, pageDoc);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              message: `Artboard "${board.title}" (${board.id}) in page "${pageDoc.name || pageId}" successfully updated`,
              pageId: pageDoc.id,
              artboardId: board.id,
              updatedFields,
              file: path.relative(ws, savedPath),
              artboard: {
                id: board.id,
                title: board.title,
                viewport: board.viewport,
                width: board.width,
                height: board.height
              }
            }, null, 2)
          }
        ]
      };
    }
  },

  // 9. Artboard: screen_designer_delete_artboard
  {
    name: 'screen_designer_delete_artboard',
    aliases: ['delete_artboard', 'remove_artboard', 'artboard_delete'],
    category: 'page',
    description: 'Delete an artboard (screen canvas) from a page by artboard ID or title.',
    parameters: z.object({
      pageId: z.string().describe('Target page ID containing the artboard'),
      artboardId: z.string().describe('ID or title of the artboard to delete'),
      workspacePath: z.string().optional().describe('Project workspace directory')
    }),
    execute: async ({ pageId, artboardId, workspacePath }, bridge) => {
      const state = bridge.getState();
      const ws = workspacePath || state.workspacePath || process.cwd();
      const { fullDocsDir, pagesDir, cacheDir } = await resolvePageDocs(ws);

      const found = await findPageDoc(fullDocsDir, pageId);
      if (!found) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Page "${pageId}" not found in ${fullDocsDir}` }]
        };
      }

      const pageDoc = found.page;
      const artboards: any[] = pageDoc.artboards || [];
      const initialCount = artboards.length;

      pageDoc.artboards = artboards.filter((a: any) =>
        String(a.id) !== String(artboardId) &&
        String(a.title).toLowerCase() !== String(artboardId).toLowerCase()
      );

      if (pageDoc.artboards.length === initialCount) {
        return {
          isError: true,
          content: [{
            type: 'text',
            text: `Artboard "${artboardId}" not found in page "${pageDoc.name || pageId}". Available artboards: ${artboards.map(a => `"${a.title}" (${a.id})`).join(', ')}`
          }]
        };
      }

      const savedPath = await persistPageDoc(ws, fullDocsDir, pagesDir, cacheDir, pageDoc);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'ok',
              message: `Artboard "${artboardId}" successfully deleted from page "${pageDoc.name || pageId}"`,
              pageId: pageDoc.id,
              deletedArtboardId: artboardId,
              remainingArtboardCount: pageDoc.artboards.length,
              file: path.relative(ws, savedPath)
            }, null, 2)
          }
        ]
      };
    }
  },

  // 10. Design System: screen_designer_get_design_system
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
