export interface DesignGitChange {
    path: string;
    filename: string;
    status: 'modified' | 'added' | 'deleted' | 'untracked';
}
export interface GitStatusResult {
    isRepo: boolean;
    branch: string;
    tracking: string;
    ahead: number;
    behind: number;
    clean: boolean;
    uiChangesCount: number;
    designChanges: DesignGitChange[];
    allChangesCount: number;
    allChanges: DesignGitChange[];
    error?: string;
}
export interface GitCommitItem {
    hash: string;
    shortHash: string;
    date: string;
    message: string;
    body: string;
    author_name: string;
    author_email: string;
    refs?: string;
}
export interface SideBySideRow {
    oldLineNo?: number;
    oldContent?: string;
    oldType?: 'del' | 'normal' | 'empty';
    newLineNo?: number;
    newContent?: string;
    newType?: 'add' | 'normal' | 'empty';
    isHunkHeader?: boolean;
    hunkHeader?: string;
}
export interface FileDiffResult {
    filePath: string;
    rawDiff: string;
    isBinary: boolean;
    status: 'modified' | 'added' | 'deleted' | 'untracked';
    rows: SideBySideRow[];
    lineEndingWarning?: string;
}
export interface CommitDetailsResult {
    hash: string;
    shortHash: string;
    date: string;
    message: string;
    body: string;
    author_name: string;
    author_email: string;
    files: {
        path: string;
        filename: string;
        status: 'modified' | 'added' | 'deleted';
    }[];
}
export declare function getRepoRoot(workspacePath?: string): Promise<string>;
export declare function getGitStatus(pageDocsPath?: string, workspacePath?: string): Promise<GitStatusResult>;
export declare function parseUnifiedDiff(rawDiff: string, filePath: string): SideBySideRow[];
export declare function getFileDiff(filePath: string, workspacePath?: string, commitHash?: string): Promise<FileDiffResult>;
export declare function getGitHistory(maxCount?: number, workspacePath?: string): Promise<GitCommitItem[]>;
export declare function getCommitDetails(commitHash: string, workspacePath?: string): Promise<CommitDetailsResult | null>;
export declare function commitFiles(files: string[], summary: string, description?: string, workspacePath?: string): Promise<{
    success: boolean;
    commitHash?: string;
    ahead?: number;
    error?: string;
}>;
export declare function pushCommits(workspacePath?: string): Promise<{
    success: boolean;
    ahead?: number;
    error?: string;
}>;
