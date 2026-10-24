import fs from 'fs';
import path from 'path';

export interface AssetInfo {
  fileName: string;
  relativePath: string;
  size: number;
  isPreset: boolean;
  mimeType: string;
  dataUrl?: string;
}

// Built-in Vector SVG Presets (Electron embedded assets)
export const BUILTIN_IMAGE_PRESETS: Array<{ fileName: string; name: string; category: string; svg: string }> = [
  {
    fileName: 'preset-gradient.svg',
    name: '오로라 메쉬 그라디언트',
    category: 'gradient',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090514" />
    </linearGradient>
    <radialGradient id="blob1" cx="30%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blob2" cx="75%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blob3" cx="50%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.75" />
      <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#090514" stop-opacity="0" />
    </radialGradient>
    <filter id="meshBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)" />
  <g filter="url(#meshBlur)">
    <circle cx="260" cy="180" r="220" fill="url(#blob1)" />
    <circle cx="620" cy="320" r="240" fill="url(#blob2)" />
    <circle cx="420" cy="400" r="190" fill="url(#blob3)" />
  </g>
  <g opacity="0.15">
    <circle cx="400" cy="250" r="180" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 8" />
    <circle cx="400" cy="250" r="260" fill="none" stroke="#ffffff" stroke-width="1" />
  </g>
</svg>`
  },
  {
    fileName: 'preset-avatar.svg',
    name: '디자이너 사용자 아바타',
    category: 'avatar',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="80" fill="url(#avatarBg)" />
  <circle cx="200" cy="150" r="65" fill="url(#bodyGrad)" />
  <path d="M90 340 C90 250, 140 230, 200 230 C260 230, 310 250, 310 340 Z" fill="url(#bodyGrad)" />
  <circle cx="178" cy="145" r="7" fill="#1e293b" />
  <circle cx="222" cy="145" r="7" fill="#1e293b" />
  <path d="M185 172 Q200 185 215 172" stroke="#1e293b" stroke-width="4" stroke-linecap="round" fill="none" />
  <circle cx="280" cy="120" r="16" fill="#38bdf8" opacity="0.8" />
  <path d="M280 110 L280 130 M270 120 L290 120" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
</svg>`
  },
  {
    fileName: 'preset-chart.svg',
    name: '핀테크 자산 분석 대시보드',
    category: 'finance',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
  <defs>
    <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1120" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="glowLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="60%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <linearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#chartBg)" />
  <g opacity="0.08" stroke="#ffffff" stroke-width="1">
    <line x1="80" y1="100" x2="720" y2="100" stroke-dasharray="4 4" />
    <line x1="80" y1="180" x2="720" y2="180" stroke-dasharray="4 4" />
    <line x1="80" y1="260" x2="720" y2="260" stroke-dasharray="4 4" />
    <line x1="80" y1="340" x2="720" y2="340" />
  </g>
  <path d="M 100 320 C 180 290, 240 330, 320 220 C 400 110, 480 250, 560 160 C 640 70, 680 120, 720 90 L 720 340 L 100 340 Z" fill="url(#areaFill)" />
  <path d="M 100 320 C 180 290, 240 330, 320 220 C 400 110, 480 250, 560 160 C 640 70, 680 120, 720 90" fill="none" stroke="url(#glowLine)" stroke-width="4" stroke-linecap="round" />
  <circle cx="560" cy="160" r="6" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
  <circle cx="720" cy="90" r="7" fill="#10b981" stroke="#ffffff" stroke-width="2.5" />
</svg>`
  },
  {
    fileName: 'preset-tech.svg',
    name: '사이버펑크 네온 그리드',
    category: 'tech',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="cyberSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050515" />
      <stop offset="60%" stop-color="#180b38" />
      <stop offset="100%" stop-color="#4c1d95" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#cyberSky)" />
  <circle cx="400" cy="240" r="110" fill="url(#sunGrad)" />
  <g fill="#050515">
    <rect x="280" y="235" width="240" height="4" />
    <rect x="280" y="247" width="240" height="6" />
    <rect x="280" y="261" width="240" height="8" />
  </g>
  <g stroke="#06b6d4" stroke-width="1.2" opacity="0.7">
    <line x1="400" y1="250" x2="50" y2="500" />
    <line x1="400" y1="250" x2="200" y2="500" />
    <line x1="400" y1="250" x2="330" y2="500" />
    <line x1="400" y1="250" x2="400" y2="500" />
    <line x1="400" y1="250" x2="470" y2="500" />
    <line x1="400" y1="250" x2="600" y2="500" />
    <line x1="400" y1="250" x2="750" y2="500" />
    <line x1="0" y1="280" x2="800" y2="280" />
    <line x1="0" y1="315" x2="800" y2="315" />
    <line x1="0" y1="365" x2="800" y2="365" />
    <line x1="0" y1="430" x2="800" y2="430" />
  </g>
</svg>`
  },
  {
    fileName: 'preset-minimal.svg',
    name: '미니멀 워크스페이스',
    category: 'minimal',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="wall" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="desk" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wall)" />
  <rect x="0" y="270" width="600" height="130" fill="url(#desk)" />
  <rect x="220" y="160" width="160" height="105" rx="6" fill="#1e293b" />
  <rect x="228" y="168" width="144" height="88" rx="2" fill="#38bdf8" opacity="0.3" />
  <polygon points="200,270 400,270 380,265 220,265" fill="#94a3b8" />
  <rect x="120" y="190" width="45" height="80" rx="8" fill="#10b981" opacity="0.85" />
  <rect x="133" y="170" width="18" height="20" fill="#059669" />
  <ellipse cx="480" cy="245" rx="35" ry="4" fill="#94a3b8" opacity="0.4" />
  <path d="M455 210 L505 210 L495 245 L465 245 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
</svg>`
  },
  {
    fileName: 'preset-nature.svg',
    name: '자연 풍경 & 산맥 실루엣',
    category: 'nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="800" height="480">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fdba74" />
      <stop offset="40%" stop-color="#f472b6" />
      <stop offset="75%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky)" />
  <circle cx="400" cy="190" r="50" fill="#fffbeb" opacity="0.9" />
  <path d="M0 320 L150 210 L320 310 L480 180 L620 270 L800 160 L800 480 L0 480 Z" fill="#1e1b4b" opacity="0.5" />
  <path d="M0 360 L180 260 L360 350 L520 240 L700 330 L800 250 L800 480 L0 480 Z" fill="#0f172a" />
</svg>`
  }
];

