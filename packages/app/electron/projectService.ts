import fs from 'fs';
import path from 'path';
import { resolveProjectRoot, materializePresets } from './assetService';

export interface ProjectMetadata {
  name: string;
  version: string;
  updatedAt: string;
  activePageId: string;
  pageDocsPath?: string;
  pages: Array<{
    id: string;
    name: string;
    number: number;
    fileName: string;
    artboardsCount: number;
  }>;
  assets: string[];
  settings?: Record<string, any>;
}

export interface DesignSystemConfig {
  version: string;
  updatedAt: string;
  theme: string;
  componentDefaults: Record<string, any>;
  canvasBackground?: string;
  gridSize?: number;
  [key: string]: any;
}

export interface StructuredPageData {
  id: string;
  name: string;
  number: number;
  version?: string;
  updatedAt?: string;
  artboards: any[];
}

/**
 * Saves project to the exact required folder structure:
 * <rootDir>/<pageDocsPath>/
 *   project.json
 *   design-system.json
 *   pages/{number}.json
 *   assets/
 */
export async function saveProjectStructure({
  project,
  pages,
  designSystem,
  pageDocsPath = 'docs/ui-boards',
  workspacePath
}: {
  project?: Partial<ProjectMetadata>;
  pages: StructuredPageData[];
  designSystem?: Partial<DesignSystemConfig>;
  pageDocsPath?: string;
  workspacePath?: string;
}): Promise<{ success: boolean; docsDir: string; error?: string }> {
  try {
    const rootDir = resolveProjectRoot(workspacePath);
    const docsDir = path.join(rootDir, pageDocsPath);
    const pagesDir = path.join(docsDir, 'pages');
    const projectAssetsDir = path.join(docsDir, 'assets');
    const dotDir = path.join(rootDir, '.screen-designer');

    await fs.promises.mkdir(docsDir, { recursive: true });
    await fs.promises.mkdir(pagesDir, { recursive: true });
    await fs.promises.mkdir(projectAssetsDir, { recursive: true });
    await fs.promises.mkdir(dotDir, { recursive: true });

    // 1. Collect asset file list from project assets directory
    let assetFiles: string[] = [];
    try {
      const files = await fs.promises.readdir(projectAssetsDir);
      assetFiles = files.filter(f => !f.startsWith('.')).map(f => `assets/${f}`);
    } catch {}

    // Ensure built-in presets exist in project assets directory
    try {
      await materializePresets(workspacePath);
    } catch {}

    // 2. Save pages/{number}.json
    const pageSummaries = [];
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNum = page.number || (i + 1);
      const pageFileName = `${pageNum}.json`;
      const pageFilePath = path.join(pagesDir, pageFileName);

      const pageDoc: StructuredPageData = {
        id: page.id,
        name: page.name,
        number: pageNum,
        version: page.version || '1.0.0',
        updatedAt: new Date().toISOString(),
        artboards: page.artboards || []
      };

      await fs.promises.writeFile(pageFilePath, JSON.stringify(pageDoc, null, 2), 'utf-8');

      pageSummaries.push({
        id: page.id,
        name: page.name,
        number: pageNum,
        fileName: `pages/${pageFileName}`,
        artboardsCount: (page.artboards || []).length
      });
    }

    // 3. Save project.json
    const projectJsonPath = path.join(docsDir, 'project.json');
    const projectMeta: ProjectMetadata = {
      name: project?.name || 'Screen Designer Storyboard',
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      activePageId: project?.activePageId || (pages[0] ? pages[0].id : 'page-1'),
      pageDocsPath,
      pages: pageSummaries,
      assets: assetFiles.length > 0 ? assetFiles : (project?.assets || []),
      settings: project?.settings || {}
    };
    await fs.promises.writeFile(projectJsonPath, JSON.stringify(projectMeta, null, 2), 'utf-8');

    // 4. Save design-system.json
    const designSystemPath = path.join(docsDir, 'design-system.json');
    const dsConfig: DesignSystemConfig = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      theme: designSystem?.theme || 'dark',
      componentDefaults: designSystem?.componentDefaults || {},
      canvasBackground: designSystem?.canvasBackground || '#e5e7eb',
      gridSize: designSystem?.gridSize || 24
    };
    await fs.promises.writeFile(designSystemPath, JSON.stringify(dsConfig, null, 2), 'utf-8');

    // 5. Update .screen-designer/config.json
    const configPath = path.join(dotDir, 'config.json');
    let existingConfig: any = {};
    try {
      const raw = await fs.promises.readFile(configPath, 'utf-8');
      existingConfig = JSON.parse(raw);
    } catch {}

    const updatedConfig = {
      ...existingConfig,
      version: '1.0.0',
      pageDocsPath,
      lastActivePage: projectMeta.activePageId,
      updatedAt: new Date().toISOString()
    };
    await fs.promises.writeFile(configPath, JSON.stringify(updatedConfig, null, 2), 'utf-8');

    return { success: true, docsDir };
  } catch (err: any) {
    console.error('[ProjectService] Save project structure error:', err);
    return { success: false, docsDir: '', error: err.message };
  }
}

