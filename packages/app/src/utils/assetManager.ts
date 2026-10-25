import { IMAGE_PRESETS, getPresetById, getPresetByFileName, ImagePreset } from '../data/imagePresets';
import { ensureElectronAPI, canUseHttpDevApi } from './electronBridge';

export interface ChosenAsset {
  relativePath: string;
  fileName: string;
  dataUrl: string;
}

declare global {
  interface Window {
    electronAPI?: {
      assets?: {
        materializePresets: (workspacePath?: string) => Promise<{ success: boolean; count: number; files: string[] }>;
        chooseAndCopy: (workspacePath?: string) => Promise<{
          canceled?: boolean;
          success?: boolean;
          relativePath?: string;
          fileName?: string;
          dataUrl?: string;
          error?: string;
        }>;
        list: (workspacePath?: string) => Promise<{
          success: boolean;
          assets: Array<{
            fileName: string;
            relativePath: string;
            size: number;
            isPreset: boolean;
            mimeType: string;
            dataUrl?: string;
          }>;
        }>;
      };
      [key: string]: any;
    };
  }
}

/**
 * Initializes project assets by materializing built-in presets on app startup.
 */
export async function initProjectAssets(): Promise<void> {
  try {
    const api = ensureElectronAPI();
    if (api?.assets?.materializePresets) {
      await api.assets.materializePresets();
    } else if (canUseHttpDevApi()) {
      await fetch('/api/assets/materialize-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[AssetManager] Failed to auto-materialize presets:', err);
  }
}

/**
 * Opens a native (or web) file picker to choose an image file,
 * copies it into the project's `assets/` folder, and returns the relative path & dataUrl.
 */
export async function chooseAndCopyImageFile(): Promise<ChosenAsset | null> {
  // 1. Electron Native File Dialog
  if (window.electronAPI?.assets?.chooseAndCopy) {
    try {
      const res = await window.electronAPI.assets.chooseAndCopy();
      if (res.canceled || !res.success || !res.relativePath || !res.dataUrl) {
        return null;
      }
      return {
        relativePath: res.relativePath,
        fileName: res.fileName || res.relativePath.replace('assets/', ''),
        dataUrl: res.dataUrl
      };
    } catch (err) {
      console.error('[AssetManager] Electron chooseAndCopy failed:', err);
    }
  }

  // 2. Browser Fallback: HTML <input type="file">
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/bmp';
    input.style.display = 'none';

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const fileName = file.name.replace(/[^a-zA-Z0-9_.\-\uac00-\ud7a3]/g, '_');
        const relativePath = `assets/${fileName}`;

        // Save into server assets folder via API
        try {
          await fetch('/api/assets/save-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName,
              dataUrl
            })
          });
        } catch (apiErr) {
          console.warn('[AssetManager] Failed to persist file via dev server API:', apiErr);
        }

        resolve({
          relativePath,
          fileName,
          dataUrl
        });
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    input.click();
  });
}

/**
 * Applies a built-in image preset, ensuring it is written to the project's `assets/` directory.
 */
export async function applyPresetImage(presetId: string): Promise<ChosenAsset | null> {
  const preset = getPresetById(presetId);
  if (!preset) return null;

  // Persist preset SVG to project assets directory
  try {
    if (window.electronAPI?.assets?.materializePresets) {
      await window.electronAPI.assets.materializePresets();
    } else {
      await fetch('/api/assets/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: preset.fileName,
          content: preset.svgContent
        })
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[AssetManager] Failed to write preset file:', err);
  }

  return {
    relativePath: `assets/${preset.fileName}`,
    fileName: preset.fileName,
    dataUrl: preset.dataUrl
  };
}

export { IMAGE_PRESETS, getPresetById, getPresetByFileName };
