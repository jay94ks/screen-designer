import React, { useState } from 'react';
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
        handleStyleChange('backgroundImage', asset.relativePath);
        handleStyleChange('backgroundImageDataUrl' as any, asset.dataUrl);
      }
    } finally {
      setIsChoosingAsset(false);
    }
  };

  const handleApplyBackgroundPreset = async (presetId: string) => {
    const asset = await applyPresetImage(presetId);
    if (asset) {
      handleStyleChange('backgroundImage', asset.relativePath);
      handleStyleChange('backgroundImageDataUrl' as any, asset.dataUrl);
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
          {selectedNode.style.backgroundImage && (
            <button
              onClick={() => {
                handleStyleChange('backgroundImage', undefined);
                handleStyleChange('backgroundImageDataUrl' as any, undefined);
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
              value={selectedNode.style.backgroundImage || ''}
              placeholder="url(...) 또는 assets/파일명"
              onChange={(e) => handleStyleChange('backgroundImage', e.target.value)}
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
            {IMAGE_PRESETS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyBackgroundPreset(p.id)}
                className="py-1 px-1 bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 rounded text-[9px] text-center truncate transition font-medium"
                title={`${p.name} (${p.fileName})`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
            {SAMPLE_BACKGROUND_PATTERNS.map((p) => (
              <button
                key={p.name}
                onClick={() => handleStyleChange('backgroundImage', p.url)}
                className="py-1 px-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded text-[9px] text-center truncate transition"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Background Size & Repeat Settings */}
        {selectedNode.style.backgroundImage && (
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
        <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <Palette size={11} />
          <span>색상 (Colors)</span>
        </label>
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

          {/* Text Alignment */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
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
                >
                  <Icon size={12} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. UNIVERSAL: Dimensions & Spacing (Width, Height, Padding, Margin) */}
      <div className="space-y-2 pt-3">
        <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <Maximize2 size={11} />
          <span>크기 & 여백 (Dimensions & Spacing)</span>
        </label>
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
      </div>

      {/* 9. UNIVERSAL: Border, Corner Radius & Shadow */}
      <div className="space-y-2 pt-3">
        <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <Shield size={11} />
          <span>곡률 & 테두리선 (Borders & Radius)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
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
