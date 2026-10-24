import { promises as fs, existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import Registry from 'winreg';

export interface RenderArtboardOptions {
  pageId: string;
  artboardId?: string; // ID, title, or 0-based index
  outPath?: string;
  width?: number;
  height?: number;
  workspacePath?: string;
}

export interface RenderArtboardResult {
  outPath: string;
  artboardTitle: string;
  artboardId: string;
  pageId: string;
  pageName: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  base64Png: string;
}

function getHtmlTag(type: string, props?: any): string {
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

function normalizeStyle(style: any = {}): any {
  const norm = { ...style };
  if (norm.backgroundImage && !norm.backgroundImage.startsWith('url(') && !norm.backgroundImage.startsWith('linear-gradient(') && !norm.backgroundImage.startsWith('radial-gradient(')) {
    norm.backgroundImage = `url("${norm.backgroundImage}")`;
  }
  const filterParts: string[] = [];
  if (norm.brightness !== undefined) filterParts.push(`brightness(${norm.brightness}%)`);
  if (norm.contrast !== undefined) filterParts.push(`contrast(${norm.contrast}%)`);
  if (norm.grayscale !== undefined) filterParts.push(`grayscale(${norm.grayscale}%)`);
  if (norm.blur !== undefined && norm.blur !== 0) filterParts.push(`blur(${typeof norm.blur === 'number' ? `${norm.blur}px` : norm.blur})`);
  if (filterParts.length > 0 && !norm.filter) {
    norm.filter = filterParts.join(' ');
  }
  return norm;
}

function isNodeVisibleByCondition(node: any, tweakValues: Record<string, any> = {}): boolean {
  if (node.visible === false) return false;
  const cond = node.condition;
  if (!cond || !cond.enabled || !cond.rules || cond.rules.length === 0) return true;

  const matchType = cond.matchType || 'and';
  let passedCount = 0;

  for (const rule of cond.rules) {
    const actual = tweakValues[rule.tweakId];
    let passed = false;
    if (rule.operator === 'always') passed = true;
    else if (rule.operator === 'equals') passed = String(actual) === String(rule.values?.[0]);
    else if (rule.operator === 'not_equals') passed = String(actual) !== String(rule.values?.[0]);
    else if (rule.operator === 'in') passed = Array.isArray(rule.values) && rule.values.some((v: any) => String(v) === String(actual));
    else if (rule.operator === 'not_in') passed = !Array.isArray(rule.values) || !rule.values.some((v: any) => String(v) === String(actual));

    if (passed) passedCount++;
  }

  return matchType === 'and' ? passedCount === cond.rules.length : passedCount > 0;
}

function vnodeToHtml(node: any, indentLevel = 2, tweakValues: Record<string, any> = {}): string {
  if (!node) return '';
  if (!isNodeVisibleByCondition(node, tweakValues)) return '';
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

  if (node.type === 'textarea') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    return `${indent}<textarea${classAttr}${styleAttr}${placeholder}>${node.content || ''}</textarea>`;
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
    .map((c: any) => vnodeToHtml(c, indentLevel + 2, tweakValues))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

function winToWslPath(winPath: string): string {
  if (process.platform === 'win32') return winPath;
  const match = winPath.match(/^([A-Za-z]):[\\/](.*)$/);
  if (match) {
    const drive = match[1].toLowerCase();
    const rest = match[2].replace(/\\/g, '/');
    return `/mnt/${drive}/${rest}`;
  }
  return winPath;
}

function getWindowsSystemRoot(): { winRoot: string; wslRoot: string; systemDrive: string } {
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

function getWindowsTempDir(): string {
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

function ensureWinregSupport(): void {
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

function queryWinregValue(hive: string, key: string, valueName = ''): Promise<string | null> {
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

function getWinregSubkeys(hive: string, key: string): Promise<any[]> {
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

async function findBrowserFromWindowsRegistry(): Promise<string | null> {
  ensureWinregSupport();
  const isWin = process.platform === 'win32';

  // 1. Check App Paths using winreg module
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

  // 2. Query registered Internet clients (StartMenuInternet) using winreg module
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

async function findBrowserBinary(): Promise<string> {
  // 1. Explicit environment variables take top priority
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  // 2. Dynamic Windows Registry lookup via 'winreg' Node module (Windows & WSL)
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

function toWindowsPath(posixPath: string): string {
  if (posixPath.startsWith('/mnt/')) {
    const drive = posixPath.charAt(5).toUpperCase();
    const rest = posixPath.slice(7).split('/').join('\\');
    return `${drive}:\\${rest}`;
  }
  return posixPath.replace(/\//g, '\\');
}

export async function renderArtboardToImage(options: RenderArtboardOptions): Promise<RenderArtboardResult> {
  const ws = options.workspacePath || process.cwd();

  // 1. Resolve pageDocsPath from config.json
  let pageDocsPath = 'docs/ui-boards';
  try {
    const raw = await fs.readFile(path.join(ws, '.screen-designer', 'config.json'), 'utf-8');
    const cfg = JSON.parse(raw);
    if (cfg.pageDocsPath) pageDocsPath = cfg.pageDocsPath;
  } catch {}

  const fullDocsDir = path.resolve(ws, pageDocsPath);

  // 2. Find target page JSON file
  let pageFileName = options.pageId.endsWith('.json') ? options.pageId : `${options.pageId}.json`;
  let fullPagePath = path.join(fullDocsDir, pageFileName);

  try {
    await fs.access(fullPagePath);
  } catch {
    // Try fuzzy match
    const files = await fs.readdir(fullDocsDir);
    const matched = files.find(f => f.includes(options.pageId) && f.endsWith('.json'));
    if (!matched) {
      throw new Error(`Page document not found for ID "${options.pageId}" in ${fullDocsDir}. Available pages: ${files.join(', ')}`);
    }
    fullPagePath = path.join(fullDocsDir, matched);
  }

  const pageRaw = await fs.readFile(fullPagePath, 'utf-8');
  const pageDoc = JSON.parse(pageRaw);

  const artboards = pageDoc.artboards || [];
  if (artboards.length === 0) {
    throw new Error(`Page "${pageDoc.name || pageDoc.id}" does not have any artboards to render.`);
  }

  // 3. Select target artboard
  let artboard = artboards[0];
  if (options.artboardId !== undefined && options.artboardId !== '') {
    const query = options.artboardId.trim();
    const isIndex = /^\d+$/.test(query);
    if (isIndex) {
      const idx = parseInt(query, 10);
      if (idx >= 0 && idx < artboards.length) {
        artboard = artboards[idx];
      }
    }
    if (!artboard || (isIndex && !artboards[parseInt(query, 10)])) {
      artboard = artboards.find((a: any) => a.id === query || a.title === query || (a.title && a.title.includes(query))) || artboards[0];
    }
  }

  const width = options.width || artboard.width || 375;
  const height = options.height || artboard.height || 812;
  const artboardTitle = artboard.title || 'Screen';
  const safeTitle = artboardTitle.replace(/[^a-zA-Z0-9가-힣_-]/g, '_');

  // 4. Generate HTML content
  const contentHtml = artboard.rootNode
    ? vnodeToHtml(artboard.rootNode, 4, artboard.tweakValues || {})
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
  let finalOut = options.outPath;
  if (!finalOut) {
    finalOut = path.join(ws, 'exports', 'images', `${pageDoc.id}_${safeTitle}.png`);
  } else if (!path.isAbsolute(finalOut)) {
    finalOut = path.resolve(ws, finalOut);
  }

  await fs.mkdir(path.dirname(finalOut), { recursive: true });
  await fs.copyFile(tempPngFile, finalOut);

  // Read output bytes & base64
  const imageBuffer = await fs.readFile(finalOut);
  const base64Png = imageBuffer.toString('base64');
  const fileSizeBytes = imageBuffer.length;

  // Cleanup temporary files
  try {
    await fs.unlink(tempHtmlFile);
    await fs.unlink(tempPngFile);
  } catch {}

  return {
    outPath: finalOut,
    artboardTitle,
    artboardId: artboard.id,
    pageId: pageDoc.id,
    pageName: pageDoc.name || pageDoc.id,
    width,
    height,
    fileSizeBytes,
    base64Png
  };
}
