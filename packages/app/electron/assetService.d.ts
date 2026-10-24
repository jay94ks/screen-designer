export interface AssetInfo {
    fileName: string;
    relativePath: string;
    size: number;
    isPreset: boolean;
    mimeType: string;
    dataUrl?: string;
}
export declare const BUILTIN_IMAGE_PRESETS: Array<{
    fileName: string;
    name: string;
    category: string;
    svg: string;
}>;
export declare function getMimeType(fileName: string): string;
export declare function fileToDataUrl(filePath: string): string;
export declare function svgToDataUrl(svg: string): string;
export declare function resolveProjectRoot(workspacePath?: string): string;
/**
 * Ensures `<rootDir>/assets/` exists and writes all built-in SVG preset files.
 * Also copies them to packages/app/public/assets if that folder exists.
 */
export declare function materializePresets(workspacePath?: string): Promise<{
    success: boolean;
    count: number;
    files: string[];
}>;
/**
 * Copies a local file picked by the user into `<rootDir>/assets/<sanitized_name>`.
 * Returns asset info including relativePath and dataUrl.
 */
export declare function copyAssetFile(sourcePath: string, workspacePath?: string): Promise<{
    success: boolean;
    relativePath: string;
    fileName: string;
    dataUrl: string;
    error?: string;
}>;
/**
 * Lists all assets in `<rootDir>/assets/`
 */
export declare function listAssets(workspacePath?: string): Promise<{
    success: boolean;
    assets: AssetInfo[];
}>;
