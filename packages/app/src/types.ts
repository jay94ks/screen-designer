export type ViewportType = 'mobile' | 'tablet' | 'desktop' | 'custom';

export type TweakControl = 'boolean' | 'select' | 'buttons' | 'text' | 'color' | 'slider';

export interface TweakDefinition {
  id: string;
  label: string;
  description?: string;
  control: TweakControl;
  options?: string[]; // for 'select' or 'buttons'
  min?: number;       // for 'slider'
  max?: number;
  step?: number;
  defaultValue: any;
}

export interface ElementStyleProps {
  color?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  borderWidth?: string;
  borderColor?: string;
  boxShadow?: string;
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface InspectedElementInfo {
  elementTag: string;
  elementId?: string;
  className?: string;
  xpath?: string;
  textSnippet?: string;
  appliedStyles: ElementStyleProps;
  computedBox?: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export interface Artboard {
  id: string;
  title: string;
  viewport: ViewportType;
  x: number;
  y: number;
  width: number;
  height: number;
  code: string; // React JSX or HTML markup
  tweaksSchema: TweakDefinition[];
  tweakValues: Record<string, any>;
  locked?: boolean;
  visible?: boolean;
  backgroundColor?: string;
}

export interface Page {
  id: string;
  name: string;
  artboards: Artboard[];
}

export interface ComponentDefaultStyles {
  button: {
    backgroundColor: string;
    color: string;
    borderRadius: number;
    padding: number;
    fontSize: number;
    fontWeight: string;
  };
  text: {
    color: string;
    fontSize: number;
    fontWeight: string;
  };
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  input: {
    backgroundColor: string;
    color: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  box: {
    backgroundColor: string;
    borderRadius: number;
    width: number;
    height: number;
  };
  circle: {
    backgroundColor: string;
    color: string;
    size: number;
  };
}

export const DEFAULT_COMPONENT_STYLES: ComponentDefaultStyles = {
  button: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontWeight: 'bold'
  },
  text: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'normal'
  },
  card: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10
  },
  box: {
    backgroundColor: '#334155',
    borderRadius: 8,
    width: 140,
    height: 90
  },
  circle: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    size: 40
  }
};

export interface DesignGitChange {
  path: string;
  filename: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
}

export interface GitStatusInfo {
  isRepo: boolean;
  branch: string;
  tracking?: string;
  ahead?: number;
  behind?: number;
  clean: boolean;
  uiChangesCount: number;
  designChanges: DesignGitChange[];
  allChangesCount: number;
  allChanges?: DesignGitChange[];
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
  files: { path: string; filename: string; status: 'modified' | 'added' | 'deleted' }[];
}

export interface PageDocument {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  artboards: any[];
}

export interface ProjectSettings {
  gridVisible: boolean;
  gridSize: number;
  snapToGrid: boolean;
  rulersVisible: boolean;
  canvasBackground: string;
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  componentDefaults?: ComponentDefaultStyles;
  pageDocsPath?: string;
  workspacePath?: string;
  gitAutoCheck?: boolean;
}

export interface DocumentProject {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  pages: Page[];
  activePageId: string;
  selectedArtboardId: string | null;
  settings: ProjectSettings;
}

export type CanvasTool = 'select' | 'hand' | 'text' | 'frame' | 'pen' | 'rect' | 'circle' | 'button';