export function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
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

export function fileToDataUrl(filePath: string): string {
  const data = fs.readFileSync(filePath);
  const mime = getMimeType(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolveProjectRoot(workspacePath?: string): string {
  if (workspacePath && workspacePath !== '.') {
    return workspacePath;
  }
  if (process.env.SCREEN_DESIGNER_WORKSPACE) {
    return process.env.SCREEN_DESIGNER_WORKSPACE;
  }
  const cwd = process.cwd();
  if (cwd.endsWith(path.join('packages', 'app')) || cwd.endsWith('packages/app') || cwd.endsWith('packages\\app')) {
    return path.resolve(cwd, '../..');
  }
  return cwd;
}

/**
 * Ensures `<rootDir>/assets/` exists and writes all built-in SVG preset files.
 * Also copies them to packages/app/public/assets if that folder exists.
 */
export async function materializePresets(workspacePath?: string): Promise<{ success: boolean; count: number; files: string[] }> {
  const rootDir = resolveProjectRoot(workspacePath);
  const assetsDir = path.join(rootDir, 'assets');

  await fs.promises.mkdir(assetsDir, { recursive: true });

  const writtenFiles: string[] = [];

  for (const preset of BUILTIN_IMAGE_PRESETS) {
    const targetFile = path.join(assetsDir, preset.fileName);
    // Write preset SVG to disk
    await fs.promises.writeFile(targetFile, preset.svg.trim(), 'utf-8');
    writtenFiles.push(preset.fileName);
  }

  // Also materialize to packages/app/public/assets if packages/app exists
  const publicAssetsDir = path.join(rootDir, 'packages', 'app', 'public', 'assets');
  try {
    await fs.promises.mkdir(publicAssetsDir, { recursive: true });
    for (const preset of BUILTIN_IMAGE_PRESETS) {
      await fs.promises.writeFile(path.join(publicAssetsDir, preset.fileName), preset.svg.trim(), 'utf-8');
    }
  } catch (e) {
    // Non-fatal if public folder is not accessible
  }

  return { success: true, count: writtenFiles.length, files: writtenFiles };
}

/**
 * Copies a local file picked by the user into `<rootDir>/assets/<sanitized_name>`.
 * Returns asset info including relativePath and dataUrl.
 */
export async function copyAssetFile(
  sourcePath: string,
  workspacePath?: string
): Promise<{ success: boolean; relativePath: string; fileName: string; dataUrl: string; error?: string }> {
  try {
    const rootDir = resolveProjectRoot(workspacePath);
    const assetsDir = path.join(rootDir, 'assets');
    await fs.promises.mkdir(assetsDir, { recursive: true });

    if (!fs.existsSync(sourcePath)) {
      return { success: false, relativePath: '', fileName: '', dataUrl: '', error: 'Source file does not exist' };
    }

    const originalName = path.basename(sourcePath);
    const ext = path.extname(originalName).toLowerCase();
    const baseWithoutExt = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-\uac00-\ud7a3]/g, '_');

    let targetFileName = `${baseWithoutExt}${ext}`;
    let targetPath = path.join(assetsDir, targetFileName);

    // If file with same name exists and is different, append timestamp
    if (fs.existsSync(targetPath)) {
      const existingStat = await fs.promises.stat(targetPath);
      const sourceStat = await fs.promises.stat(sourcePath);
      if (existingStat.size !== sourceStat.size) {
        targetFileName = `${baseWithoutExt}_${Date.now()}${ext}`;
        targetPath = path.join(assetsDir, targetFileName);
      }
    }

    // Copy file to project assets folder
    await fs.promises.copyFile(sourcePath, targetPath);

    // Also mirror to public/assets for immediate browser serving
    const publicAssetsDir = path.join(rootDir, 'packages', 'app', 'public', 'assets');
    try {
      await fs.promises.mkdir(publicAssetsDir, { recursive: true });
      await fs.promises.copyFile(sourcePath, path.join(publicAssetsDir, targetFileName));
    } catch {
      // ignore
    }

    // Generate base64 Data URL
    const dataUrl = fileToDataUrl(targetPath);
    const relativePath = `assets/${targetFileName}`;

    return {
      success: true,
      relativePath,
      fileName: targetFileName,
      dataUrl
    };
  } catch (err: any) {
    return { success: false, relativePath: '', fileName: '', dataUrl: '', error: err.message };
  }
}

