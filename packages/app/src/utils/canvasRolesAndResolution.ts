import {
  ArtboardResolutionRule,
  CanvasRole,
  ResolutionRulePreset,
  VDomArtboard,
  VNode
} from '../types/vdom';

export interface CanvasRoleMeta {
  id: CanvasRole;
  category: 'screen' | 'overlay' | 'component';
  label: string;
  shortLabel: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  badgeClass: string;
  recommendedRulePreset: ResolutionRulePreset;
}

export const CANVAS_ROLE_OPTIONS: CanvasRoleMeta[] = [
  {
    id: 'main-page',
    category: 'screen',
    label: '메인 페이지 / 전체 화면',
    shortLabel: '메인 페이지',
    description: '헤더·히어로·본문 섹션으로 구성되는 서비스의 핵심 전체 화면 역할',
    defaultWidth: 1440,
    defaultHeight: 900,
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    recommendedRulePreset: 'all'
  },
  {
    id: 'workspace',
    category: 'screen',
    label: '워크스페이스 / 관리 대시보드',
    shortLabel: '워크스페이스',
    description: '사이드바·상단 툴바·다중 패널로 구성된 대화면 업무/관제 공간 역할',
    defaultWidth: 1600,
    defaultHeight: 1000,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    recommendedRulePreset: 'desktop-only'
  },
  {
    id: 'sub-view',
    category: 'screen',
    label: '단일 컬럼 / 모바일·서브 화면',
    shortLabel: '서브/단일 뷰',
    description: '좁은 폭이나 모바일 뷰포트에 최적화된 단일 열 집중형 화면 역할',
    defaultWidth: 390,
    defaultHeight: 844,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    recommendedRulePreset: 'mobile-only'
  },
  {
    id: 'modal',
    category: 'overlay',
    label: '모달 / 다이얼로그 팝업',
    shortLabel: '모달 팝업',
    description: '화면 중앙에 호출되어 설정, 폼 입력, 확인/경고를 수행하는 대화상자 역할',
    defaultWidth: 640,
    defaultHeight: 480,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    recommendedRulePreset: 'all'
  },
  {
    id: 'drawer',
    category: 'overlay',
    label: '사이드 드로어 / 슬라이드 패널',
    shortLabel: '사이드 드로어',
    description: '화면 좌·우측 끝에서 슬라이드 인 되는 상세 인스펙터·내비게이션 패널 역할',
    defaultWidth: 420,
    defaultHeight: 900,
    badgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    recommendedRulePreset: 'all'
  },
  {
    id: 'bottom-sheet',
    category: 'overlay',
    label: '바텀 시트 / 액션 시트',
    shortLabel: '바텀 시트',
    description: '화면 하단에서 올라와 옵션 선택·간편 결제·필터링을 처리하는 시트 역할',
    defaultWidth: 440,
    defaultHeight: 560,
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    recommendedRulePreset: 'mobile-only'
  },
  {
    id: 'popover',
    category: 'overlay',
    label: '팝오버 / 드롭다운 메뉴 / 팔레트',
    shortLabel: '팝오버·메뉴',
    description: '트리거 요소 주변에 열리는 컨텍스트 메뉴, 커맨드 팔레트, 알림 팝오버 역할',
    defaultWidth: 380,
    defaultHeight: 440,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    recommendedRulePreset: 'all'
  },
  {
    id: 'section',
    category: 'component',
    label: '부분 섹션 / 임베드 위젯 보드',
    shortLabel: '부분 섹션',
    description: '독립적인 헤더 바, 배너, 카드 그룹 등 페이지 내 삽입되는 부분 모듈 역할',
    defaultWidth: 800,
    defaultHeight: 360,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    recommendedRulePreset: 'all'
  },
  {
    id: 'custom',
    category: 'component',
    label: '자유 역할 캔버스 (Custom)',
    shortLabel: '자유 캔버스',
    description: '역할 제약 없이 사용자가 직접 정의한 가로×세로 치수로 시작하는 빈 프레임',
    defaultWidth: 1280,
    defaultHeight: 800,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    recommendedRulePreset: 'all'
  }
];

