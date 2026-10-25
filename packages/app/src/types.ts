import type { NodeType, CanvasRole, ArtboardResolutionRule } from './types/vdom';

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
  canvasRole?: CanvasRole;
  resolutionRule?: ArtboardResolutionRule;
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

export interface ComponentDefaultStyleItem {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: string;
  boxShadow?: string;
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  width?: number | string;
  height?: number | string;
  size?: number;
  [key: string]: any;
}

export type ComponentDefaultStyles = Record<NodeType, ComponentDefaultStyleItem>;

export const DEFAULT_COMPONENT_STYLES: ComponentDefaultStyles = {
  // Containers & Layout (13)
  frame: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 20,
    borderRadius: 0
  },
  container: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1
  },
  section: {
    backgroundColor: '#1e293b80',
    color: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  header: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  footer: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    padding: 12,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  nav: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  aside: {
    backgroundColor: '#1e293b90',
    color: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  main: {
    backgroundColor: 'transparent',
    color: '#f8fafc',
    padding: 16,
    borderRadius: 0
  },
  article: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: 16,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1
  },
  'scroll-container': {
    backgroundColor: '#1e293b60',
    color: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1
  },
  dialog: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderColor: '#334155',
    borderWidth: 1,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
  },
  box: {
    backgroundColor: '#334155',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    width: 140,
    height: 90
  },
  card: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)'
  },

  // Typography (7)
  text: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: 'normal'
  },
  heading: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: 'bold'
  },
  span: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: 'normal'
  },
  blockquote: {
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: 14,
    fontWeight: 'normal',
    padding: 12,
    borderRadius: 6,
    borderColor: '#6366f1',
    borderWidth: 3
  },
  code: {
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'medium',
    padding: 4,
    borderRadius: 4
  },
  pre: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: 'normal',
    padding: 12,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  label: {
    color: '#334155',
    fontSize: 12,
    fontWeight: 'bold'
  },

  // Interactive & Form (7)
  button: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13
  },
  textarea: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    height: 80
  },
  select: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 13
  },
  checkbox: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 2,
    borderRadius: 4,
    padding: 2
  },
  radio: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    borderColor: '#cbd5e1',
    borderWidth: 2,
    borderRadius: 999,
    padding: 2
  },
  form: {
    backgroundColor: '#ffffff08',
    color: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1
  },

  // Media & Embedded (4)
  image: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    height: 180
  },
  video: {
    backgroundColor: '#000000',
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    height: 200
  },
  audio: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 6,
    borderColor: '#334155',
    borderWidth: 1
  },
  iframe: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    height: 240
  },

  // Lists & Data (9)
  ul: {
    padding: 8,
    color: '#e2e8f0',
    fontSize: 13
  },
  ol: {
    padding: 8,
    color: '#e2e8f0',
    fontSize: 13
  },
  li: {
    padding: 6,
    color: '#e2e8f0',
    fontSize: 13
  },
  table: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    padding: 4
  },
  thead: {
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold'
  },
  tbody: {
    backgroundColor: 'transparent',
    color: '#f8fafc',
    fontSize: 13
  },
  tr: {
    borderColor: '#334155',
    borderWidth: 1,
    padding: 8
  },
  th: {
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  td: {
    color: '#e2e8f0',
    padding: 8,
    fontSize: 13,
    borderColor: '#334155',
    borderWidth: 1
  },

  // Disclosure & Separators (5)
  details: {
    backgroundColor: '#1e293b80',
    color: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    borderColor: '#334155',
    borderWidth: 1
  },
  summary: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 13,
    padding: 4
  },
  divider: {
    backgroundColor: '#334155',
    height: 1
  },
  badge: {
    backgroundColor: '#6366f120',
    color: '#818cf8',
    borderRadius: 999,
    padding: 4,
    fontSize: 11,
    fontWeight: 'bold',
    borderColor: '#6366f140',
    borderWidth: 1
  },
  circle: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: 999,
    size: 40,
    width: 40,
    height: 40
  },
  icon: {
    color: '#6366f1',
    size: 20,
    width: 20,
    height: 20
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
  language?: 'ko' | 'en' | 'ja';
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
