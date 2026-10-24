import React, { useState, useEffect, useRef } from 'react';
import { ClaudeHeader } from './components/ClaudeHeader';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { VNodeRenderer } from './components/VNodeRenderer';
import { PlayModal } from './components/PlayModal';
import { ExportModal } from './components/Modals/ExportModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { ShareModal } from './components/Modals/ShareModal';
import { NewArtboardModal } from './components/Modals/NewArtboardModal';
import { GitDesktopModal } from './components/Modals/GitDesktopModal';
import { gitClient } from './utils/gitClient';
import { projectClient } from './utils/projectClient';
import { exportArtboardImage, exportArtboardJson, exportArtboardCode } from './utils/artboardExporter';
import { initProjectAssets } from './utils/assetManager';
import { HistoryManager } from './utils/history';
import { INITIAL_VDOM_ARTBOARDS } from './data/initialVdom';
import { VDomArtboard, VNode, NodeType } from './types/vdom';
import { generateComponentCode } from './utils/serializer';
import {
  DocumentProject,
  ProjectSettings,
  CanvasTool,
  TweakDefinition,
  Artboard,
  DEFAULT_COMPONENT_STYLES,
  GitStatusInfo
} from './types';
import {
  Plus,
  Copy,
  Trash2,
  Layout,
  Image as ImageIcon,
  FileJson,
  FileCode,
  Check
} from 'lucide-react';

const DEFAULT_SETTINGS: ProjectSettings = {
  gridVisible: true,
  gridSize: 24,
  snapToGrid: false,
  rulersVisible: false,
  canvasBackground: '#e5e7eb',
  theme: 'light',
  autoSave: true,
  componentDefaults: DEFAULT_COMPONENT_STYLES,
  pageDocsPath: 'docs/ui-boards',
  workspacePath: '.',
  gitAutoCheck: true
};

interface PageModel {
  id: string;
  name: string;
  artboards: VDomArtboard[];
}

const INITIAL_PAGES: PageModel[] = [
  {
    id: 'page-1',
    name: 'Page 1 (핀테크 가상 DOM)',
    artboards: INITIAL_VDOM_ARTBOARDS
  },
  {
    id: 'page-2',
    name: 'Page 2 (새로운 작업 공간)',
    artboards: []
  }
];

