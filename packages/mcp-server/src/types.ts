export interface Artboard {
  id: string;
  title: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  code: string; // React JSX or HTML string
  description?: string;
}

export interface InspectorSelection {
  elementTag: string;
  elementId?: string;
  className?: string;
  xpath?: string;
  textSnippet?: string;
  appliedStyles?: Record<string, string>;
  userComment?: string;
}

export interface DesignTokens {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  spacingUnit?: string;
  [key: string]: string | undefined;
}

export interface AppState {
  workspacePath?: string;
  artboards: Artboard[];
  activeArtboardId?: string;
  selectedElement?: InspectorSelection | null;
  designTokens: DesignTokens;
  sliderOverrides: Record<string, string | number>;
}
