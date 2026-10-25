import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Layout,
  Type,
  Palette,
  Trash2,
  Box,
  Layers,
  Sparkles,
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
  Eye,
  ChevronsUpDown,
  Move,
  CornerDownRight,
  Plus,
  Upload,
  Check,
  FileImage
} from 'lucide-react';
import { VDomArtboard, VNode, VNodeStyle } from '../types/vdom';
import { VisibilityConditionSection } from './VisibilityConditionSection';
import {
  chooseAndCopyImageFile,
  applyPresetImage,
  IMAGE_PRESETS
} from '../utils/assetManager';
import { GradientControls, GradientType } from './GradientControls';

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
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'effects'>('style');
  const [isChoosingAsset, setIsChoosingAsset] = useState(false);
  const [use4WayPadding, setUse4WayPadding] = useState(false);
  const [use4WayRadius, setUse4WayRadius] = useState(false);
  const [colorTarget, setColorTarget] = useState<'bg' | 'text'>('bg');
  // Active Gradient Editor State ('linear-neon' | 'dark-mesh' | null)
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

  if (!selectedNode) {
    return (
      <div className="p-6 text-center text-slate-400 text-xs space-y-3">
        <Box size={24} className="mx-auto text-slate-300" />
        <p className="font-semibold text-slate-600">선택된 노드가 없습니다</p>
        <p className="text-[11px] text-slate-400">
          캔버스 화면에서 요소를 클릭하거나 좌측 레이어 목록에서 요소를 선택하세요.
        </p>
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

  const isImage = selectedNode.type === 'image';
  const isDialog = selectedNode.type === 'dialog';
  const isScroll = selectedNode.type === 'scroll-container';
  const isTextLike = ['text', 'heading', 'span', 'blockquote', 'code', 'label', 'button'].includes(selectedNode.type);
  const isInputLike = ['input', 'textarea', 'select'].includes(selectedNode.type);

  const SAMPLE_BACKGROUND_PATTERNS = [
    { name: '네온 그라데이션', url: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' },
    { name: '다크 메쉬', url: 'radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 100% 100%, #311042 0px, transparent 50%)' },
    { name: '텍스처 배경', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="p-4 space-y-4 text-xs text-slate-700 select-none divide-y divide-slate-100 overflow-y-auto max-h-full">
      {/* 0. Visibility Condition Settings Section (최상단) */}
      <VisibilityConditionSection
        artboard={artboard}
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        onSwitchToTweaksTab={onSwitchToTweaksTab}
      />

      {/* 1. Node Header & Quick Actions */}
      <div className="space-y-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
            {isImage ? (
              <ImageIcon size={14} className="text-pink-500" />
            ) : isDialog ? (
              <MessageSquare size={14} className="text-emerald-500" />
            ) : isScroll ? (
              <ScrollText size={14} className="text-amber-500" />
            ) : (
              <Box size={14} className="text-indigo-600" />
            )}
            <span>{selectedNode.type} 요소 속성</span>
          </div>
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

        {/* Node Name */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase">명칭 (Name)</label>
          <input
            type="text"
            value={selectedNode.name}
            onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Quick Alignment & Sizing Matrix */}
        <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg border border-slate-200 mt-2">
          <span className="text-[10px] text-slate-500 font-semibold pl-1">위치 정렬</span>
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
      </div>

      {/* 2. SPECIFIC: Image Component Properties */}
      {isImage && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-600 uppercase tracking-wider">
              <ImageIcon size={12} />
              <span>이미지 소스 및 피팅 (Image Settings)</span>
            </div>
            {selectedNode.props?.src && (
              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[140px]" title={selectedNode.props.src}>
                {selectedNode.props.src}
              </span>
            )}
          </div>

          {/* Image Source Input + File Chooser Button */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
              <span>이미지 소스 지정 (URL / 에셋)</span>
              {selectedNode.props?.src?.startsWith('assets/') && (
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-normal">
                  assets/ 내장
                </span>
              )}
            </label>
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
                title="로컬 파일을 선택하여 assets/ 폴더로 복사하고 참조합니다"
              >
                <FolderOpen size={13} className="text-pink-600" />
                <span>{isChoosingAsset ? '복사 중...' : '파일 선택'}</span>
              </button>
            </div>
          </div>

          {/* Built-in Electron Image Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[9px] text-slate-400 font-semibold block">내장 에셋 프리셋 (Electron Embedded)</label>
              <span className="text-[9px] text-slate-400">assets/ 자동 저장</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {IMAGE_PRESETS.map((preset) => {
                const isCurrent =
                  selectedNode.props?.src === `assets/${preset.fileName}` ||
                  selectedNode.props?.src === preset.fileName;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-1.5 rounded-lg border text-left transition flex items-center gap-2 group ${
                      isCurrent
                        ? 'border-pink-500 bg-pink-50/70 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-white hover:border-pink-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded border border-slate-200 overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center">
                      <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold text-slate-700 truncate group-hover:text-pink-600">
                        {preset.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        {preset.fileName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Object Fit Pills */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase">맞춤 모드 (Object Fit)</label>
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

          {/* Aspect Ratio Pills */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase">종횡비 (Aspect Ratio)</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'Auto', val: undefined },
                { label: '1 : 1', val: '1/1' },
                { label: '16 : 9', val: '16/9' },
                { label: '4 : 3', val: '4/3' }
              ].map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => handleStyleChange('aspectRatio', ar.val)}
                  className={`py-1 rounded text-[10px] font-mono transition ${
                    selectedNode.style.aspectRatio === ar.val
                      ? 'bg-pink-600 text-white font-bold'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SPECIFIC: Dialog Component Properties */}
      {isDialog && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
            <MessageSquare size={12} />
            <span>모달 다이얼로그 제어 (Dialog Settings)</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="font-bold text-xs text-slate-800">모달 Open 상태</span>
              <p className="text-[10px] text-slate-400">캔버스 및 미리보기에서 창 표시</p>
            </div>
            <button
              onClick={() => handlePropsChange('open', selectedNode.props?.open === false ? true : false)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedNode.props?.open !== false
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {selectedNode.props?.open !== false ? '열림 (Open)' : '닫힘 (Hidden)'}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">다이얼로그 제목</label>
            <input
              type="text"
              value={selectedNode.props?.title || selectedNode.name}
              onChange={(e) => handlePropsChange('title', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* 4. SPECIFIC: Scroll Container Properties */}
      {isScroll && (
        <div className="space-y-3 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
            <ScrollText size={12} />
            <span>스크롤 컨테이너 설정 (Scroll Settings)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">최대 높이 (Max Height)</span>
              <input
                type="number"
                value={Number(String(selectedNode.style.maxHeight || 280).replace('px', ''))}
                onChange={(e) => handleStyleChange('maxHeight', Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-mono"
              />
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">스크롤 방향</span>
              <select
                value={selectedNode.style.overflowY || 'auto'}
                onChange={(e) => handleStyleChange('overflowY', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded text-xs py-1"
              >
                <option value="auto">세로 자동 (Auto Y)</option>
                <option value="scroll">항상 스크롤 (Scroll)</option>
                <option value="hidden">숨김 (Hidden)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. UNIVERSAL: Background Image & Gradient for ALL VDOMs */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Palette size={11} />
            <span>배경 이미지 & 패턴 (Background Image)</span>
          </label>
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

        {/* Background Image Input + File Chooser */}
        <div className="space-y-1.5">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={selectedNode.style.backgroundImage || selectedNode.style.backgroundGradient || ''}
              placeholder="url(...) 또는 assets/파일명"
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
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition shrink-0 shadow-2xs disabled:opacity-50"
              title="로컬 이미지 파일을 선택하여 assets/ 폴더로 복사하고 배경으로 지정합니다"
            >
              <FolderOpen size={13} className="text-indigo-600" />
              <span>{isChoosingAsset ? '복사 중...' : '배경 파일'}</span>
            </button>
          </div>
        </div>

        {/* Quick Background Presets (Built-in SVG presets + Gradients) */}
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 font-semibold block">내장 배경 프리셋 (Electron Presets)</span>
          <div className="grid grid-cols-3 gap-1">
            {IMAGE_PRESETS.filter((p) => ['gradient', 'tech', 'nature'].includes(p.category)).slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyBackgroundPreset(p.id)}
                className="py-1 px-1 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 rounded text-[9px] text-center truncate transition font-medium"
                title={`${p.name} (${p.fileName})`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
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
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200'
                  }`}
                  title={`${p.name} (클릭 시 실시간 세부 옵션 편집 패널 표시)`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Gradient & Mesh Option Controls */}
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

        {/* Background Size & Repeat Settings */}
        {(selectedNode.style.backgroundImage || selectedNode.style.backgroundGradient) && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">크기 (Size)</span>
              <select
                value={selectedNode.style.backgroundSize || 'cover'}
                onChange={(e) => handleStyleChange('backgroundSize', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded text-[11px] py-1"
              >
                <option value="cover">Cover (채우기)</option>
                <option value="contain">Contain (맞춤)</option>
                <option value="auto">Auto (원래 크기)</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">반복 (Repeat)</span>
              <select
                value={selectedNode.style.backgroundRepeat || 'no-repeat'}
                onChange={(e) => handleStyleChange('backgroundRepeat', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded text-[11px] py-1"
              >
                <option value="no-repeat">반복 안 함</option>
                <option value="repeat">바둑판 반복</option>
                <option value="repeat-x">가로 반복</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 6. UNIVERSAL: Colors (Background & Text) */}
      <div className="space-y-2 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Palette size={11} />
            <span>색상 & 팔레트 스와치 (Colors & Swatches)</span>
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
          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span>디자인 시스템 스와치 ({colorTarget === 'bg' ? '배경색에 적용' : '글자색에 적용'})</span>
          </div>
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
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">배경색</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={selectedNode.style.backgroundColor?.startsWith('#') ? selectedNode.style.backgroundColor : '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={selectedNode.style.backgroundColor || ''}
                placeholder="none"
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full bg-transparent font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>

          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">글자색</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={selectedNode.style.color?.startsWith('#') ? selectedNode.style.color : '#ffffff'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
              />
              <input
                type="text"
                value={selectedNode.style.color || ''}
                placeholder="#fff"
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full bg-transparent font-mono text-[11px] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Typography (Text, Headings, Buttons, Labels) */}
      {isTextLike && (
        <div className="space-y-2 pt-3">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Type size={11} />
            <span>서체 & 정렬 (Typography)</span>
          </label>

          {/* Font Family Selector */}
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
              <span className="text-[10px] text-slate-500 block">크기 ({selectedNode.style.fontSize || 14}px)</span>
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
              <span className="text-[10px] text-slate-500 block">굵기</span>
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

          {/* Text Alignment & Text Transform */}
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

          {/* Advanced Typography: Line Height & Letter Spacing */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">줄 간격 (Line Height)</span>
              <input
                type="number"
                step={0.1}
                min={0.8}
                max={3.0}
                value={Number(selectedNode.style.lineHeight) || 1.4}
                onChange={(e) => handleStyleChange('lineHeight', Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono"
              />
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block">자간 (Letter Spacing)</span>
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

          {/* Text Decoration (Underline, Line-through) */}
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold">텍스트 장식선</span>
            <div className="flex gap-1">
              {[
                { val: 'none', label: '없음' },
                { val: 'underline', label: '밑줄 (U)' },
                { val: 'line-through', label: '취소선 (S)' }
              ].map((dec) => (
                <button
                  key={dec.val}
                  onClick={() => handleStyleChange('textDecoration', dec.val)}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    (selectedNode.style.textDecoration || 'none') === dec.val
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {dec.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7.5. Container Flexbox Direction & Visual Alignment Matrix (Containers & Layouts) */}
      {['frame', 'card', 'box', 'section', 'header', 'footer', 'nav', 'aside', 'main', 'scroll-container', 'dialog'].includes(
        selectedNode.type
      ) && (
        <div className="space-y-2 pt-3">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layout size={11} />
              <span>컨테이너 정렬 행렬 (Flex Layout)</span>
            </span>
            <span className="text-[9px] font-mono text-indigo-600 font-bold">3×3 Grid</span>
          </label>

          {/* Direction: Row vs Column */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => handleStyleChange('flexDirection', 'row')}
              className={`flex-1 py-1 text-center rounded text-[10px] font-semibold transition ${
                (selectedNode.style.flexDirection || 'row') === 'row'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              가로 방향 (Row ↔)
            </button>
            <button
              onClick={() => handleStyleChange('flexDirection', 'column')}
              className={`flex-1 py-1 text-center rounded text-[10px] font-semibold transition ${
                selectedNode.style.flexDirection === 'column'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              세로 방향 (Column ↕)
            </button>
          </div>

          {/* 3x3 Visual Alignment Matrix */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block">내부 요소 정렬</span>
              <div className="text-[9px] text-slate-400">
                {selectedNode.style.justifyContent || 'start'} / {selectedNode.style.alignItems || 'start'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1.5 rounded-lg">
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
                      isSelected
                        ? 'bg-indigo-600 shadow-xs'
                        : 'bg-white hover:bg-slate-100'
                    }`}
                    title={m.title}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-slate-400'
                      }`}
                    />
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

      {/* 8. UNIVERSAL: Dimensions & Spacing (Width, Height, Padding, Margin) */}
      <div className="space-y-2 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Maximize2 size={11} />
            <span>크기 & 여백 (Dimensions & Spacing)</span>
          </label>
          <button
            onClick={() => setUse4WayPadding(!use4WayPadding)}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            {use4WayPadding ? '단일 여백' : '4방향 분할'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">너비 (Width)</span>
            <input
              type="text"
              value={selectedNode.style.width || ''}
              placeholder="auto / 100%"
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-mono"
            />
          </div>
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">높이 (Height)</span>
            <input
              type="text"
              value={selectedNode.style.height || ''}
              placeholder="auto"
              onChange={(e) => handleStyleChange('height', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-xs font-mono"
            />
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

      {/* 9. UNIVERSAL: Border, Corner Radius & Shadow */}
      <div className="space-y-2 pt-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <Shield size={11} />
            <span>곡률 & 테두리선 (Borders & Radius)</span>
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
          {/* Border Width */}
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

          {/* Border Style */}
          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 block">선 스타일</span>
            <select
              value={selectedNode.style.borderStyle || 'solid'}
              onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded text-[11px] py-1 px-1"
            >
              <option value="solid">실선 (Solid)</option>
              <option value="dashed">점선 (Dashed)</option>
              <option value="dotted">도트 (Dotted)</option>
              <option value="none">없음 (None)</option>
            </select>
          </div>
        </div>

        {/* Border Color */}
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
              placeholder="#475569"
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
      </div>

      {/* 10. UNIVERSAL: Visual Effects & Filters (Brightness, Contrast, Blur, Opacity) */}
      <div className="space-y-2 pt-3">
        <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <SunMedium size={11} />
          <span>시각 효과 & 필터 (Visual Effects)</span>
        </label>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>불투명도 (Opacity)</span>
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

        {/* Blur Filter */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>블러 효과 (Blur)</span>
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

        {/* Grayscale Filter (useful for images & cards) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>흑백 (Grayscale)</span>
            <span className="font-mono">{selectedNode.style.grayscale || 0}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={Number(selectedNode.style.grayscale) || 0}
            onChange={(e) => handleStyleChange('grayscale', Number(e.target.value))}
            className="w-full accent-indigo-600 h-1.5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
