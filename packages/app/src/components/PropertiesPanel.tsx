import React, { useState, useEffect } from 'react';
import {
  Layout,
  Type,
  Palette,
  Trash2,
  Box,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  SunMedium,
  Shield,
  Image as ImageIcon,
  ScrollText,
  MessageSquare,
  Maximize2,
  FolderOpen,
  RotateCw,
  Monitor,
  Smartphone,
  Tablet,
  WrapText
} from 'lucide-react';
import { VDomArtboard, VNode, VNodeStyle } from '../types/vdom';
import { VisibilityConditionSection } from './VisibilityConditionSection';
import {
  chooseAndCopyImageFile,
  applyPresetImage,
  IMAGE_PRESETS
} from '../utils/assetManager';
import { GradientControls, GradientType } from './GradientControls';

export const MIN_ARTBOARD_WIDTH = 200;
export const MIN_ARTBOARD_HEIGHT = 200;

const COLOR_SWATCHES = [
  { name: '투명', val: 'transparent', bg: 'bg-transparent border border-dashed border-slate-400' },
  { name: '다크', val: '#0f172a', bg: 'bg-slate-950' },
  { name: '슬레이트', val: '#1e293b', bg: 'bg-slate-800' },
  { name: '그레이', val: '#64748b', bg: 'bg-slate-500' },
  { name: '화이트', val: '#ffffff', bg: 'bg-white border border-slate-300' },
  { name: '인디고', val: '#4f46e5', bg: 'bg-indigo-600' },
  { name: '바이올렛', val: '#8b5cf6', bg: 'bg-purple-500' },
  { name: '핑크', val: '#ec4899', bg: 'bg-pink-500' },
  { name: '시안', val: '#06b6d4', bg: 'bg-cyan-500' },
  { name: '에메랄드', val: '#10b981', bg: 'bg-emerald-500' },
  { name: '앰버', val: '#f59e0b', bg: 'bg-amber-500' },
  { name: '로즈', val: '#ef4444', bg: 'bg-rose-500' }
];