/**
 * Loads project from the structured folder:
 * - project.json
 * - design-system.json
 * - pages/{number}.json
 * - assets/
 *
 * Automatically migrates legacy root docs/*.json if found.
 */
export async function loadProjectStructure({
  pageDocsPath = 'docs/ui-boards',
  workspacePath
}: {
  pageDocsPath?: string;
  workspacePath?: string;
}): Promise<{
  success: boolean;
  project?: ProjectMetadata;
  designSystem?: DesignSystemConfig;
  pages: StructuredPageData[];
  docsDir: string;
  error?: string;
}> {
  try {
    const rootDir = resolveProjectRoot(workspacePath);
    const docsDir = path.join(rootDir, pageDocsPath);
    const pagesDir = path.join(docsDir, 'pages');
    const projectJsonPath = path.join(docsDir, 'project.json');
    const designSystemPath = path.join(docsDir, 'design-system.json');

    await fs.promises.mkdir(docsDir, { recursive: true });
    await fs.promises.mkdir(pagesDir, { recursive: true });

    let project: ProjectMetadata | undefined;
    let designSystem: DesignSystemConfig | undefined;
    let pages: StructuredPageData[] = [];

    // 1. Read project.json if exists
    if (fs.existsSync(projectJsonPath)) {
      try {
        const raw = await fs.promises.readFile(projectJsonPath, 'utf-8');
        project = JSON.parse(raw);
      } catch (e) {
        console.warn('[ProjectService] Failed to parse project.json', e);
      }
    }

    // 2. Read design-system.json if exists
    if (fs.existsSync(designSystemPath)) {
      try {
        const raw = await fs.promises.readFile(designSystemPath, 'utf-8');
        designSystem = JSON.parse(raw);
      } catch (e) {
        console.warn('[ProjectService] Failed to parse design-system.json', e);
      }
    }

    // 3. Read pages from pages/{number}.json
    if (fs.existsSync(pagesDir)) {
      const pageFiles = await fs.promises.readdir(pagesDir);
      const jsonPageFiles = pageFiles.filter(f => f.endsWith('.json'));

      for (const pf of jsonPageFiles) {
        try {
          const raw = await fs.promises.readFile(path.join(pagesDir, pf), 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            const pageNum = parsed.number || parseInt(pf.replace('.json', ''), 10) || 1;
            pages.push({
              ...parsed,
              number: pageNum
            });
          }
        } catch (e) {
          console.error(`[ProjectService] Failed to read page file: ${pf}`, e);
        }
      }

      // Sort by page number ascending
      pages.sort((a, b) => a.number - b.number);
    }

    // 4. Backwards compatibility: Check for legacy root docsDir/*.json (e.g. page-1.json)
    if (pages.length === 0) {
      const rootFiles = await fs.promises.readdir(docsDir);
      const legacyPageFiles = rootFiles.filter(f => f.startsWith('page-') && f.endsWith('.json'));

      for (let i = 0; i < legacyPageFiles.length; i++) {
        const f = legacyPageFiles[i];
        try {
          const raw = await fs.promises.readFile(path.join(docsDir, f), 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            pages.push({
              id: parsed.id,
              name: parsed.name,
              number: i + 1,
              artboards: parsed.artboards || []
            });
          }
        } catch (e) {
          console.error(`[ProjectService] Failed to parse legacy file: ${f}`, e);
        }
      }

      // If legacy pages were found, auto-save to new structured format!
      if (pages.length > 0) {
        await saveProjectStructure({
          project,
          pages,
          designSystem,
          pageDocsPath,
          workspacePath
        });

        // Clean up legacy page-*.json files from docsDir root
        for (const f of legacyPageFiles) {
          try {
            await fs.promises.unlink(path.join(docsDir, f));
          } catch {}
        }
      }
    }

    return {
      success: true,
      project,
      designSystem,
      pages,
      docsDir
    };
  } catch (err: any) {
    console.error('[ProjectService] Load project structure error:', err);
    return {
      success: false,
      pages: [],
      docsDir: '',
      error: err.message
    };
  }
}