export default function App() {
  const [docTitle, setDocTitle] = useState('Fintech Service UI Storyboard');
  const [settings, setSettings] = useState<ProjectSettings>(DEFAULT_SETTINGS);

  // Real Multi-Page State (Each page owns its own independent artboards array)
  const [pages, setPages] = useState<PageModel[]>(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState<string>('page-1');

  const activePage = pages.find((p) => p.id === activePageId) || pages[0] || {
    id: 'page-1',
    name: 'Page 1',
    artboards: []
  };
  const artboards = activePage.artboards;

  // Selected Artboard State for active page
  const [selectedArtboardId, setSelectedArtboardId] = useState<string>(
    INITIAL_VDOM_ARTBOARDS[0]?.id || ''
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nodeParam = params.get('node');
      if (nodeParam) return nodeParam;
    }
    return 'node-s1-ai-badge';
  });

  // Multi-page Artboard Mutator
  const setArtboards = (updater: VDomArtboard[] | ((prev: VDomArtboard[]) => VDomArtboard[])) => {
    setPages((prevPages) =>
      prevPages.map((p) => {
        if (p.id === activePageId) {
          const next = typeof updater === 'function' ? updater(p.artboards) : updater;
          return { ...p, artboards: next };
        }
        return p;
      })
    );
  };

  const handleSelectPage = (pageId: string) => {
    setActivePageId(pageId);
    const targetPage = pages.find((p) => p.id === pageId);
    if (targetPage && targetPage.artboards.length > 0) {
      setSelectedArtboardId(targetPage.artboards[0].id);
      setSelectedNodeId(targetPage.artboards[0].rootNode.id);
    } else {
      setSelectedArtboardId('');
      setSelectedNodeId(null);
    }
  };

  const handleAddPage = () => {
    const nextNum = pages.length + 1;
    const newPageId = `page-${Date.now()}`;
    const newPage: PageModel = {
      id: newPageId,
      name: `Page ${nextNum}`,
      artboards: [] // Starts with 0 canvases as requested!
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPageId);
    setSelectedArtboardId('');
    setSelectedNodeId(null);
  };

  const [zoom, setZoom] = useState(0.8);
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Modals State
  const [isPlayOpen, setIsPlayOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.search.includes('play');
  });
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    return typeof window !== 'undefined' && (window.location.search.includes('openSettings') || window.location.search.includes('settings'));
  });
  const [settingsTab, setSettingsTab] = useState<'canvas' | 'components'>('components');

  const handleOpenSettings = (tab: 'canvas' | 'components' = 'components') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNewFrameOpen, setIsNewFrameOpen] = useState(false);
  const [isGitModalOpen, setIsGitModalOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.search.includes('openGit');
  });

  // Git Status State (node.js simple-git integration)
  const [gitStatus, setGitStatus] = useState<GitStatusInfo>({
    isRepo: true,
    branch: 'main',
    clean: true,
    uiChangesCount: 0,
    designChanges: [],
    allChangesCount: 0
  });

  const refreshGitStatus = async () => {
    try {
      const docsPath = settings.pageDocsPath || 'docs/ui-boards';
      const res = await gitClient.getStatus(docsPath, settings.workspacePath);
      if (res) setGitStatus(res);
    } catch (e) {
      console.error('[App] Failed to check git status', e);
    }
  };

  // Continuous Git Change Detection (every 3.5s and on window focus)
  useEffect(() => {
    const timer = setInterval(() => {
      refreshGitStatus();
    }, 3500);

    const onFocus = () => refreshGitStatus();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [settings.pageDocsPath, settings.workspacePath]);

  // Auto-Save entire project structure (project.json, design-system.json, pages/{number}.json, assets/)
  const saveProjectStructureNow = async () => {
    try {
      const docsPath = settings.pageDocsPath || 'docs/ui-boards';
      await projectClient.saveProject({
        project: {
          name: 'Screen Designer Storyboard',
          version: '1.0.0',
          activePageId: activePageId,
          settings: {
            theme: settings.theme,
            gridVisible: settings.gridVisible,
            gridSize: settings.gridSize,
            canvasBackground: settings.canvasBackground
          }
        },
        pages: pages.map((p, idx) => ({
          id: p.id,
          name: p.name,
          number: (p as any).number || (idx + 1),
          artboards: p.artboards || []
        })),
        designSystem: {
          version: '1.0.0',
          updatedAt: new Date().toISOString(),
          theme: settings.theme,
          componentDefaults: settings.componentDefaults,
          canvasBackground: settings.canvasBackground,
          gridSize: settings.gridSize
        },
        pageDocsPath: docsPath,
        workspacePath: settings.workspacePath
      });
      await refreshGitStatus();
    } catch (e) {
      console.error('[App] Failed to save project structure', e);
    }
  };

  const saveActivePageDocument = async () => {
    await saveProjectStructureNow();
  };

  const handleCommitDesign = async (message: string): Promise<boolean> => {
    try {
      const docsPath = settings.pageDocsPath || 'docs/ui-boards';
      if ((window as any).electronAPI?.git?.commitDesign) {
        const res = await (window as any).electronAPI.git.commitDesign(message, docsPath, settings.workspacePath);
        if (res && res.success) {
          await refreshGitStatus();
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error('[App] Failed to commit design', e);
      return false;
    }
  };

  // Workspace & Project Structure Auto-Initialization
  useEffect(() => {
    const initWorkspace = async () => {
      initProjectAssets();
      const docsPath = settings.pageDocsPath || 'docs/ui-boards';
      const res = await projectClient.loadProject(docsPath, settings.workspacePath);
      if (res && res.success && res.pages && res.pages.length > 0) {
        setPages(res.pages);
        if (res.project?.activePageId) {
          setActivePageId(res.project.activePageId);
        } else {
          setActivePageId(res.pages[0].id);
        }
        if (res.designSystem?.componentDefaults) {
          setSettings((prev) => ({
            ...prev,
            componentDefaults: res.designSystem.componentDefaults
          }));
        }
      } else {
        // Initialize default project structure on disk
        await projectClient.saveProject({
          project: {
            name: 'Screen Designer Storyboard',
            version: '1.0.0',
            activePageId: INITIAL_PAGES[0].id
          },
          pages: INITIAL_PAGES,
          designSystem: {
            theme: settings.theme,
            componentDefaults: settings.componentDefaults
          },
          pageDocsPath: docsPath,
          workspacePath: settings.workspacePath
        });
      }
      refreshGitStatus();
    };
    initWorkspace();
  }, []);

  // Debounced Auto-Save Project Structure on Edits
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pages.length > 0) {
        saveProjectStructureNow();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [pages, activePageId, settings.componentDefaults, settings.pageDocsPath]);

  // Settings update with automatic folder content migration
  const handleUpdateSettings = async (newSettings: Partial<ProjectSettings>) => {
    if (newSettings.pageDocsPath && newSettings.pageDocsPath !== settings.pageDocsPath) {
      const oldPath = settings.pageDocsPath || 'docs/ui-boards';
      const newPath = newSettings.pageDocsPath;
      try {
        const migResult = await projectClient.migrateFolder(oldPath, newPath, settings.workspacePath);
        console.log('[App] Folder migration completed:', migResult);
        await refreshGitStatus();
      } catch (migErr) {
        console.error('[App] Folder migration failed:', migErr);
      }
    }
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Export Toast State
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExportImage = async (artboard: VDomArtboard) => {
    setExportToast(`'${artboard.title}' 이미지를 생성하는 중...`);
    const success = await exportArtboardImage(artboard);
    if (success) {
      setExportToast(`'${artboard.title}' 이미지(PNG)가 내보내졌습니다.`);
    } else {
      setExportToast(`'${artboard.title}' 이미지 내보내기 실패`);
    }
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleExportJson = (artboard: VDomArtboard) => {
    exportArtboardJson(artboard);
    setExportToast(`'${artboard.title}' JSON 데이터가 내보내졌습니다.`);
    setTimeout(() => setExportToast(null), 3000);
  };

  const handleExportCode = (artboard: VDomArtboard) => {
    exportArtboardCode(artboard);
    setExportToast(`'${artboard.title}' React(TSX) 코드가 내보내졌습니다.`);
    setTimeout(() => setExportToast(null), 3000);
  };

  // History Manager
  const historyRef = useRef(new HistoryManager<VDomArtboard[]>(30));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Canvas Pan State
  const [pan, setPan] = useState({ x: 20, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Canvas Artboard Resize State
  const [resizingArtboardId, setResizingArtboardId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const selectedArtboard =
    artboards.find((a) => a.id === selectedArtboardId) || (artboards.length > 0 ? artboards[0] : null);
  const currentIndex = selectedArtboard ? artboards.findIndex((a) => a.id === selectedArtboard.id) : -1;

  // Left & Right Sidebar Resizing State (stored in localStorage)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sd_left_sidebar_width');
      return saved ? parseInt(saved, 10) : 270;
    } catch {
      return 270;
    }
  });

  const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sd_right_sidebar_width');
      return saved ? parseInt(saved, 10) : 320;
    } catch {
      return 320;
    }
  });

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('sd_left_sidebar_width', String(leftSidebarWidth));
    } catch {}
  }, [leftSidebarWidth]);

  useEffect(() => {
    try {
      localStorage.setItem('sd_right_sidebar_width', String(rightSidebarWidth));
    } catch {}
  }, [rightSidebarWidth]);

  const handleLeftResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
    const startX = e.clientX;
    const startWidth = leftSidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(180, Math.min(520, startWidth + delta));
      setLeftSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizingLeft(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleRightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
    const startX = e.clientX;
    const startWidth = rightSidebarWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX; // Dragging left increases right panel width
      const newWidth = Math.max(240, Math.min(680, startWidth + delta));
      setRightSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizingRight(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Helper: Find VNode by ID recursively
  const findNodeById = (node: VNode, id: string): VNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = selectedArtboard && selectedNodeId
    ? findNodeById(selectedArtboard.rootNode, selectedNodeId)
    : null;

  // Push history
  const pushHistory = (newBoards: VDomArtboard[]) => {
    historyRef.current.push(artboards);
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  };

  const handleUndo = () => {
    const prev = historyRef.current.undo(artboards);
    if (prev) {
      setArtboards(prev);
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    }
  };

  const handleRedo = () => {
    const next = historyRef.current.redo(artboards);
    if (next) {
      setArtboards(next);
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.code === 'Space' && !e.repeat) setIsSpacePressed(true);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedArtboard) handleDuplicateArtboard(selectedArtboard.id);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && selectedNode && selectedNode.type !== 'frame') {
          handleDeleteNode(selectedNodeId);
        } else if (selectedArtboard) {
          handleDeleteArtboard(selectedArtboard.id);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(1.0);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPlayOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (e.key.toLowerCase() === 'v') {
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'h') {
        setActiveTool('hand');
      } else if (e.key.toLowerCase() === 'f') {
        setIsNewFrameOpen(true);
      } else if (e.key.toLowerCase() === 't') {
        handleInsertNewNode('text', '새 텍스트', '텍스트를 입력하세요');
      } else if (e.key.toLowerCase() === 'r') {
        handleInsertNewNode('box', '새 사각형 박스');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedArtboard, selectedNodeId, artboards]);

  // Canvas Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'hand' || isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleResizeMouseDown = (e: React.MouseEvent, artboard: VDomArtboard) => {
    e.stopPropagation();
    setResizingArtboardId(artboard.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: artboard.width,
      height: artboard.height
    });
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!resizingArtboardId) return;
      const dx = (e.clientX - resizeStart.x) / zoom;
      const dy = (e.clientY - resizeStart.y) / zoom;
      const nextW = Math.max(260, Math.round(resizeStart.width + dx));
      const nextH = Math.max(300, Math.round(resizeStart.height + dy));

      setArtboards((prev) =>
        prev.map((a) => (a.id === resizingArtboardId ? { ...a, width: nextW, height: nextH } : a))
      );
    };

    const handleWindowMouseUp = () => {
      if (resizingArtboardId) {
        setResizingArtboardId(null);
        pushHistory(artboards);
      }
    };

    if (resizingArtboardId) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleWindowMouseMove);
        window.removeEventListener('mouseup', handleWindowMouseUp);
      };
    }
  }, [resizingArtboardId, resizeStart, zoom, artboards]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((z) => Math.min(2.5, Math.max(0.3, z + delta)));
    }
  };

  // VNode Mutators
  const updateNodeRecursive = (
    current: VNode,
    nodeId: string,
    updater: (target: VNode) => VNode
  ): VNode => {
    if (current.id === nodeId) {
      return updater(current);
    }
    if (current.children) {
      return {
        ...current,
        children: current.children.map((c) => updateNodeRecursive(c, nodeId, updater))
      };
    }
    return current;
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<VNode>) => {
    if (!selectedArtboard) return;
    pushHistory(artboards);
    setArtboards((prev) =>
      prev.map((a) => {
        if (a.id === selectedArtboard.id) {
          const updatedRoot = updateNodeRecursive(a.rootNode, nodeId, (n) => ({
            ...n,
            ...updates
          }));
          return { ...a, rootNode: updatedRoot };
        }
        return a;
      })
    );
  };

  // Support initial query params for visual testing (e.g., ?node=node-s1-promo-img&bg=neon)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bg = params.get('bg');
      const targetNodeId = params.get('node');
      if (bg && targetNodeId) {
        const bgUrl =
          bg === 'neon'
            ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
            : bg === 'mesh'
            ? 'radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 100% 100%, #311042 0px, transparent 50%)'
            : undefined;
        if (bgUrl) {
          setTimeout(() => {
            handleUpdateNode(targetNodeId, {
              style: {
                backgroundImage: bgUrl
              }
            });
          }, 150);
        }
      }
    }
  }, []);

  const deleteNodeRecursive = (current: VNode, nodeId: string): VNode => {
    if (!current.children) return current;
    return {
      ...current,
      children: current.children
        .filter((c) => c.id !== nodeId)
        .map((c) => deleteNodeRecursive(c, nodeId))
    };
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedArtboard) return;
    pushHistory(artboards);
    setArtboards((prev) =>
      prev.map((a) => {
        if (a.id === selectedArtboard.id) {
          return { ...a, rootNode: deleteNodeRecursive(a.rootNode, nodeId) };
        }
        return a;
      })
    );
    setSelectedNodeId(null);
  };

  const insertNodeIntoTree = (current: VNode, targetContainerId: string, newNode: VNode): VNode => {
    if (current.id === targetContainerId) {
      return {
        ...current,
        children: [...(current.children || []), newNode]
      };
    }
    if (current.children) {
      return {
        ...current,
        children: current.children.map((c) => insertNodeIntoTree(c, targetContainerId, newNode))
      };
    }
    return current;
  };

  const handleInsertNewNode = (type: NodeType, name: string, content?: string, props?: Record<string, any>) => {
    const defs = settings.componentDefaults || DEFAULT_COMPONENT_STYLES;
    const itemDef = (defs && defs[type]) || DEFAULT_COMPONENT_STYLES[type] || {};
    const isCircle = type === 'circle';
    const isInput = type === 'input';
    const isButton = type === 'button';
    const isCard = type === 'card';
    const isText = type === 'text';
    const isImage = type === 'image';
    const isScroll = type === 'scroll-container';
    const isDialog = type === 'dialog';
    const isHeading = type === 'heading';
    const isTextarea = type === 'textarea';
    const isSelect = type === 'select';
    const isDivider = type === 'divider';
    const isDetails = type === 'details';

    let nodeChildren: VNode[] | undefined = undefined;
    let nodeProps: Record<string, any> = { ...(props || {}) };

    if (isScroll) {
      // Pre-populate with 4 scrollable cards so scrolling is immediately demonstrable
      nodeChildren = [1, 2, 3, 4, 5].map((num) => ({
        id: `node-${Date.now()}-item-${num}`,
        type: 'card' as NodeType,
        name: `스크롤 아이템 ${num}`,
        content: `스크롤 컨테이너 리스트 항목 #${num} (마우스 휠로 확인)`,
        style: {
          padding: 12,
          borderRadius: 8,
          backgroundColor: '#334155',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 'normal',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }
      }));
    } else if (isDialog) {
      nodeProps.open = true;
      nodeProps.title = props?.title || '모달 다이얼로그';
      nodeChildren = [
        {
          id: `node-${Date.now()}-btn-confirm`,
          type: 'button' as NodeType,
          name: '확인 버튼',
          content: '확인',
          style: {
            padding: 10,
            borderRadius: 8,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 12,
            textAlign: 'center'
          }
        }
      ];
    } else if (isSelect) {
      nodeProps.options = props?.options || [
        { label: '옵션 1 (표준)', value: '1' },
        { label: '옵션 2 (프리미엄)', value: '2' }
      ];
    } else if (isImage) {
      nodeProps.src = content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      nodeProps.alt = name;
      nodeProps.loading = 'lazy';
    }

    const newNode: VNode = {
      id: `node-${Date.now()}`,
      type,
      name,
      content:
        content ||
        (isButton
          ? '새 버튼'
          : isHeading
          ? '새 제목 타이틀'
          : isText
          ? '새 텍스트 문단'
          : isCircle
          ? '●'
          : isInput
          ? '입력하세요...'
          : isTextarea
          ? '상세 내용을 입력하세요...'
          : isDivider
          ? ''
          : isImage
          ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
          : ''),
      props: nodeProps,
      children: nodeChildren,
      style: {
        padding: itemDef.padding !== undefined ? itemDef.padding : (isCircle ? 0 : 8),
        borderRadius: itemDef.borderRadius !== undefined ? itemDef.borderRadius : (isCircle ? 999 : 0),
        backgroundColor: itemDef.backgroundColor !== undefined ? itemDef.backgroundColor : 'transparent',
        borderColor: itemDef.borderColor !== undefined ? itemDef.borderColor : undefined,
        borderWidth: itemDef.borderWidth !== undefined ? itemDef.borderWidth : undefined,
        color: itemDef.color !== undefined ? itemDef.color : '#ffffff',
        fontSize: itemDef.fontSize !== undefined ? itemDef.fontSize : 14,
        fontWeight: itemDef.fontWeight !== undefined ? itemDef.fontWeight : 'normal',
        boxShadow: itemDef.boxShadow !== undefined ? itemDef.boxShadow : undefined,
        opacity: itemDef.opacity !== undefined ? itemDef.opacity : undefined,
        textAlign: itemDef.textAlign !== undefined ? itemDef.textAlign : undefined,
        width: itemDef.width !== undefined ? itemDef.width : (isCircle ? (itemDef.size || 40) : '100%'),
        height: itemDef.height !== undefined ? itemDef.height : (isCircle ? (itemDef.size || 40) : isImage ? 180 : isTextarea ? 80 : undefined),
        maxHeight: isScroll ? 220 : undefined,
        overflowY: isScroll ? 'auto' : undefined,
        objectFit: isImage ? 'cover' : undefined,
        display: isCircle ? 'flex' : isScroll ? 'flex' : undefined,
        flexDirection: isScroll ? 'column' : undefined,
        gap: isScroll ? 8 : undefined,
        alignItems: isCircle ? 'center' : undefined,
        justifyContent: isCircle ? 'center' : undefined
      }
    };

    if (!selectedArtboard || artboards.length === 0) {
      // Auto-scaffold new artboard if canvas is empty
      const ts = Date.now();
      const newBoardId = `artboard-${ts}`;
      const newBoard: VDomArtboard = {
        id: newBoardId,
        title: '새 프레임 1',
        viewport: 'mobile',
        x: 0,
        y: 0,
        width: 375,
        height: 812,
        rootNode: {
          id: `node-${ts}-root`,
          type: 'frame',
          name: 'Screen Root',
          style: {
            width: '100%',
            height: '100%',
            backgroundColor: '#0f172a',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          },
          children: [newNode]
        },
        tweaksSchema: [],
        tweakValues: {}
      };
      pushHistory(artboards);
      setArtboards([newBoard]);
      setSelectedArtboardId(newBoardId);
      setSelectedNodeId(newNode.id);
      return;
    }

    // Container-aware: if selected node is a container (card/box/frame/scroll-container/dialog/section), insert into it; otherwise insert into artboard root
    const containerTypes = ['card', 'box', 'frame', 'scroll-container', 'dialog', 'section', 'header', 'footer', 'nav', 'aside', 'main', 'article'];
    const isContainer = selectedNode && containerTypes.includes(selectedNode.type);
    const targetContainerId = isContainer && selectedNode ? selectedNode.id : selectedArtboard.rootNode.id;

    pushHistory(artboards);
    setArtboards((prev) =>
      prev.map((a) => {
        if (a.id === selectedArtboard.id) {
          return {
            ...a,
            rootNode: insertNodeIntoTree(a.rootNode, targetContainerId, newNode)
          };
        }
        return a;
      })
    );
    setSelectedNodeId(newNode.id);
  };

  const handleUpdateContent = (nodeId: string, content: string) => {
    handleUpdateNode(nodeId, { content });
  };

  // Artboard Actions
  const handleDuplicateArtboard = (id: string) => {
    const target = artboards.find((a) => a.id === id);
    if (!target) return;
    pushHistory(artboards);
    const copy: VDomArtboard = {
      ...JSON.parse(JSON.stringify(target)),
      id: `artboard-${Date.now()}`,
      title: `${target.title} (사본)`
    };
    setArtboards([...artboards, copy]);
    setSelectedArtboardId(copy.id);
  };

  const handleDeleteArtboard = (id: string) => {
    pushHistory(artboards);
    const rem = artboards.filter((a) => a.id !== id);
    setArtboards(rem);
    if (rem.length > 0) {
      setSelectedArtboardId(rem[0].id);
      setSelectedNodeId(rem[0].rootNode.id);
    } else {
      setSelectedArtboardId('');
      setSelectedNodeId(null);
    }
  };

  // Serialized React JSX code
  const activeCode = selectedArtboard
    ? generateComponentCode(selectedArtboard.title, selectedArtboard.rootNode)
    : '';

  const compatibleArtboards: Artboard[] = artboards.map((a) => ({
    id: a.id,
    title: a.title,
    viewport: a.viewport,
    width: a.width,
    height: a.height,
    x: a.x,
    y: a.y,
    code: generateComponentCode(a.title, a.rootNode),
    tweaksSchema: a.tweaksSchema as any,
    tweakValues: a.tweakValues
  }));

  const compatibleProject: DocumentProject = {
    id: 'proj-1',
    name: docTitle,
    version: '2.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: pages.map((p) => ({
      id: p.id,
      name: p.name,
      artboards: p.artboards.map((a) => ({
        id: a.id,
        title: a.title,
        viewport: a.viewport,
        width: a.width,
        height: a.height,
        x: a.x,
        y: a.y,
        code: generateComponentCode(a.title, a.rootNode),
        tweaksSchema: a.tweaksSchema as any,
        tweakValues: a.tweakValues
      }))
    })),
    activePageId,
    selectedArtboardId,
    settings
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#e8eaf0] text-slate-800 font-sans overflow-hidden select-none">
      {/* 1. Universal Top Header & Menubar (Electron Frameless Drag & Window Controls) */}
      <ClaudeHeader
        title={docTitle}
        onTitleChange={setDocTitle}
        pages={compatibleProject.pages}
        activePageId={activePageId}
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        zoom={zoom}
        onZoomChange={setZoom}
        currentIndex={currentIndex >= 0 ? currentIndex : 0}
        totalCount={artboards.length}
        onPrev={() =>
          currentIndex > 0 && setSelectedArtboardId(artboards[currentIndex - 1].id)
        }
        onNext={() =>
          currentIndex < artboards.length - 1 && setSelectedArtboardId(artboards[currentIndex + 1].id)
        }
        onPlay={() => setIsPlayOpen(true)}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onInsertNode={(type, name, content) => handleInsertNewNode(type, name, content)}
        onOpenNewFrame={() => setIsNewFrameOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={(tab) => handleOpenSettings(tab)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        gitStatus={gitStatus}
        onOpenGitStatus={() => setIsGitModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isLeftSidebarOpen={isLeftSidebarOpen}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        isRightSidebarOpen={isRightSidebarOpen}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. Left Sidebar (Virtual DOM Layer Tree & UI Components) */}
        <LeftSidebar
          width={leftSidebarWidth}
          artboards={artboards}
          selectedArtboardId={selectedArtboardId}
          selectedNodeId={selectedNodeId}
          onSelectArtboard={(id) => {
            setSelectedArtboardId(id);
            setSelectedNodeId(null);
          }}
          onSelectNode={(node) => {
            const owner = artboards.find((a) => findNodeById(a.rootNode, node.id));
            if (owner) {
              setSelectedArtboardId(owner.id);
            }
            setSelectedNodeId(node.id);
          }}
          onInsertNode={(type, name, content, props) => handleInsertNewNode(type, name, content, props)}
          onOpenSettings={(tab) => handleOpenSettings(tab)}
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
        />

        {/* Left Sidebar Resize Handle */}
        {isLeftSidebarOpen && (
          <div
            onMouseDown={handleLeftResizeStart}
            onDoubleClick={() => setLeftSidebarWidth(270)}
            className={`w-1.5 hover:w-2 hover:bg-indigo-500 active:bg-indigo-600 transition-all cursor-col-resize z-30 select-none relative shrink-0 group flex items-center justify-center ${
              isResizingLeft ? 'bg-indigo-600 w-2' : 'bg-slate-200/80'
            }`}
            title="드래그하여 좌측 패널 크기 조절 (더블 클릭 시 기본값 270px 복원)"
          >
            <div
              className={`w-0.5 h-6 rounded-full transition-opacity ${
                isResizingLeft
                  ? 'bg-white opacity-100'
                  : 'bg-slate-400 group-hover:bg-white opacity-40 group-hover:opacity-100'
              }`}
            />
          </div>
        )}

        {/* 3. Main Infinite Canvas Area */}
        <main
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={{
            backgroundColor: settings.canvasBackground,
            cursor: activeTool === 'hand' || isSpacePressed ? (isPanning ? 'grabbing' : 'grab') : 'default'
          }}
          className={`flex-1 overflow-auto p-12 pl-16 flex items-start justify-start relative select-none ${
            settings.gridVisible
              ? 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]'
              : ''
          }`}
          onClick={() => setSelectedNodeId(null)}
        >
          {artboards.length === 0 ? (
            <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center text-center p-8 m-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
                <Layout size={32} />
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">
                이 페이지에 캔버스가 없습니다
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
                현재 선택된 '{activePage.name}' 페이지에는 등록된 아트보드가 없습니다.<br />
                새 프레임을 추가하거나 좌측의 컴포넌트를 클릭하여 디자인을 시작하세요.
              </p>
              <button
                onClick={() => setIsNewFrameOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition hover:scale-105 active:scale-95"
              >
                <Plus size={15} />
                <span>새 프레임 추가 (F)</span>
              </button>
            </div>
          ) : (
            /* Canvas Transform Layer */
            <div
              className="flex items-start gap-12 transition-transform duration-75 origin-top-left"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
              }}
            >
              {artboards.map((artboard) => {
                const isSelected = artboard.id === selectedArtboardId;

                return (
                  <div
                    key={artboard.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtboardId(artboard.id);
                    }}
                    className="flex flex-col relative group cursor-pointer"
                  >
                    {/* Top Label & Actions */}
                    <div className="flex items-center justify-between pb-1.5 px-0.5 text-xs">
                      <input
                        type="text"
                        value={artboard.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setArtboards((prev) =>
                            prev.map((a) => (a.id === artboard.id ? { ...a, title: val } : a))
                          );
                        }}
                        className="font-bold text-slate-800 bg-transparent border-0 hover:bg-white/60 rounded px-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />

                      <div className={`flex items-center gap-1 transition ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                        {/* 1. Per-Artboard Export Group: Image, JSON, Code */}
                        <div className="flex items-center bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-lg p-0.5 shadow-2xs mr-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportImage(artboard);
                            }}
                            className="px-1.5 py-0.5 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600 transition flex items-center gap-1 text-[10px] font-semibold"
                            title="장표를 PNG 이미지 파일로 내보내기"
                          >
                            <ImageIcon size={11} className="text-indigo-500" />
                            <span className="hidden xl:inline">이미지</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportJson(artboard);
                            }}
                            className="px-1.5 py-0.5 hover:bg-emerald-50 hover:text-emerald-600 rounded text-slate-600 transition flex items-center gap-1 text-[10px] font-semibold"
                            title="장표를 VDOM JSON 파일로 내보내기"
                          >
                            <FileJson size={11} className="text-emerald-500" />
                            <span className="hidden xl:inline">JSON</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportCode(artboard);
                            }}
                            className="px-1.5 py-0.5 hover:bg-purple-50 hover:text-purple-600 rounded text-slate-600 transition flex items-center gap-1 text-[10px] font-semibold"
                            title="장표를 React (TSX) 컴포넌트 코드로 내보내기"
                          >
                            <FileCode size={11} className="text-purple-500" />
                            <span className="hidden xl:inline">코드</span>
                          </button>
                        </div>

                        {/* 2. Duplicate & Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateArtboard(artboard.id);
                          }}
                          className="p-1 hover:bg-white rounded text-slate-500 shadow-2xs"
                          title="화면 복제 (Ctrl+D)"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteArtboard(artboard.id);
                          }}
                          className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-500 shadow-2xs"
                          title="화면 삭제"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Artboard Frame with Selection Ring */}
                    <div
                      id={`artboard-frame-${artboard.id}`}
                      className={`relative rounded-2xl overflow-hidden transition shadow-xl ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 ring-offset-2'
                          : 'hover:ring-1 hover:ring-slate-400'
                      }`}
                      style={{ width: `${artboard.width}px`, height: `${artboard.height}px` }}
                    >
                      {/* Corner Handles */}
                      {isSelected && (
                        <>
                          <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -top-1.5 -left-1.5 rounded-xs z-40 pointer-events-none" />
                          <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -top-1.5 -right-1.5 rounded-xs z-40 pointer-events-none" />
                          <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -bottom-1.5 -left-1.5 rounded-xs z-40 pointer-events-none" />
                          {/* Interactive Drag-to-Resize Bottom-Right Handle */}
                          <div
                            onMouseDown={(e) => handleResizeMouseDown(e, artboard)}
                            className="w-4 h-4 bg-indigo-600 border-2 border-white absolute -bottom-2 -right-2 rounded-xs z-50 cursor-nwse-resize hover:scale-125 transition-transform shadow-md flex items-center justify-center group/handle"
                            title="드래그하여 크기 변경 (W × H)"
                          >
                            <div className="w-1 h-1 bg-white rounded-full pointer-events-none" />
                          </div>
                        </>
                      )}

                      {/* Resizing Live Dimension Badge */}
                      {resizingArtboardId === artboard.id && (
                        <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-1 rounded-md shadow-lg z-50 border border-slate-700 pointer-events-none animate-in fade-in">
                          {artboard.width} × {artboard.height}
                        </div>
                      )}

                      {/* Pure React High-Performance Virtual DOM Renderer */}
                      <VNodeRenderer
                        node={artboard.rootNode}
                        selectedNodeId={isSelected ? selectedNodeId : null}
                        onSelectNode={(node) => {
                          setSelectedArtboardId(artboard.id);
                          setSelectedNodeId(node.id);
                        }}
                        onUpdateContent={handleUpdateContent}
                        onDeleteNode={handleDeleteNode}
                        tweakValues={artboard.tweakValues}
                        interactive={true}
                      />
                    </div>
                  </div>
                );
              })}

              {/* + Add New Frame Button */}
              <div
                onClick={() => setIsNewFrameOpen(true)}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white/40 hover:bg-white/80 transition w-64 min-h-[300px] text-center gap-3 cursor-pointer group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
                  <Plus size={18} />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">새 프레임 추가 (F)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">기기 프리셋 또는 템플릿 선택</div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar Resize Handle */}
        {isRightSidebarOpen && (
          <div
            onMouseDown={handleRightResizeStart}
            onDoubleClick={() => setRightSidebarWidth(320)}
            className={`w-1.5 hover:w-2 hover:bg-indigo-500 active:bg-indigo-600 transition-all cursor-col-resize z-30 select-none relative shrink-0 group flex items-center justify-center ${
              isResizingRight ? 'bg-indigo-600 w-2' : 'bg-slate-200/80'
            }`}
            title="드래그하여 우측 패널 크기 조절 (더블 클릭 시 기본값 320px 복원)"
          >
            <div
              className={`w-0.5 h-6 rounded-full transition-opacity ${
                isResizingRight
                  ? 'bg-white opacity-100'
                  : 'bg-slate-400 group-hover:bg-white opacity-40 group-hover:opacity-100'
              }`}
            />
          </div>
        )}

        {/* 4. Right Sidebar (Properties | Events | Code | Dynamic Tweaks) */}
        <RightSidebar
          width={rightSidebarWidth}
          artboard={selectedArtboard}
          selectedNode={selectedNode}
          allArtboards={artboards}
          onSelectArtboard={(id) => {
            setSelectedArtboardId(id);
            setSelectedNodeId(null);
          }}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onUpdateArtboard={(updates) => {
            pushHistory(artboards);
            setArtboards((prev) =>
              prev.map((a) => (a.id === selectedArtboard?.id ? { ...a, ...updates } : a))
            );
          }}
          onUpdateCode={() => {}}
          onUpdateTweakValue={(key, val) => {
            if (!selectedArtboard) return;
            const nextTweaks = { ...(selectedArtboard.tweakValues || {}), [key]: val };
            setArtboards((prev) =>
              prev.map((a) => (a.id === selectedArtboard.id ? { ...a, tweakValues: nextTweaks } : a))
            );
          }}
          onAddTweakDefinition={(def) => {
            if (!selectedArtboard) return;
            const nextSchema = [...(selectedArtboard.tweaksSchema || []), def];
            const nextTweaks = { ...(selectedArtboard.tweakValues || {}), [def.id]: def.defaultValue };
            setArtboards((prev) =>
              prev.map((a) =>
                a.id === selectedArtboard.id
                  ? { ...a, tweaksSchema: nextSchema, tweakValues: nextTweaks }
                  : a
              )
            );
          }}
          onRemoveTweakDefinition={(id) => {
            if (!selectedArtboard) return;
            const nextSchema = (selectedArtboard.tweaksSchema || []).filter((s) => s.id !== id);
            setArtboards((prev) =>
              prev.map((a) => (a.id === selectedArtboard.id ? { ...a, tweaksSchema: nextSchema } : a))
            );
          }}
          activeCode={activeCode}
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          onOpenExport={() => setIsExportOpen(true)}
        />
      </div>

      {/* 5. Modals & Dialogs (Direct Virtual DOM PlayModal) */}
      <PlayModal
        artboards={artboards}
        initialIndex={currentIndex >= 0 ? currentIndex : 0}
        isOpen={isPlayOpen}
        onClose={() => setIsPlayOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        initialTab={settingsTab}
      />

      {/* Floating Export Toast Notification */}
      {exportToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Check size={14} className="text-emerald-400" />
          <span>{exportToast}</span>
        </div>
      )}

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectName={docTitle}
      />

      <GitDesktopModal
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
        gitStatus={gitStatus}
        pageDocsPath={settings.pageDocsPath || 'docs/ui-boards'}
        workspacePath={settings.workspacePath}
        onRefresh={refreshGitStatus}
      />

      <NewArtboardModal
        isOpen={isNewFrameOpen}
        onClose={() => setIsNewFrameOpen(false)}
        nextIndex={artboards.length + 1}
        onAddArtboard={(newArtboard, template = 'blank') => {
          let rootNode: VNode;
          const ts = Date.now();

          if (template === 'login') {
            rootNode = {
              id: `node-${ts}-root`,
              type: 'frame',
              name: 'Login Frame Root',
              style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#090d16',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#ffffff'
              },
              children: [
                {
                  id: `node-${ts}-header`,
                  type: 'box',
                  name: 'Header Group',
                  style: { display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 32 },
                  children: [
                    {
                      id: `node-${ts}-title`,
                      type: 'text',
                      name: 'Login Title',
                      content: '환영합니다',
                      style: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' }
                    },
                    {
                      id: `node-${ts}-sub`,
                      type: 'text',
                      name: 'Subtitle',
                      content: '계정으로 서비스를 시작하세요',
                      style: { fontSize: 13, color: '#94a3b8' }
                    }
                  ]
                },
                {
                  id: `node-${ts}-form`,
                  type: 'card',
                  name: 'Input Fields Group',
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    backgroundColor: '#131b2e',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: '#1e293b'
                  },
                  children: [
                    {
                      id: `node-${ts}-email`,
                      type: 'input',
                      name: 'Email Input',
                      content: 'user@company.com',
                      style: { padding: 12, borderRadius: 10, backgroundColor: '#090d16', color: '#ffffff' }
                    },
                    {
                      id: `node-${ts}-pw`,
                      type: 'input',
                      name: 'Password Input',
                      content: '••••••••••••',
                      style: { padding: 12, borderRadius: 10, backgroundColor: '#090d16', color: '#ffffff' }
                    }
                  ]
                },
                {
                  id: `node-${ts}-btn`,
                  type: 'button',
                  name: 'Submit Button',
                  content: '로그인 및 계속하기',
                  style: {
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    width: '100%',
                    textAlign: 'center'
                  }
                }
              ]
            };
          } else if (template === 'dashboard') {
            rootNode = {
              id: `node-${ts}-root`,
              type: 'frame',
              name: 'Dashboard Root',
              style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#0f172a',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                color: '#ffffff'
              },
              children: [
                {
                  id: `node-${ts}-top`,
                  type: 'box',
                  name: 'Dashboard Header',
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                  children: [
                    {
                      id: `node-${ts}-dtitle`,
                      type: 'text',
                      name: 'Dashboard Title',
                      content: '비즈니스 실시간 요약',
                      style: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' }
                    },
                    {
                      id: `node-${ts}-badge`,
                      type: 'badge',
                      name: 'Live Badge',
                      content: '● 실시간 연동',
                      style: { fontSize: 11, color: '#10b981', padding: 4, borderRadius: 6, backgroundColor: '#064e3b' }
                    }
                  ]
                },
                {
                  id: `node-${ts}-stats`,
                  type: 'box',
                  name: 'Stats Grid Row',
                  style: { display: 'flex', flexDirection: 'row', gap: 10 },
                  children: [
                    {
                      id: `node-${ts}-s1`,
                      type: 'card',
                      name: 'Metric Card 1',
                      style: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: '#1e293b' },
                      children: [
                        { id: `node-${ts}-s1-l`, type: 'text', name: 'Label', content: '일일 활성 유저', style: { fontSize: 11, color: '#94a3b8' } },
                        { id: `node-${ts}-s1-v`, type: 'text', name: 'Value', content: '2,840명', style: { fontSize: 20, fontWeight: 'bold', color: '#38bdf8' } }
                      ]
                    },
                    {
                      id: `node-${ts}-s2`,
                      type: 'card',
                      name: 'Metric Card 2',
                      style: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: '#1e293b' },
                      children: [
                        { id: `node-${ts}-s2-l`, type: 'text', name: 'Label', content: '결제 전환율', style: { fontSize: 11, color: '#94a3b8' } },
                        { id: `node-${ts}-s2-v`, type: 'text', name: 'Value', content: '4.8%', style: { fontSize: 20, fontWeight: 'bold', color: '#10b981' } }
                      ]
                    }
                  ]
                },
                {
                  id: `node-${ts}-dbtn`,
                  type: 'button',
                  name: 'Report Button',
                  content: '새 리포트 생성 및 공유',
                  style: { padding: 12, borderRadius: 12, backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', width: '100%', textAlign: 'center' }
                }
              ]
            };
          } else {
            rootNode = {
              id: `node-${ts}-root`,
              type: 'frame',
              name: 'Frame Root',
              style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 12
              },
              children: [
                {
                  id: `node-title-${ts}`,
                  type: 'text',
                  name: 'Title Text',
                  content: newArtboard.title,
                  style: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' }
                },
                {
                  id: `node-desc-${ts}`,
                  type: 'text',
                  name: 'Subtitle Text',
                  content: '새로 생성된 가상 DOM 캔버스',
                  style: { fontSize: 12, color: '#64748b' }
                }
              ]
            };
          }

          const newVdomBoard: VDomArtboard = {
            id: newArtboard.id,
            title: newArtboard.title,
            viewport: newArtboard.viewport,
            x: 0,
            y: 0,
            width: newArtboard.width,
            height: newArtboard.height,
            rootNode,
            tweaksSchema: [],
            tweakValues: {}
          };
          pushHistory(artboards);
          setArtboards([...artboards, newVdomBoard]);
          setSelectedArtboardId(newVdomBoard.id);
        }}
      />
    </div>
  );
}