export function getCanvasRoleMeta(role?: CanvasRole): CanvasRoleMeta {
  return (
    CANVAS_ROLE_OPTIONS.find((r) => r.id === role) ||
    CANVAS_ROLE_OPTIONS[0]
  );
}

export function inferCanvasRoleFromArtboard(artboard: Pick<VDomArtboard, 'canvasRole' | 'width' | 'height' | 'title'>): CanvasRoleMeta {
  if (artboard.canvasRole) {
    return getCanvasRoleMeta(artboard.canvasRole);
  }
  const t = (artboard.title || '').toLowerCase();
  if (t.includes('주문 모달') || t.includes('시트') || t.includes('sheet')) {
    return getCanvasRoleMeta('bottom-sheet');
  }
  if (t.includes('모달') || t.includes('modal') || t.includes('다이얼로그') || t.includes('영수증') || t.includes('설정')) {
    return getCanvasRoleMeta('modal');
  }
  if (t.includes('드로어') || t.includes('drawer') || t.includes('사이드')) {
    return getCanvasRoleMeta('drawer');
  }
  if (t.includes('메뉴') || t.includes('팔레트') || t.includes('palette') || t.includes('menu')) {
    return getCanvasRoleMeta('popover');
  }
  if (t.includes('워크스페이스') || t.includes('대시보드') || artboard.width >= 1500) {
    return getCanvasRoleMeta('workspace');
  }
  if (t.includes('홈') || t.includes('home') || t.includes('메인')) {
    return getCanvasRoleMeta('main-page');
  }
  if (artboard.width <= 480 && artboard.height >= 640) {
    return getCanvasRoleMeta('sub-view');
  }
  return getCanvasRoleMeta('main-page');
}

export interface ResolutionRulePresetMeta {
  id: ResolutionRulePreset;
  label: string;
  shortBadge: string;
  description: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'any' | 'landscape' | 'portrait';
}

export const RESOLUTION_RULE_PRESETS: ResolutionRulePresetMeta[] = [
  {
    id: 'all',
    label: '모든 해상도에서 표시 (제한 없음)',
    shortBadge: '전체 해상도',
    description: '구동 해상도와 무관하게 언제나 활성화되어 표시됩니다.',
    orientation: 'any'
  },
  {
    id: 'wide-only',
    label: '와이드 대화면 전용 (가로 ≥ 1280px)',
    shortBadge: '가로 ≥ 1280px',
    description: '가로 폭이 1280px 이상인 와이드 화면에서만 이 장표를 표시합니다.',
    minWidth: 1280,
    orientation: 'any'
  },
  {
    id: 'desktop-only',
    label: '표준 대화면 전용 (가로 ≥ 1024px)',
    shortBadge: '가로 ≥ 1024px',
    description: '가로 폭이 1024px 이상인 환경에서만 이 장표를 표시합니다.',
    minWidth: 1024,
    orientation: 'any'
  },
  {
    id: 'tablet-only',
    label: '중형 / 분할 화면 전용 (가로 768 ~ 1023px)',
    shortBadge: '768~1023px',
    description: '가로 폭이 768px 이상 1023px 이하인 중형·분할 뷰에서만 표시합니다.',
    minWidth: 768,
    maxWidth: 1023,
    orientation: 'any'
  },
  {
    id: 'mobile-only',
    label: '소형 / 컴팩트 화면 전용 (가로 ≤ 767px)',
    shortBadge: '가로 ≤ 767px',
    description: '가로 폭이 767px 이하인 좁은 화면에서만 이 장표를 표시합니다.',
    maxWidth: 767,
    orientation: 'any'
  },
  {
    id: 'landscape',
    label: '가로 방향 전용 (가로 W ≥ 세로 H)',
    shortBadge: '가로형(W≥H)',
    description: '가로 너비가 세로 높이보다 크거나 같은 가로 모드에서만 표시합니다.',
    orientation: 'landscape'
  },
  {
    id: 'portrait',
    label: '세로 방향 전용 (가로 W < 세로 H)',
    shortBadge: '세로형(W<H)',
    description: '세로 높이가 가로 너비보다 큰 세로 모드에서만 표시합니다.',
    orientation: 'portrait'
  },
  {
    id: 'custom',
    label: '사용자 직접 범위 지정 (Custom W/H)',
    shortBadge: '직접 범위',
    description: '최소/최대 가로 너비(px)와 세로 높이(px) 조건을 직접 지정합니다.',
    orientation: 'any'
  }
];

