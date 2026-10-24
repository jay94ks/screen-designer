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
export declare function saveProjectStructure({ project, pages, designSystem, pageDocsPath, workspacePath }: {
    project?: Partial<ProjectMetadata>;
    pages: StructuredPageData[];
    designSystem?: Partial<DesignSystemConfig>;
    pageDocsPath?: string;
    workspacePath?: string;
}): Promise<{
    success: boolean;
    docsDir: string;
    error?: string;
}>;
/**
 * Loads project from the structured folder:
 * - project.json
 * - design-system.json
 * - pages/{number}.json
 * - assets/
 *
 * Automatically migrates legacy root docs/*.json if found.
 */
export declare function loadProjectStructure({ pageDocsPath, workspacePath }: {
    pageDocsPath?: string;
    workspacePath?: string;
}): Promise<{
    success: boolean;
    project?: ProjectMetadata;
    designSystem?: DesignSystemConfig;
    pages: StructuredPageData[];
    docsDir: string;
    error?: string;
}>;
/**
 * Migrates all contents from old project folder to new project folder.
 * Invoked when the user updates `pageDocsPath` in Settings.
 */
export declare function migrateProjectFolder({ oldPath, newPath, workspacePath }: {
    oldPath: string;
    newPath: string;
    workspacePath?: string;
}): Promise<{
    success: boolean;
    movedFilesCount: number;
    oldPath: string;
    newPath: string;
    error?: string;
}>;