interface PropertiesPanelProps {
  artboard: VDomArtboard | null;
  selectedNode: VNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<VNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateArtboard?: (updates: Partial<VDomArtboard>) => void;
  onSwitchToTweaksTab?: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  artboard,
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onUpdateArtboard,
  onSwitchToTweaksTab
}) => {
  const [sectionFilter, setSectionFilter] = useState<'all' | 'layout' | 'typography' | 'style'>('all');
  const [isChoosingAsset, setIsChoosingAsset] = useState(false);
  const [use4WayPadding, setUse4WayPadding] = useState(false);
  const [use4WayRadius, setUse4WayRadius] = useState(false);
  const [colorTarget, setColorTarget] = useState<'bg' | 'text'>('bg');
  const [activeGradientType, setActiveGradientType] = useState<GradientType>(null);
  const [isEditorDismissed, setIsEditorDismissed] = useState(false);

  useEffect(() => {
    setIsEditorDismissed(false);
  }, [selectedNode?.id]);

  if (!artboard) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        선택된 아트보드가 없습니다.
      </div>
    );
  }

  // Artboard Frame Dimension Controls (shown when no child node is selected OR when frame root is selected)
  const renderArtboardFrameControls = () => (
    <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 truncate">
          <Monitor size={13} className="text-indigo-600 shrink-0" />
          <span className="truncate">프레임(아트보드) 해상도 & 최소 크기</span>
        </div>
        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold shrink-0">
          {artboard.width} × {artboard.height}
        </span>
      </div>

      {/* Artboard Title */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 font-semibold block">아트보드 제목</label>
        <input
          type="text"
          value={artboard.title}
          onChange={(e) => onUpdateArtboard?.({ title: e.target.value })}
          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Direct Width x Height Inputs with Swap & Min Size Policy (min 200x200) */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-1.5">
        <div className="space-y-1 min-w-0">
          <label className="text-[10px] text-slate-500 font-semibold block truncate">가로 너비 (W, px)</label>
          <input
            type="number"
            min={MIN_ARTBOARD_WIDTH}
            max={7680}
            value={artboard.width}
            onChange={(e) => {
              const val = Math.max(MIN_ARTBOARD_WIDTH, Number(e.target.value) || MIN_ARTBOARD_WIDTH);
              onUpdateArtboard?.({ width: val });
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="button"
          onClick={() => onUpdateArtboard?.({ width: artboard.height, height: artboard.width })}
          className="p-1.5 mb-0.5 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 text-slate-500 hover:text-indigo-600 transition shrink-0"
          title="가로 ↔ 세로 해상도 맞바꾸기 (회전)"
        >
          <RotateCw size={12} />
        </button>

        <div className="space-y-1 min-w-0">
          <label className="text-[10px] text-slate-500 font-semibold block truncate">세로 높이 (H, px)</label>
          <input
            type="number"
            min={MIN_ARTBOARD_HEIGHT}
            max={7680}
            value={artboard.height}
            onChange={(e) => {
              const val = Math.max(MIN_ARTBOARD_HEIGHT, Number(e.target.value) || MIN_ARTBOARD_HEIGHT);
              onUpdateArtboard?.({ height: val });
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Quick Frame Resolution Presets */}
      <div className="space-y-1">
        <span className="text-[9px] text-slate-400 font-semibold block">표준 해상도 빠른 적용 (최소 크기: 200×200px)</span>
        <div className="grid grid-cols-3 gap-1">
          {[
            { label: '모바일 393×852', w: 393, h: 852, vp: 'mobile' as const },
            { label: '태블릿 834×1194', w: 834, h: 1194, vp: 'tablet' as const },
            { label: '랩톱 1440×900', w: 1440, h: 900, vp: 'desktop' as const },
            { label: '스튜디오 1600×1000', w: 1600, h: 1000, vp: 'desktop' as const },
            { label: 'FHD 1920×1080', w: 1920, h: 1080, vp: 'desktop' as const },
            { label: '컴팩트 375×667', w: 375, h: 667, vp: 'mobile' as const }
          ].map((preset) => {
            const isCurr = artboard.width === preset.w && artboard.height === preset.h;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onUpdateArtboard?.({ width: preset.w, height: preset.h, viewport: preset.vp })}
                className={`px-1.5 py-1 rounded text-[10px] font-medium truncate whitespace-nowrap transition border ${
                  isCurr
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
                title={`${preset.w} × ${preset.h} px`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (!selectedNode) {
    return (
      <div className="p-3.5 space-y-4 text-xs text-slate-700 select-none">
        {renderArtboardFrameControls()}

        <div className="p-6 text-center text-slate-400 text-xs space-y-2 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <Box size={22} className="mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600">개별 요소가 선택되지 않았습니다</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            위에서 프레임 전체 해상도를 직접 변경하거나, 캔버스/레이어 트리에서 편집할 요소를 클릭하세요.
          </p>
        </div>
      </div>
    );
  }

  const handleStyleChange = (key: keyof VNodeStyle, value: any) => {
    const nextStyle = { ...selectedNode.style, [key]: value };
    onUpdateNode(selectedNode.id, { style: nextStyle });
  };

  const handleBatchStyleChange = (updates: Partial<VNodeStyle> & Record<string, any>) => {
    const nextStyle = { ...selectedNode.style, ...updates };
    for (const key of Object.keys(updates)) {
      if (updates[key] === undefined) {
        delete (nextStyle as any)[key];
      }
    }
    if (updates.backgroundImage !== undefined) {
      delete (nextStyle as any).backgroundGradient;
    }
    onUpdateNode(selectedNode.id, { style: nextStyle });
  };

  const handlePropsChange = (key: string, value: any) => {
    const nextProps = { ...(selectedNode.props || {}), [key]: value };
    onUpdateNode(selectedNode.id, { props: nextProps });
  };

  const handleChooseImageFile = async () => {
    setIsChoosingAsset(true);
    try {
      const asset = await chooseAndCopyImageFile();
      if (asset) {
        onUpdateNode(selectedNode.id, {
          content: asset.relativePath,
          props: {
            ...(selectedNode.props || {}),
            src: asset.relativePath,
            dataUrl: asset.dataUrl
          }
        });
      }
    } finally {
      setIsChoosingAsset(false);
    }
  };

  const handleApplyPreset = async (presetId: string) => {
    const asset = await applyPresetImage(presetId);
    if (asset) {
      onUpdateNode(selectedNode.id, {
        content: asset.relativePath,
        props: {
          ...(selectedNode.props || {}),
          src: asset.relativePath,
          dataUrl: asset.dataUrl
        }
      });
    }
  };

  const handleChooseBackgroundImageFile = async () => {
    setIsChoosingAsset(true);
    try {
      const asset = await chooseAndCopyImageFile();
      if (asset) {
        handleBatchStyleChange({
          backgroundImage: asset.relativePath,
          backgroundImageDataUrl: asset.dataUrl,
          backgroundGradient: undefined
        });
        setActiveGradientType(null);
      }
    } finally {
      setIsChoosingAsset(false);
    }
  };

  const handleApplyBackgroundPreset = async (presetId: string) => {
    const asset = await applyPresetImage(presetId);
    if (asset) {
      handleBatchStyleChange({
        backgroundImage: asset.relativePath,
        backgroundImageDataUrl: asset.dataUrl,
        backgroundGradient: undefined
      });
      setActiveGradientType(null);
    }
  };

  const currentBg = selectedNode?.style?.backgroundImage || selectedNode?.style?.backgroundGradient || '';

  const effectiveGradientType: GradientType = !isEditorDismissed
    ? activeGradientType ||
      (currentBg.includes('radial-gradient')
        ? 'dark-mesh'
        : currentBg.includes('linear-gradient')
        ? 'linear-neon'
        : null)
    : activeGradientType;

  const handlePatternClick = (pattern: { name: string; url: string }) => {
    handleBatchStyleChange({
      backgroundImage: pattern.url,
      backgroundImageDataUrl: undefined,
      backgroundGradient: undefined
    });
    setIsEditorDismissed(false);
    if (pattern.name === '네온 그라데이션') {
      setActiveGradientType('linear-neon');
    } else if (pattern.name === '다크 메쉬') {
      setActiveGradientType('dark-mesh');
    } else {
      setActiveGradientType(null);
    }
  };

  const isFrameRoot = selectedNode.type === 'frame' && selectedNode.id === artboard.rootNode.id;
  const isImage = selectedNode.type === 'image';
  const isDialog = selectedNode.type === 'dialog';
  const isScroll = selectedNode.type === 'scroll-container';
  const isTextLike = ['text', 'heading', 'span', 'blockquote', 'code', 'label', 'button', 'badge', 'input', 'textarea'].includes(selectedNode.type);
  const isContainerLike = ['frame', 'container', 'card', 'box', 'section', 'header', 'footer', 'nav', 'aside', 'main', 'scroll-container', 'dialog', 'button'].includes(
    selectedNode.type
  );

  const showLayoutSection = sectionFilter === 'all' || sectionFilter === 'layout';
  const showTypographySection = sectionFilter === 'all' || sectionFilter === 'typography';
  const showStyleSection = sectionFilter === 'all' || sectionFilter === 'style';

  const SAMPLE_BACKGROUND_PATTERNS = [
    { name: '네온 그라데이션', url: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
    { name: '다크 메쉬', url: 'radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 100% 100%, #311042 0px, transparent 50%)' },
    { name: '텍스처 배경', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80' }
  ];

  // Determine current text overflow policy mode for quick pills
  const isSingleLineEllipsis =
    selectedNode.style.textOverflow === 'ellipsis' &&
    selectedNode.style.whiteSpace === 'nowrap' &&
    !selectedNode.style.lineClamp;
  const isMultiLineClamp = Boolean(selectedNode.style.lineClamp && selectedNode.style.lineClamp >= 2);
  const isNoWrapOnly =
    selectedNode.style.whiteSpace === 'nowrap' && selectedNode.style.textOverflow !== 'ellipsis';

  return (
    <div className="p-3.5 space-y-4 text-xs text-slate-700 select-none divide-y divide-slate-100 overflow-y-auto max-h-full min-w-0">
      {/* Frame Root Dimension Controls if Root Frame is selected */}
      {isFrameRoot && renderArtboardFrameControls()}

      {/* 0. Visibility Condition Settings Section */}
      <VisibilityConditionSection
        artboard={artboard}
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onSwitchToTweaksTab={onSwitchToTweaksTab}
      />

      {/* 1. Node Header, Content & Section Filter Bar */}
      <div className="space-y-2.5 pt-3">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wider truncate">
            {isImage ? (
              <ImageIcon size={14} className="text-pink-500 shrink-0" />
            ) : isDialog ? (
              <MessageSquare size={14} className="text-emerald-500 shrink-0" />
            ) : isScroll ? (
              <ScrollText size={14} className="text-amber-500 shrink-0" />
            ) : (
              <Box size={14} className="text-indigo-600 shrink-0" />
            )}
            <span className="truncate">&lt;{selectedNode.type}&gt; 요소 속성</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[90px]" title={selectedNode.id}>
              #{selectedNode.id}
            </span>
            {selectedNode.type !== 'frame' && (
              <button
                onClick={() => onDeleteNode(selectedNode.id)}
                className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition"
                title="노드 삭제 (Delete)"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Node Name & Content Inputs */}
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block truncate">레이어 명칭 (Name)</label>
            <input
              type="text"
              value={selectedNode.name}
              onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {!isImage && (selectedNode.content !== undefined || isTextLike) && (
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase block truncate">표시 텍스트 내용 (Content)</label>
              <input
                type="text"
                value={selectedNode.content || ''}
                placeholder="텍스트 내용을 입력하세요..."
                onChange={(e) => onUpdateNode(selectedNode.id, { content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Section Filter Segmented Bar */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
          {[
            { id: 'all' as const, label: '전체' },
            { id: 'layout' as const, label: '크기·배치' },
            { id: 'typography' as const, label: '글자·넘침' },
            { id: 'style' as const, label: '색상·효과' }
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSectionFilter(sec.id)}
              className={`py-1 px-1.5 rounded-md text-[10px] whitespace-nowrap truncate transition ${
                sectionFilter === sec.id
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Quick Alignment Matrix */}
        {showLayoutSection && (
          <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold pl-1 whitespace-nowrap">위치 정렬</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => handleStyleChange('alignSelf', 'flex-start')}
                title="좌측 정렬"
                className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignLeft size={11} />
              </button>
              <button
                onClick={() => handleStyleChange('alignSelf', 'center')}
                title="가로 중앙 정렬"
                className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignCenter size={11} />
              </button>
              <button
                onClick={() => handleStyleChange('alignSelf', 'flex-end')}
                title="우측 정렬"
                className="p-1 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignRight size={11} />
              </button>
              <div className="w-px h-3 bg-slate-300 mx-0.5" />
              <button
                onClick={() => handleStyleChange('marginTop', 0)}
                title="상단 정렬"
                className="px-1.5 py-0.5 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition text-[9px] font-bold"
              >
                상
              </button>
              <button
                onClick={() => {
                  handleStyleChange('marginTop', 'auto');
                  handleStyleChange('marginBottom', 'auto');
                }}
                title="세로 중앙 정렬"
                className="px-1.5 py-0.5 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition text-[9px] font-bold"
              >
                중
              </button>
              <button
                onClick={() => {
                  handleStyleChange('marginTop', 'auto');
                  handleStyleChange('marginBottom', 0);
                }}
                title="하단 정렬"
                className="px-1.5 py-0.5 hover:bg-white rounded text-slate-600 hover:text-indigo-600 transition text-[9px] font-bold"
              >
                하
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. UNIVERSAL: Dimensions, Minimum Size Policy & Spacing */}
      {showLayoutSection && (
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 truncate">
              <Maximize2 size={11} className="shrink-0 text-indigo-600" />
              <span className="truncate">크기, 최소 크기 정책 & 여백 (Dimensions & Min Size)</span>
            </label>
            <button
              onClick={() => setUse4WayPadding(!use4WayPadding)}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold whitespace-nowrap shrink-0"
            >
              {use4WayPadding ? '단일 여백' : '4방향 분할'}
            </button>
          </div>

          {/* Width & Height */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 min-w-0">
              <span className="text-[10px] text-slate-500 block truncate">너비 (Width)</span>
              <input
                type="text"
                value={selectedNode.style.width ?? ''}
                placeholder="auto / 100%"
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  handleStyleChange('width', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                }}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-mono"
              />
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 min-w-0">
              <span className="text-[10px] text-slate-500 block truncate">높이 (Height)</span>
              <input
                type="text"
                value={selectedNode.style.height ?? ''}
                placeholder="auto"
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  handleStyleChange('height', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                }}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-mono"
              />
            </div>
          </div>

          {/* Min Width / Min Height / Max Width / Max Height Policy Box */}
          <div className="p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-900">최소 / 최대 크기 보장 정책 (Min / Max Size)</span>
              <button
                type="button"
                onClick={() =>
                  handleBatchStyleChange({
                    minWidth: undefined,
                    minHeight: undefined,
                    maxWidth: undefined,
                    maxHeight: undefined
                  })
                }
                className="text-[9px] text-slate-400 hover:text-rose-500"
              >
                초기화
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">최소 너비 (Min W)</span>
                <input
                  type="text"
                  value={selectedNode.style.minWidth ?? ''}
                  placeholder="예: 120px, 0"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    handleStyleChange('minWidth', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono"
                />
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">최소 높이 (Min H)</span>
                <input
                  type="text"
                  value={selectedNode.style.minHeight ?? ''}
                  placeholder="예: 36px"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    handleStyleChange('minHeight', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono"
                />
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">최대 너비 (Max W)</span>
                <input
                  type="text"
                  value={selectedNode.style.maxWidth ?? ''}
                  placeholder="예: 100%, 480px"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    handleStyleChange('maxWidth', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono"
                />
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">최대 높이 (Max H)</span>
                <input
                  type="text"
                  value={selectedNode.style.maxHeight ?? ''}
                  placeholder="예: 320px"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = Number(raw);
                    handleStyleChange('maxHeight', raw === '' ? undefined : !isNaN(num) && raw.trim() !== '' ? num : raw);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-mono"
                />
              </div>
            </div>

            {/* Quick Min-Size Presets */}
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Flex 축소 허용 (min-w:0)', mw: 0, mh: undefined },
                { label: '버튼 최소 (80×36)', mw: 80, mh: 36 },
                { label: '모바일 터치 (44×44)', mw: 44, mh: 44 },
                { label: '입력창 최소 (160×38)', mw: 160, mh: 38 },
                { label: '사이드바 최소 (280)', mw: 280, mh: undefined },
                { label: '카드 최소 (240×120)', mw: 240, mh: 120 }
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleBatchStyleChange({ minWidth: p.mw, minHeight: p.mh })}
                  className="px-1.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-slate-600 border border-slate-200 rounded text-[9px] font-medium truncate whitespace-nowrap transition"
                  title={p.label}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Box Overflow Policy */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500 font-semibold whitespace-nowrap">영역 넘침 (Overflow)</span>
            <div className="grid grid-cols-4 gap-1 flex-1 max-w-[210px]">
              {[
                { val: 'visible', label: '표시' },
                { val: 'hidden', label: '숨김' },
                { val: 'auto', label: '자동스크롤' },
                { val: 'scroll', label: '스크롤' }
              ].map((ov) => (
                <button
                  key={ov.val}
                  type="button"
                  onClick={() => handleStyleChange('overflow', ov.val as any)}
                  className={`py-1 px-1 rounded text-[9px] whitespace-nowrap truncate transition ${
                    (selectedNode.style.overflow || 'visible') === ov.val
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {ov.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Way Independent Padding Controls */}
          {use4WayPadding ? (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[10px] text-slate-500 block font-semibold">4방향 개별 내부 여백 (Top / Right / Bottom / Left)</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { k: 'paddingTop', l: '상 (T)' },
                  { k: 'paddingRight', l: '우 (R)' },
                  { k: 'paddingBottom', l: '하 (B)' },
                  { k: 'paddingLeft', l: '좌 (L)' }
                ].map((p) => (
                  <div key={p.k} className="text-center">
                    <span className="text-[9px] text-slate-400 block mb-0.5">{p.l}</span>
                    <input
                      type="number"
                      value={Number(selectedNode.style[p.k as keyof VNodeStyle] || 0)}
                      onChange={(e) => handleStyleChange(p.k as keyof VNodeStyle, Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block">내부 여백 ({selectedNode.style.padding || 0}px)</span>
                <input
                  type="range"
                  min={0}
                  max={64}
                  value={Number(selectedNode.style.padding) || 0}
                  onChange={(e) => handleStyleChange('padding', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 cursor-pointer"
                />
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block">외부 여백 ({selectedNode.style.margin || 0}px)</span>
                <input
                  type="range"
                  min={0}
                  max={64}
                  value={Number(selectedNode.style.margin) || 0}
                  onChange={(e) => handleStyleChange('margin', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Container Flexbox Direction & Visual Alignment Matrix */}
      {showLayoutSection && isContainerLike && (
        <div className="space-y-2 pt-3">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layout size={11} className="text-indigo-600" />
              <span>컨테이너 배치 행렬 (Auto Flex Layout)</span>
            </span>
            <span className="text-[9px] font-mono text-indigo-600 font-bold">3×3 Grid</span>
          </label>

          {/* Direction: Row vs Column */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => handleStyleChange('flexDirection', 'row')}
              className={`flex-1 py-1 text-center rounded text-[10px] font-semibold transition whitespace-nowrap ${
                (selectedNode.style.flexDirection || 'row') === 'row'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              가로 배치 (Row ↔)
            </button>
            <button
              onClick={() => handleStyleChange('flexDirection', 'column')}
              className={`flex-1 py-1 text-center rounded text-[10px] font-semibold transition whitespace-nowrap ${
                selectedNode.style.flexDirection === 'column'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              세로 배치 (Column ↕)
            </button>
          </div>

          {/* 3x3 Visual Alignment Matrix */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] text-slate-500 block">내부 자식 정렬</span>
              <div className="text-[9px] font-mono text-slate-400 truncate">
                {selectedNode.style.justifyContent || 'flex-start'} / {selectedNode.style.alignItems || 'flex-start'}
              </div>
              <div className="flex gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    handleBatchStyleChange({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    })
                  }
                  className={`px-1.5 py-0.5 rounded text-[9px] border transition ${
                    selectedNode.style.justifyContent === 'space-between'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  양끝 정렬 (space-between)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1.5 rounded-lg shrink-0">
              {[
                { j: 'flex-start', a: 'flex-start', title: 'Top Left' },
                { j: 'center', a: 'flex-start', title: 'Top Center' },
                { j: 'flex-end', a: 'flex-start', title: 'Top Right' },
                { j: 'flex-start', a: 'center', title: 'Center Left' },
                { j: 'center', a: 'center', title: 'Center' },
                { j: 'flex-end', a: 'center', title: 'Center Right' },
                { j: 'flex-start', a: 'flex-end', title: 'Bottom Left' },
                { j: 'center', a: 'flex-end', title: 'Bottom Center' },
                { j: 'flex-end', a: 'flex-end', title: 'Bottom Right' }
              ].map((m, idx) => {
                const isSelected =
                  (selectedNode.style.justifyContent || 'flex-start') === m.j &&
                  (selectedNode.style.alignItems || 'flex-start') === m.a;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onUpdateNode(selectedNode.id, {
                        style: {
                          ...selectedNode.style,
                          display: selectedNode.style.display || 'flex',
                          justifyContent: m.j as any,
                          alignItems: m.a as any
                        }
                      });
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center transition ${
                      isSelected ? 'bg-indigo-600 shadow-xs' : 'bg-white hover:bg-slate-100'
                    }`}
                    title={m.title}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gap Slider */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>요소 간격 (Gap)</span>
              <span className="font-mono">{selectedNode.style.gap || 0}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={48}
              value={Number(selectedNode.style.gap) || 0}
              onChange={(e) => handleStyleChange('gap', Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 4. Typography & Text Overflow Policy (글자 넘침 정책 & 서체 설정) */}
      {showTypographySection && (
        <div className="space-y-2.5 pt-3">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <WrapText size={11} className="text-indigo-600" />
            <span>글자 넘침 정책 & 줄바꿈 (Text Overflow Policy)</span>
          </label>

          {/* 1-Click Text Overflow Policy Presets */}
          <div className="p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
            <span className="text-[10px] font-bold text-indigo-900 block">
              표준 글자 넘침 정책 프리셋 (Text Overflow Rules)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleBatchStyleChange({
                    whiteSpace: 'normal',
                    textOverflow: undefined,
                    wordBreak: 'keep-all',
                    lineClamp: undefined
                  })
                }
                className={`p-1.5 rounded-lg border text-left transition ${
                  !isSingleLineEllipsis && !isMultiLineClamp && !isNoWrapOnly
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                }`}
              >
                <div className="text-[10px] truncate">단어 단위 줄바꿈 (권장)</div>
                <div className={`text-[9px] font-mono truncate ${!isSingleLineEllipsis && !isMultiLineClamp && !isNoWrapOnly ? 'text-indigo-100' : 'text-slate-400'}`}>
                  keep-all · normal
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleBatchStyleChange({
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineClamp: undefined
                  })
                }
                className={`p-1.5 rounded-lg border text-left transition ${
                  isSingleLineEllipsis
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                }`}
              >
                <div className="text-[10px] truncate">1줄 말줄임표 (...)</div>
                <div className={`text-[9px] font-mono truncate ${isSingleLineEllipsis ? 'text-indigo-100' : 'text-slate-400'}`}>
                  nowrap + ellipsis
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleBatchStyleChange({
                    whiteSpace: 'normal',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineClamp: 2
                  })
                }
                className={`p-1.5 rounded-lg border text-left transition ${
                  isMultiLineClamp
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                }`}
              >
                <div className="text-[10px] truncate">다중 라인 말줄임 (2줄)</div>
                <div className={`text-[9px] font-mono truncate ${isMultiLineClamp ? 'text-indigo-100' : 'text-slate-400'}`}>
                  line-clamp: {selectedNode.style.lineClamp || 2}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleBatchStyleChange({
                    whiteSpace: 'nowrap',
                    textOverflow: undefined,
                    lineClamp: undefined
                  })
                }
                className={`p-1.5 rounded-lg border text-left transition ${
                  isNoWrapOnly
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50'
                }`}
              >
                <div className="text-[10px] truncate">한 줄 고정 (줄바꿈 금지)</div>
                <div className={`text-[9px] font-mono truncate ${isNoWrapOnly ? 'text-indigo-100' : 'text-slate-400'}`}>
                  white-space: nowrap
                </div>
              </button>
            </div>

            {/* Fine-grained WhiteSpace / TextOverflow / WordBreak / LineClamp selectors */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">줄바꿈 (White Space)</span>
                <select
                  value={selectedNode.style.whiteSpace || 'normal'}
                  onChange={(e) => handleStyleChange('whiteSpace', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded text-[10px] py-0.5 px-1"
                >
                  <option value="normal">자동 줄바꿈 (normal)</option>
                  <option value="nowrap">한 줄 고정 (nowrap)</option>
                  <option value="pre-wrap">공백·줄바꿈 유지 (pre-wrap)</option>
                </select>
              </div>

              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">넘침 기호 (Text Overflow)</span>
                <select
                  value={selectedNode.style.textOverflow || 'clip'}
                  onChange={(e) => {
                    const val = e.target.value as 'clip' | 'ellipsis';
                    if (val === 'ellipsis') {
                      handleBatchStyleChange({
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: selectedNode.style.lineClamp ? 'normal' : 'nowrap'
                      });
                    } else {
                      handleStyleChange('textOverflow', 'clip');
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded text-[10px] py-0.5 px-1"
                >
                  <option value="clip">자르기 / 기본 (clip)</option>
                  <option value="ellipsis">말줄임표 ... (ellipsis)</option>
                </select>
              </div>

              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">단어 분리 (Word Break)</span>
                <select
                  value={selectedNode.style.wordBreak || 'keep-all'}
                  onChange={(e) => handleStyleChange('wordBreak', e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded text-[10px] py-0.5 px-1"
                >
                  <option value="keep-all">단어 보호 (keep-all)</option>
                  <option value="break-all">글자 강제분리 (break-all)</option>
                  <option value="break-word">긴 단어 줄바꿈 (break-word)</option>
                </select>
              </div>

              <div className="bg-white p-1.5 rounded-lg border border-slate-200 space-y-0.5 min-w-0">
                <span className="text-[9px] text-slate-500 block truncate">최대 줄 수 (Line Clamp)</span>
                <select
                  value={selectedNode.style.lineClamp || 0}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (n <= 0) {
                      handleStyleChange('lineClamp', undefined);
                    } else {
                      handleBatchStyleChange({
                        lineClamp: n,
                        overflow: 'hidden',
                        whiteSpace: 'normal'
                      });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded text-[10px] py-0.5 px-1"
                >
                  <option value={0}>제한 없음</option>
                  <option value={1}>1줄 제한</option>
                  <option value={2}>2줄 제한</option>
                  <option value={3}>3줄 제한</option>
                  <option value={4}>4줄 제한</option>
                </select>
              </div>
            </div>
          </div>

          {/* Font Family, Size, Weight, Alignment */}
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 pt-1">
            <Type size={11} />
            <span>서체 & 타이포그래피 (Typography)</span>
          </label>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">글꼴 서체 (Font Family)</span>
            <select
              value={selectedNode.style.fontFamily || 'Pretendard, -apple-system, sans-serif'}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded text-[11px] py-1 px-1.5 focus:outline-none"
            >
              <option value="Pretendard, -apple-system, sans-serif">Pretendard (모던 산세리프)</option>
              <option value="Inter, system-ui, sans-serif">Inter (글로벌 UI)</option>
              <option value="ui-monospace, SFMono-Regular, monospace">Monospace (코드/숫자)</option>
              <option value="Georgia, serif">Georgia (클래식 세리프)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>크기</span>
                <span className="font-mono font-bold text-slate-700">{selectedNode.style.fontSize || 14}px</span>
              </div>
              <input
                type="range"
                min={10}
                max={64}
                value={Number(selectedNode.style.fontSize) || 14}
                onChange={(e) => handleStyleChange('fontSize', Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 cursor-pointer"
              />
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">굵기 (Weight)</span>
              <select
                value={selectedNode.style.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded text-[11px] py-1 px-1 focus:outline-none"
              >
                <option value="normal">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="bold">Bold (700)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
          </div>

          {/* Text Alignment & Transform */}
          <div className="flex gap-2">
            <div className="flex-1 flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {(['left', 'center', 'right', 'justify'] as const).map((align) => {
                const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : align === 'right' ? AlignRight : AlignJustify;
                return (
                  <button
                    key={align}
                    onClick={() => handleStyleChange('textAlign', align)}
                    className={`flex-1 py-1 flex items-center justify-center rounded text-xs transition ${
                      selectedNode.style.textAlign === align
                        ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={`텍스트 ${align} 정렬`}
                  >
                    <Icon size={12} />
                  </button>
                );
              })}
            </div>

            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {[
                { val: 'none', label: 'Aa' },
                { val: 'uppercase', label: 'AA' },
                { val: 'lowercase', label: 'aa' }
              ].map((tf) => (
                <button
                  key={tf.val}
                  onClick={() => handleStyleChange('textTransform', tf.val)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition ${
                    (selectedNode.style.textTransform || 'none') === tf.val
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={`대소문자: ${tf.val}`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block truncate">줄 간격 (Line Height)</span>
              <input
                type="number"
                step={0.1}
                min={0.8}
                max={40}
                value={Number(selectedNode.style.lineHeight) || 1.4}
                onChange={(e) => handleStyleChange('lineHeight', Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono"
              />
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block truncate">자간 (Letter Spacing)</span>
              <input
                type="number"
                step={0.5}
                min={-2}
                max={6}
                value={Number(String(selectedNode.style.letterSpacing || '0').replace('px', ''))}
                onChange={(e) => handleStyleChange('letterSpacing', `${e.target.value}px`)}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. SPECIFIC: Image Component Properties */}
      {showStyleSection && isImage && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-600 uppercase tracking-wider">
              <ImageIcon size={12} />
              <span>이미지 소스 및 피팅 (Image Settings)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={selectedNode.props?.src || selectedNode.content || ''}
                placeholder="https://... 또는 assets/파일명"
                onChange={(e) => {
                  handlePropsChange('src', e.target.value);
                  onUpdateNode(selectedNode.id, { content: e.target.value });
                }}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <button
                onClick={handleChooseImageFile}
                disabled={isChoosingAsset}
                className="px-2.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition shrink-0 shadow-2xs disabled:opacity-50"
              >
                <FolderOpen size={13} className="text-pink-600" />
                <span>{isChoosingAsset ? '복사 중...' : '파일 선택'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(['cover', 'contain', 'fill', 'none'] as const).map((fit) => (
              <button
                key={fit}
                onClick={() => handleStyleChange('objectFit', fit)}
                className={`py-1 rounded text-[10px] font-mono capitalize transition ${
                  (selectedNode.style.objectFit || 'cover') === fit
                    ? 'bg-pink-600 text-white font-bold'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. SPECIFIC: Dialog & Scroll Properties */}
      {showLayoutSection && isDialog && (
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-xs text-slate-800">모달 Open 상태</span>
              <p className="text-[10px] text-slate-400">캔버스 및 미리보기에서 창 표시</p>
            </div>
            <button
              onClick={() => handlePropsChange('open', selectedNode.props?.open === false ? true : false)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedNode.props?.open !== false ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {selectedNode.props?.open !== false ? '열림 (Open)' : '닫힘 (Hidden)'}
            </button>
          </div>
        </div>
      )}

      {/* 7. UNIVERSAL: Colors, Background Image & Gradient */}
      {showStyleSection && (
        <div className="space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <Palette size={11} />
              <span>색상 & 스와치 (Colors & Swatches)</span>
            </label>
            <div className="flex bg-slate-100 p-0.5 rounded text-[10px]">
              <button
                onClick={() => setColorTarget('bg')}
                className={`px-2 py-0.5 rounded font-medium transition ${
                  colorTarget === 'bg' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                배경색
              </button>
              <button
                onClick={() => setColorTarget('text')}
                className={`px-2 py-0.5 rounded font-medium transition ${
                  colorTarget === 'text' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                글자색
              </button>
            </div>
          </div>

          {/* 1-Click Design System Swatches */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="grid grid-cols-6 gap-1.5">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.val}
                  onClick={() => {
                    if (colorTarget === 'bg') handleStyleChange('backgroundColor', swatch.val);
                    else handleStyleChange('color', swatch.val);
                  }}
                  className="flex flex-col items-center gap-0.5 group/sw"
                  title={`${swatch.name} (${swatch.val})`}
                >
                  <div
                    style={{ backgroundColor: swatch.val === 'transparent' ? undefined : swatch.val }}
                    className={`w-5 h-5 rounded-md shadow-2xs transition-transform group-hover/sw:scale-110 ${
                      swatch.val === 'transparent' ? 'border border-dashed border-slate-400 bg-white' : 'border border-black/10'
                    }`}
                  />
                  <span className="text-[8px] text-slate-500 truncate max-w-full font-mono">{swatch.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 min-w-0">
              <span className="text-[10px] text-slate-500 block">배경색</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={selectedNode.style.backgroundColor?.startsWith('#') ? selectedNode.style.backgroundColor : '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={selectedNode.style.backgroundColor || ''}
                  placeholder="transparent"
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-full min-w-0 bg-transparent font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 min-w-0">
              <span className="text-[10px] text-slate-500 block">글자색</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={selectedNode.style.color?.startsWith('#') ? selectedNode.style.color : '#ffffff'}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  value={selectedNode.style.color || ''}
                  placeholder="#0f172a"
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="w-full min-w-0 bg-transparent font-mono text-[11px] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Background Image & Gradient */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-semibold">배경 이미지 / 그라데이션</span>
              {(selectedNode.style.backgroundImage || selectedNode.style.backgroundGradient) && (
                <button
                  onClick={() => {
                    handleBatchStyleChange({
                      backgroundImage: undefined,
                      backgroundImageDataUrl: undefined,
                      backgroundGradient: undefined
                    });
                    setActiveGradientType(null);
                    setIsEditorDismissed(true);
                  }}
                  className="text-[10px] text-rose-500 hover:underline"
                >
                  제거
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={selectedNode.style.backgroundImage || selectedNode.style.backgroundGradient || ''}
                placeholder="url(...) 또는 linear-gradient(...)"
                onChange={(e) => {
                  const val = e.target.value.trim();
                  handleBatchStyleChange({
                    backgroundImage: val || undefined,
                    backgroundImageDataUrl: undefined,
                    backgroundGradient: undefined
                  });
                }}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleChooseBackgroundImageFile}
                disabled={isChoosingAsset}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-medium flex items-center gap-1 transition shrink-0"
              >
                <FolderOpen size={12} className="text-indigo-600" />
                <span>파일</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {SAMPLE_BACKGROUND_PATTERNS.map((p) => {
                const isNeonActive = p.name === '네온 그라데이션' && effectiveGradientType === 'linear-neon';
                const isMeshActive = p.name === '다크 메쉬' && effectiveGradientType === 'dark-mesh';
                const isCurrentActive = isNeonActive || isMeshActive;
                return (
                  <button
                    key={p.name}
                    onClick={() => handlePatternClick(p)}
                    className={`py-1 px-1 border rounded text-[9px] text-center truncate transition font-medium ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white border-indigo-700 font-bold'
                        : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            {effectiveGradientType && (
              <GradientControls
                currentValue={selectedNode.style.backgroundImage || selectedNode.style.backgroundGradient || ''}
                gradientType={effectiveGradientType}
                onChange={(newBg) => {
                  handleBatchStyleChange({
                    backgroundImage: newBg,
                    backgroundImageDataUrl: undefined,
                    backgroundGradient: undefined
                  });
                }}
                onClose={() => {
                  setIsEditorDismissed(true);
                  setActiveGradientType(null);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* 8. UNIVERSAL: Border, Corner Radius & Shadow */}
      {showStyleSection && (
        <div className="space-y-2 pt-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
              <Shield size={11} />
              <span>곡률, 테두리 & 그림자 (Borders & Shadow)</span>
            </label>
            <button
              onClick={() => setUse4WayRadius(!use4WayRadius)}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {use4WayRadius ? '단일 곡률' : '4코너 분할'}
            </button>
          </div>

          {use4WayRadius ? (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <span className="text-[10px] text-slate-500 block font-semibold">4코너 개별 곡률 (TL / TR / BR / BL)</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { k: 'borderTopLeftRadius', l: '상좌' },
                  { k: 'borderTopRightRadius', l: '상우' },
                  { k: 'borderBottomRightRadius', l: '하우' },
                  { k: 'borderBottomLeftRadius', l: '하좌' }
                ].map((c) => (
                  <div key={c.k} className="text-center">
                    <span className="text-[9px] text-slate-400 block mb-0.5">{c.l}</span>
                    <input
                      type="number"
                      value={Number(selectedNode.style[c.k as keyof VNodeStyle] || 0)}
                      onChange={(e) => handleStyleChange(c.k as keyof VNodeStyle, Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">모서리 곡률 ({selectedNode.style.borderRadius || 0}px)</span>
              <input
                type="range"
                min={0}
                max={48}
                value={Number(selectedNode.style.borderRadius) || 0}
                onChange={(e) => handleStyleChange('borderRadius', Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 cursor-pointer"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">선 두께</span>
              <div className="flex gap-1">
                {[0, 1, 2, 4].map((bw) => (
                  <button
                    key={bw}
                    onClick={() => handleStyleChange('borderWidth', bw)}
                    className={`flex-1 py-1 rounded text-[10px] font-mono transition ${
                      (selectedNode.style.borderWidth ?? 0) === bw
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    {bw}px
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">선 스타일</span>
              <select
                value={selectedNode.style.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded text-[11px] py-1 px-1"
              >
                <option value="solid">실선 (Solid)</option>
                <option value="dashed">점선 (Dashed)</option>
                <option value="dotted">도트 (Dotted)</option>
                <option value="none">없음 (None)</option>
              </select>
            </div>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">테두리 색상</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={selectedNode.style.borderColor?.startsWith('#') ? selectedNode.style.borderColor : '#475569'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-5 h-5 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={selectedNode.style.borderColor || ''}
                placeholder="#e2e8f0"
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-24 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Box Shadow Presets */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] text-slate-500 block font-semibold">그림자 프리셋 (Box Shadow)</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: '없음', val: undefined },
                { label: '소프트', val: '0 1px 3px rgba(0,0,0,0.1)' },
                { label: '미디엄', val: '0 4px 6px -1px rgba(0,0,0,0.1)' },
                { label: '플로팅', val: '0 10px 15px -3px rgba(0,0,0,0.15)' },
                { label: '볼드', val: '0 20px 25px -5px rgba(0,0,0,0.25)' },
                { label: '글로우', val: '0 0 20px rgba(99,102,241,0.5)' }
              ].map((sh) => (
                <button
                  key={sh.label}
                  onClick={() => handleStyleChange('boxShadow', sh.val)}
                  className={`py-1 rounded text-[10px] transition ${
                    selectedNode.style.boxShadow === sh.val
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sh.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity & Blur */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>불투명도</span>
                <span className="font-mono">{Math.round((selectedNode.style.opacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={Math.round((selectedNode.style.opacity ?? 1) * 100)}
                onChange={(e) => handleStyleChange('opacity', Number(e.target.value) / 100)}
                className="w-full accent-indigo-600 h-1.5 cursor-pointer"
              />
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>블러 (Blur)</span>
                <span className="font-mono">{selectedNode.style.blur || 0}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={Number(selectedNode.style.blur) || 0}
                onChange={(e) => handleStyleChange('blur', Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