export function buildResolutionRuleFromPreset(
  preset: ResolutionRulePreset,
  prev?: ArtboardResolutionRule
): ArtboardResolutionRule {
  if (preset === 'all') {
    return {
      enabled: false,
      preset: 'all',
      orientation: 'any'
    };
  }
  const found = RESOLUTION_RULE_PRESETS.find((p) => p.id === preset);
  if (preset === 'custom') {
    return {
      enabled: true,
      preset: 'custom',
      minWidth: prev?.minWidth ?? 800,
      maxWidth: prev?.maxWidth,
      minHeight: prev?.minHeight,
      maxHeight: prev?.maxHeight,
      orientation: prev?.orientation || 'any'
    };
  }
  return {
    enabled: true,
    preset,
    minWidth: found?.minWidth,
    maxWidth: found?.maxWidth,
    minHeight: found?.minHeight,
    maxHeight: found?.maxHeight,
    orientation: found?.orientation || 'any'
  };
}

export interface ResolutionEvaluationResult {
  isRestricted: boolean;
  matches: boolean;
  badgeText: string;
  summaryText: string;
  reasonText: string;
}

export function evaluateArtboardResolution(
  rule: ArtboardResolutionRule | undefined,
  targetW: number,
  targetH: number
): ResolutionEvaluationResult {
  if (!rule || !rule.enabled || rule.preset === 'all') {
    return {
      isRestricted: false,
      matches: true,
      badgeText: '모든 해상도 표시',
      summaryText: '제한 없음 (모든 구동 해상도에서 표시)',
      reasonText: `현재 해상도(${targetW}×${targetH}px)에서 정상 표시됩니다.`
    };
  }

  const parts: string[] = [];
  const failReasons: string[] = [];

  if (typeof rule.minWidth === 'number' && rule.minWidth > 0) {
    parts.push(`W ≥ ${rule.minWidth}px`);
    if (targetW < rule.minWidth) {
      failReasons.push(`가로(${targetW}px)가 최소 기준(${rule.minWidth}px)보다 작음`);
    }
  }
  if (typeof rule.maxWidth === 'number' && rule.maxWidth > 0) {
    parts.push(`W ≤ ${rule.maxWidth}px`);
    if (targetW > rule.maxWidth) {
      failReasons.push(`가로(${targetW}px)가 최대 기준(${rule.maxWidth}px)을 초과함`);
    }
  }
  if (typeof rule.minHeight === 'number' && rule.minHeight > 0) {
    parts.push(`H ≥ ${rule.minHeight}px`);
    if (targetH < rule.minHeight) {
      failReasons.push(`세로(${targetH}px)가 최소 기준(${rule.minHeight}px)보다 작음`);
    }
  }
  if (typeof rule.maxHeight === 'number' && rule.maxHeight > 0) {
    parts.push(`H ≤ ${rule.maxHeight}px`);
    if (targetH > rule.maxHeight) {
      failReasons.push(`세로(${targetH}px)가 최대 기준(${rule.maxHeight}px)을 초과함`);
    }
  }
  if (rule.orientation === 'landscape') {
    parts.push('가로형(W≥H)');
    if (targetW < targetH) {
      failReasons.push(`세로 방향(${targetW}×${targetH})이므로 가로형 조건 불충족`);
    }
  } else if (rule.orientation === 'portrait') {
    parts.push('세로형(W<H)');
    if (targetW >= targetH) {
      failReasons.push(`가로 방향(${targetW}×${targetH})이므로 세로형 조건 불충족`);
    }
  }

  const summaryText = parts.length > 0 ? parts.join(' · ') : '모든 해상도 표시';
  const presetMeta = RESOLUTION_RULE_PRESETS.find((p) => p.id === rule.preset);
  const badgeText =
    rule.preset !== 'custom' && presetMeta
      ? presetMeta.shortBadge
      : summaryText;

  const matches = failReasons.length === 0;
  const reasonText = matches
    ? `현재 구동 해상도(${targetW}×${targetH}px)가 표시 조건(${summaryText})을 충족하여 화면에 표시됩니다.`
    : `현재 구동 해상도(${targetW}×${targetH}px)에서는 숨김 처리됩니다 — ${failReasons.join(', ')}`;

  return {
    isRestricted: true,
    matches,
    badgeText,
    summaryText,
    reasonText
  };
}

