import React, { useEffect, useRef } from 'react';

export interface ArtboardData {
  id: string;
  title: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  code: string;
  description?: string;
}

interface ArtboardCardProps {
  artboard: ArtboardData;
  viewportOverride?: 'mobile' | 'tablet' | 'desktop';
  onSelectElement: (info: any) => void;
  sliderOverrides: Record<string, string | number>;
  designTokens: Record<string, string>;
}

export const ArtboardCard: React.FC<ArtboardCardProps> = ({
  artboard,
  viewportOverride,
  onSelectElement,
  sliderOverrides,
  designTokens
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const vp = viewportOverride || artboard.viewport;
  const width = vp === 'mobile' ? 375 : vp === 'tablet' ? 768 : 1024;
  const height = vp === 'mobile' ? 780 : 800;

  // Render content into sandboxed iframe with Tailwind and click inspection
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Generate dynamic inline style overrides from sliders and tokens
    const dynamicCss = `
      :root {
        --primary: ${designTokens.primaryColor || '#3b82f6'};
        --radius: ${sliderOverrides.borderRadius ? `${sliderOverrides.borderRadius}px` : '8px'};
        --padding-scale: ${sliderOverrides.paddingScale || 1};
      }
      * {
        border-radius: var(--radius) !important;
      }
      .inspected-active {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ko" class="dark">
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${dynamicCss}</style>
      </head>
      <body class="bg-slate-900 text-slate-100 p-4 font-sans antialiased">
        <div id="artboard-root">
          ${artboard.code}
        </div>
        <script>
          let lastActive = null;
          document.addEventListener('click', (e) => {
            e.stopPropagation();
            if (lastActive) lastActive.classList.remove('inspected-active');
            const target = e.target;
            target.classList.add('inspected-active');
            lastActive = target;

            const info = {
              elementTag: target.tagName.toLowerCase(),
              elementId: target.id || undefined,
              className: target.className || undefined,
              textSnippet: (target.innerText || '').slice(0, 50),
              appliedStyles: {
                backgroundColor: window.getComputedStyle(target).backgroundColor,
                color: window.getComputedStyle(target).color,
                fontSize: window.getComputedStyle(target).fontSize,
                borderRadius: window.getComputedStyle(target).borderRadius,
              }
            };
            window.parent.postMessage({ type: 'SCREEN_DESIGNER_SELECT', payload: info }, '*');
          }, true);
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [artboard.code, sliderOverrides, designTokens, vp]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SCREEN_DESIGNER_SELECT') {
        onSelectElement(e.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSelectElement]);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200">
      {/* Artboard Header */}
      <div className="h-10 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
            {artboard.title}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 uppercase">
          {width} × {height}
        </span>
      </div>

      {/* Artboard Screen Iframe */}
      <div
        className="bg-slate-950 flex items-center justify-center p-2 overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <iframe
          ref={iframeRef}
          title={artboard.title}
          className="w-full h-full border-0 rounded-xl bg-slate-900"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};