/**
 * Lists all assets in `<rootDir>/assets/`
 */
export async function listAssets(workspacePath?: string): Promise<{ success: boolean; assets: AssetInfo[] }> {
  try {
    const rootDir = resolveProjectRoot(workspacePath);
    const assetsDir = path.join(rootDir, 'assets');

    if (!fs.existsSync(assetsDir)) {
      return { success: true, assets: [] };
    }

    const files = await fs.promises.readdir(assetsDir);
    const assets: AssetInfo[] = [];

    const presetNames = new Set(BUILTIN_IMAGE_PRESETS.map((p) => p.fileName));

    for (const file of files) {
      const fullPath = path.join(assetsDir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isFile()) {
        const mime = getMimeType(file);
        let dataUrl: string | undefined;
        try {
          // Read up to 2MB as dataUrl for preview
          if (stat.size < 2 * 1024 * 1024) {
            dataUrl = fileToDataUrl(fullPath);
          }
        } catch {
          // skip
        }

        assets.push({
          fileName: file,
          relativePath: `assets/${file}`,
          size: stat.size,
          isPreset: presetNames.has(file),
          mimeType: mime,
          dataUrl
        });
      }
    }

    return { success: true, assets };
  } catch (err: any) {
    return { success: false, assets: [] };
  }
}
