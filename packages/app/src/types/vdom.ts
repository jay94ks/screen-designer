import { TweakDefinition } from '../types';

export type NodeType =
  // Containers & Layout
  | 'frame'
  | 'container'
  | 'section'
  | 'header'
  | 'footer'
  | 'nav'
  | 'aside'
  | 'main'
  | 'article'
  | 'scroll-container'
  | 'dialog'
  | 'box'
  | 'card'
  // Typography
  | 'text'
  | 'heading'
  | 'span'
  | 'blockquote'
  | 'code'
  | 'pre'
  | 'label'
  // Interactive & Form
  | 'button'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'form'
  // Media & Embedded
  | 'image'
  | 'video'
  | 'audio'
  | 'iframe'
  | 'icon'
  // Lists & Data
  | 'ul'
  | 'ol'
  | 'li'
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tr'
  | 'th'
  | 'td'
  // Disclosure & Separators
  | 'details'
  | 'summary'
  | 'divider'
  | 'badge'
  | 'circle';

export interface VNodeStyle {
  // Layout & Box Model
  display?: 'flex' | 'block' | 'inline-block' | 'inline-flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flex?: number | string;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;

  // Dimensions
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  boxSizing?: 'border-box' | 'content-box';

  // Spacing (Padding & Margin)
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;

  // Visual & Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right' | string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | string;
  backgroundAttachment?: 'scroll' | 'fixed';
  backgroundBlendMode?: string;
  backgroundGradient?: string;

  // Image Specific Properties
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  aspectRatio?: string;

  // Filter Properties (Image & All Nodes)
  filter?: string;
  brightness?: number; // percentage (e.g. 100)
  contrast?: number;   // percentage (e.g. 100)
  grayscale?: number;  // percentage (e.g. 0-100)
  blur?: number | string; // in px
  sepia?: number;      // percentage
  hueRotate?: number;  // degrees (0-360)
  saturate?: number;   // percentage
  invert?: number;     // percentage
  backdropFilter?: string;

  // Border & Corners
  borderRadius?: number | string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  borderWidth?: number | string;
  borderTopWidth?: number | string;
  borderRightWidth?: number | string;
  borderBottomWidth?: number | string;
  borderLeftWidth?: number | string;
  borderColor?: string;
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  outlineWidth?: number | string;
  outlineColor?: string;
  outlineStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  outlineOffset?: number | string;

  // Shadows & Effects
  boxShadow?: string;
  opacity?: number;
  cursor?: 'default' | 'pointer' | 'move' | 'text' | 'not-allowed' | 'grab' | 'grabbing';
  pointerEvents?: 'auto' | 'none';
  transform?: string;
  transition?: string;

  // Overflow & Scrolling (Scroll Container)
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  scrollbarWidth?: 'auto' | 'thin' | 'none';
  scrollBehavior?: 'auto' | 'smooth';

  // Typography
  color?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  lineHeight?: number | string;
  letterSpacing?: string;
  textOverflow?: 'clip' | 'ellipsis';
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  lineClamp?: number;

  // Positioning
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  outline?: string;
}

export type ConditionOperator = 'equals' | 'not_equals' | 'in' | 'not_in' | 'always';

export interface TweakConditionRule {
  id: string;
  tweakId: string;
  operator: ConditionOperator;
  values: any[];
}

export interface VNodeCondition {
  enabled: boolean;
  matchType?: 'and' | 'or';
  rules: TweakConditionRule[];
}

export type EventTrigger = 'click' | 'dblclick' | 'contextmenu' | 'mouseenter';

export type EventActionType = 'change_tweak' | 'navigate';

export interface ChangeTweakAction {
  type: 'change_tweak';
  tweakId: string;
  operation: 'set' | 'toggle' | 'cycle';
  value?: any;
}

export interface NavigateAction {
  type: 'navigate';
  targetArtboardId: string;
}

export type EventAction = ChangeTweakAction | NavigateAction;

export interface NodeEventBinding {
  id: string;
  trigger: EventTrigger;
  action: EventAction;
  description?: string;
}

export interface VNode {
  id: string;
  type: NodeType;
  name: string;
  content?: string; // Text content, Image URL, or value
  style: VNodeStyle;
  className?: string; // Tailwind utility classes
  condition?: VNodeCondition; // Dynamic Tweaks Visibility Condition
  events?: NodeEventBinding[]; // Interactive events for Play mode
  props?: {
    src?: string;
    alt?: string;
    placeholder?: string;
    type?: string; // text, password, number, email, date, etc.
    rows?: number;
    disabled?: boolean;
    checked?: boolean;
    open?: boolean; // dialog / details
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    options?: Array<{ label: string; value: string }>;
    href?: string;
    target?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    loading?: 'lazy' | 'eager';
    [key: string]: any;
  };
  children?: VNode[];
  locked?: boolean;
  visible?: boolean;
}

export type CanvasRole =
  | 'main-page'    // 메인 페이지 / 전체 화면
  | 'workspace'    // 워크스페이스 / 관리 대시보드
  | 'sub-view'     // 서브 화면 / 단일 플로우 뷰
  | 'modal'        // 모달 / 다이얼로그 팝업
  | 'drawer'       // 사이드 드로어 / 슬라이드 패널
  | 'bottom-sheet' // 바텀 시트 / 액션 시트
  | 'popover'      // 팝오버 / 드롭다운 메뉴 / 커맨드 팔레트
  | 'section'      // 부분 섹션 / 임베드 위젯
  | 'custom';      // 자유 역할 캔버스

export type ResolutionRulePreset =
  | 'all'          // 모든 해상도에서 표시
  | 'wide-only'    // 와이드 화면 전용 (W >= 1280)
  | 'desktop-only' // 대화면 / 데스크톱 전용 (W >= 1024)
  | 'tablet-only'  // 중형 / 분할 화면 전용 (768 <= W <= 1023)
  | 'mobile-only'  // 소형 / 컴팩트 화면 전용 (W <= 767)
  | 'landscape'    // 가로 방향 전용 (W >= H)
  | 'portrait'     // 세로 방향 전용 (W < H)
  | 'custom';      // 사용자 직접 범위 설정

export interface ArtboardResolutionRule {
  enabled: boolean;
  preset: ResolutionRulePreset;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'any' | 'landscape' | 'portrait';
}

export interface ArtboardPreviewResolution {
  enabled: boolean;
  width: number;
  height: number;
  presetId?: string;
}

export interface VDomArtboard {
  id: string;
  title: string;
  viewport: 'mobile' | 'tablet' | 'desktop' | 'custom';
  canvasRole?: CanvasRole;
  resolutionRule?: ArtboardResolutionRule;
  previewResolution?: ArtboardPreviewResolution;
  x: number;
  y: number;
  width: number;
  height: number;
  rootNode: VNode; // Root Virtual DOM container
  tweaksSchema: TweakDefinition[];
  tweakValues: Record<string, any>;
  visible?: boolean;
  locked?: boolean;
}