/**
 * Recursively copies a directory
 */
async function copyDirRecursive(src: string, dest: string): Promise<void> {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Migrates all contents from old project folder to new project folder.
 * Invoked when the user updates `pageDocsPath` in Settings.
 */
export async function migrateProjectFolder({
  oldPath,
  newPath,
  workspacePath
}: {
  oldPath: string;
  newPath: string;
  workspacePath?: string;
}): Promise<{ success: boolean; movedFilesCount: number; oldPath: string; newPath: string; error?: string }> {
  try {
    const rootDir = resolveProjectRoot(workspacePath);
    const cleanOld = path.normalize(oldPath).replace(/^(\.\/|\/)/, '');
    const cleanNew = path.normalize(newPath).replace(/^(\.\/|\/)/, '');

    if (cleanOld === cleanNew) {
      return { success: true, movedFilesCount: 0, oldPath, newPath };
    }

    const oldDir = path.join(rootDir, cleanOld);
    const newDir = path.join(rootDir, cleanNew);

    if (!fs.existsSync(oldDir)) {
      // Old dir didn't exist yet, simply create newDir
      await fs.promises.mkdir(newDir, { recursive: true });
      return { success: true, movedFilesCount: 0, oldPath, newPath };
    }

    // 1. Copy all contents from oldDir to newDir recursively
    await copyDirRecursive(oldDir, newDir);

    // 2. Count moved files
    let movedCount = 0;
    try {
      const countEntries = async (dir: string) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.isDirectory()) await countEntries(path.join(dir, e.name));
          else movedCount++;
        }
      };
      await countEntries(newDir);
    } catch {}

    // 3. Remove old directory contents safely
    try {
      await fs.promises.rm(oldDir, { recursive: true, force: true });
    } catch (e) {
      console.warn('[ProjectService] Failed to clean up old directory after migration:', e);
    }

    // 4. Update .screen-designer/config.json
    const dotDir = path.join(rootDir, '.screen-designer');
    const configPath = path.join(dotDir, 'config.json');
    let existingConfig: any = {};
    try {
      const raw = await fs.promises.readFile(configPath, 'utf-8');
      existingConfig = JSON.parse(raw);
    } catch {}

    await fs.promises.writeFile(configPath, JSON.stringify({
      ...existingConfig,
      pageDocsPath: cleanNew,
      migratedFrom: cleanOld,
      migratedAt: new Date().toISOString()
    }, null, 2), 'utf-8');

    console.log(`[ProjectService] Successfully migrated ${movedCount} files from "${cleanOld}" to "${cleanNew}"`);
    return { success: true, movedFilesCount: movedCount, oldPath: cleanOld, newPath: cleanNew };
  } catch (err: any) {
    console.error('[ProjectService] Folder migration failed:', err);
    return { success: false, movedFilesCount: 0, oldPath, newPath, error: err.message };
  }
}
