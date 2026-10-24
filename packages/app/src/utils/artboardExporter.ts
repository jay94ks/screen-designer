import { VDomArtboard } from '../types/vdom';
import { generateComponentCode } from './serializer';

function sanitizeFileName(name: string): string {
  return (name || 'Artboard').replace(/[^a-zA-Z0-9_\-\uac00-\ud7a3]/g, '_');
}

/**
 * 1. [JSON 구조로 내보내기]
 * Exports a single artboard's VDOM JSON structure as a downloadable .json file.
 */
export function exportArtboardJson(artboard: VDomArtboard): void {
  const jsonDoc = {
    id: artboard.id,
    title: artboard.title,
    width: artboard.width,
    height: artboard.height,
    viewport: artboard.viewport,
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    rootNode: artboard.rootNode
  };

  const content = JSON.stringify(jsonDoc, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFileName(artboard.title)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 2. [코드로 내보내기]
 * Exports clean React + Tailwind component TSX code for the artboard.
 */
export function exportArtboardCode(artboard: VDomArtboard): void {
  const componentName = sanitizeFileName(artboard.title).replace(/^[0-9_]+/, '') || 'ScreenComponent';
  const pascalName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const code = generateComponentCode(pascalName, artboard.rootNode);

  const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pascalName}.tsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 3. [이미지 파일로 내보내기]
 * Captures the artboard frame and downloads as a PNG image.
 */
export async function exportArtboardImage(artboard: VDomArtboard, targetElement?: HTMLElement | null): Promise<boolean> {
  const element = targetElement || document.getElementById(`artboard-frame-${artboard.id}`);
  const fileName = `${sanitizeFileName(artboard.title)}.png`;

  if (!element) {
    console.warn(`[ArtboardExporter] Frame element not found for artboard: ${artboard.id}`);
    return false;
  }

  try {
    const width = element.offsetWidth || artboard.width || 390;
    const height = element.offsetHeight || artboard.height || 844;

    const clone = element.cloneNode(true) as HTMLElement;

    // Reset outline, cursor and selection rings in cloned element
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

    const canvas = document.createElement('canvas');
    const scale = 2; // 2x Retina resolution
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.scale(scale, scale);

    const serializedHtml = new XMLSerializer().serializeToString(clone);
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;">
          ${serializedHtml}
        </div>
      </foreignObject>
    </svg>`;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        try {
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = fileName;
          a.click();
          resolve(true);
        } catch {
          // If canvas tainted, fallback to direct SVG download
          const a = document.createElement('a');
          a.href = URL.createObjectURL(svgBlob);
          a.download = fileName.replace(/\.png$/, '.svg');
          a.click();
          resolve(true);
        }
      };

      img.onerror = () => {
        // Fallback: download as SVG directly
        URL.revokeObjectURL(url);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(svgBlob);
        a.download = fileName.replace(/\.png$/, '.svg');
        a.click();
        resolve(true);
      };

      img.src = url;
    });
  } catch (err) {
    console.error('[ArtboardExporter] Image export error:', err);
    return false;
  }
}