export interface EditorPreviewResolutionOption {
  id: string;
  label: string;
  width: number;
  height: number;
  group: string;
}

export const EDITOR_PREVIEW_RESOLUTIONS: EditorPreviewResolutionOption[] = [
  { id: '1920x1080', label: '1920 × 1080 (FHD 와이드)', width: 1920, height: 1080, group: '대화면 / 와이드' },
  { id: '1600x1000', label: '1600 × 1000 (워크스페이스 16:10)', width: 1600, height: 1000, group: '대화면 / 와이드' },
  { id: '1440x900', label: '1440 × 900 (표준 메인 화면)', width: 1440, height: 900, group: '대화면 / 와이드' },
  { id: '1280x800', label: '1280 × 800 (컴팩트 웹 화면)', width: 1280, height: 800, group: '대화면 / 와이드' },
  { id: '1024x768', label: '1024 × 768 (중형 가로 화면)', width: 1024, height: 768, group: '중형 / 분할 뷰' },
  { id: '834x1194', label: '834 × 1194 (중형 세로 화면)', width: 834, height: 1194, group: '중형 / 분할 뷰' },
  { id: '768x1024', label: '768 × 1024 (표준 분할 세로)', width: 768, height: 1024, group: '중형 / 분할 뷰' },
  { id: '640x480', label: '640 × 480 (표준 모달 / 팝업)', width: 640, height: 480, group: '오버레이 / 소형 뷰' },
  { id: '430x932', label: '430 × 932 (소형 와이드 세로)', width: 430, height: 932, group: '오버레이 / 소형 뷰' },
  { id: '390x844', label: '390 × 844 (소형 표준 세로)', width: 390, height: 844, group: '오버레이 / 소형 뷰' },
  { id: '360x640', label: '360 × 640 (소형 최소 세로)', width: 360, height: 640, group: '오버레이 / 소형 뷰' }
];

export function createRoleStarterVNode(
  role: CanvasRole,
  title: string,
  width: number,
  height: number,
  templateMode: 'role-default' | 'blank' = 'role-default'
): VNode {
  const ts = Date.now();

  if (templateMode === 'blank') {
    return {
      id: `node-${ts}-root`,
      type: 'frame',
      name: `${title} Root`,
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#0f172a'
      },
      children: [
        {
          id: `node-${ts}-title`,
          type: 'heading',
          name: 'Frame Title',
          content: title,
          style: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' }
        },
        {
          id: `node-${ts}-sub`,
          type: 'text',
          name: 'Subtitle',
          content: `${getCanvasRoleMeta(role).label} (${width} × ${height}px)`,
          style: { fontSize: 12, color: '#64748b' }
        }
      ]
    };
  }

  if (role === 'modal') {
    return {
      id: `node-${ts}-root`,
      type: 'frame',
      name: 'Modal Dialog Frame',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      children: [
        {
          id: `node-${ts}-dialog`,
          type: 'card',
          name: 'Modal Surface Card',
          style: {
            width: '100%',
            maxWidth: 560,
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.45)'
          },
          children: [
            {
              id: `node-${ts}-hdr`,
              type: 'box',
              name: 'Modal Header',
              style: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
              children: [
                { id: `node-${ts}-t`, type: 'heading', name: 'Modal Title', content: title, style: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' } },
                { id: `node-${ts}-badge`, type: 'badge', name: 'Role Badge', content: 'MODAL DIALOG', style: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '4px 8px', borderRadius: 6 } }
              ]
            },
            {
              id: `node-${ts}-desc`,
              type: 'text',
              name: 'Modal Description',
              content: '이 캔버스는 화면 중앙에 호출되는 모달 다이얼로그 역할을 수행합니다. 구동 해상도를 변경하여 반응형 여백을 테스트해 보세요.',
              style: { fontSize: 13, color: '#475569', lineHeight: 1.5 }
            },
            {
              id: `node-${ts}-actions`,
              type: 'box',
              name: 'Modal Footer Actions',
              style: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 8 },
              children: [
                { id: `node-${ts}-cancel`, type: 'button', name: 'Cancel Button', content: '취소', style: { padding: '10px 16px', borderRadius: 10, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 12, fontWeight: 'bold' } },
                { id: `node-${ts}-confirm`, type: 'button', name: 'Confirm Button', content: '확인 및 저장', style: { padding: '10px 18px', borderRadius: 10, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 12, fontWeight: 'bold' } }
              ]
            }
          ]
        }
      ]
    };
  }

  if (role === 'drawer') {
    return {
      id: `node-${ts}-root`,
      type: 'frame',
      name: 'Side Drawer Frame',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        borderLeftWidth: 1,
        borderLeftColor: '#e2e8f0',
        borderLeftStyle: 'solid',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },
      children: [
        {
          id: `node-${ts}-top`,
          type: 'box',
          name: 'Drawer Top Content',
          style: { display: 'flex', flexDirection: 'column', gap: 14 },
          children: [
            {
              id: `node-${ts}-hdr`,
              type: 'box',
              name: 'Drawer Header',
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', borderBottomStyle: 'solid' },
              children: [
                { id: `node-${ts}-t`, type: 'heading', name: 'Drawer Title', content: title, style: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' } },
                { id: `node-${ts}-b`, type: 'badge', name: 'Drawer Badge', content: 'SIDE DRAWER', style: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#fae8ff', color: '#a21caf', padding: '3px 8px', borderRadius: 6 } }
              ]
            },
            {
              id: `node-${ts}-card1`,
              type: 'card',
              name: 'Drawer Section Card',
              style: { padding: 14, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', display: 'flex', flexDirection: 'column', gap: 6 },
              children: [
                { id: `node-${ts}-c1-t`, type: 'text', name: 'Section Label', content: '상세 속성 및 컨텍스트 정보', style: { fontSize: 12, fontWeight: 'bold', color: '#1e293b' } },
                { id: `node-${ts}-c1-d`, type: 'text', name: 'Section Body', content: '우측 또는 좌측에서 슬라이드 인 되는 드로어 패널 레이아웃입니다.', style: { fontSize: 11, color: '#64748b' } }
              ]
            }
          ]
        },
        {
          id: `node-${ts}-cta`,
          type: 'button',
          name: 'Drawer Primary Action',
          content: '변경사항 적용하기',
          style: { width: '100%', padding: 12, borderRadius: 10, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }
        }
      ]
    };
  }

  if (role === 'bottom-sheet') {
    return {
      id: `node-${ts}-root`,
      type: 'frame',
      name: 'Bottom Sheet Frame',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#090d16',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      },
      children: [
        {
          id: `node-${ts}-sheet`,
          type: 'card',
          name: 'Bottom Sheet Container',
          style: {
            width: '100%',
            backgroundColor: '#1e293b',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          },
          children: [
            { id: `node-${ts}-handle`, type: 'box', name: 'Grabber Handle', style: { width: 44, height: 5, borderRadius: 9999, backgroundColor: '#475569', margin: '0 auto' } },
            { id: `node-${ts}-t`, type: 'heading', name: 'Sheet Title', content: title, style: { fontSize: 17, fontWeight: 'bold', color: '#ffffff' } },
            { id: `node-${ts}-desc`, type: 'text', name: 'Sheet Subtitle', content: '하단에서 올라오는 액션 시트 캔버스입니다.', style: { fontSize: 12, color: '#94a3b8' } },
            { id: `node-${ts}-btn`, type: 'button', name: 'Sheet CTA', content: '선택 완료', style: { width: '100%', padding: 14, borderRadius: 12, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', fontSize: 13, textAlign: 'center' } }
          ]
        }
      ]
    };
  }

  if (role === 'popover') {
    return {
      id: `node-${ts}-root`,
      type: 'frame',
      name: 'Popover / Menu Frame',
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      },
      children: [
        {
          id: `node-${ts}-search`,
          type: 'input',
          name: 'Menu Search Input',
          content: '명령어 또는 메뉴 검색...',
          style: { width: '100%', padding: '8px 12px', borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', fontSize: 12, color: '#334155' }
        },
        {
          id: `node-${ts}-item1`,
          type: 'box',
          name: 'Active Menu Item',
          style: { padding: '8px 10px', borderRadius: 8, backgroundColor: '#eef2ff', color: '#4338ca', fontSize: 12, fontWeight: 'bold' },
          content: `● ${title} — 기본 항목 1`
        },
        {
          id: `node-${ts}-item2`,
          type: 'box',
          name: 'Menu Item 2',
          style: { padding: '8px 10px', borderRadius: 8, color: '#334155', fontSize: 12 },
          content: '빠른 실행 액션 2'
        }
      ]
    };
  }

  // Default for main-page, workspace, sub-view, section, custom
  return {
    id: `node-${ts}-root`,
    type: 'frame',
    name: `${title} Frame Root`,
    style: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f8fafc',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      color: '#0f172a'
    },
    children: [
      {
        id: `node-${ts}-hdr`,
        type: 'box',
        name: 'Top Header Bar',
        style: {
          width: '100%',
          padding: 16,
          borderRadius: 14,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        },
        children: [
          { id: `node-${ts}-title`, type: 'heading', name: 'Screen Title', content: title, style: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' } },
          { id: `node-${ts}-role`, type: 'badge', name: 'Canvas Role Badge', content: getCanvasRoleMeta(role).shortLabel, style: { fontSize: 11, fontWeight: 'bold', backgroundColor: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: 9999 } }
        ]
      },
      {
        id: `node-${ts}-body`,
        type: 'card',
        name: 'Main Content Area',
        style: {
          flex: 1,
          width: '100%',
          padding: 20,
          borderRadius: 16,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8
        },
        children: [
          { id: `node-${ts}-b1`, type: 'text', name: 'Role Info', content: `${getCanvasRoleMeta(role).label} (${width} × ${height}px)`, style: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' } },
          { id: `node-${ts}-b2`, type: 'text', name: 'Resolution Guide', content: '상단 헤더나 우측 속성 패널에서 구동 해상도를 전환하여 해상도별 레이아웃과 표시 여부를 실시간 미리보기할 수 있습니다.', style: { fontSize: 12, color: '#64748b', textAlign: 'center' } }
        ]
      }
    ]
  };
}
