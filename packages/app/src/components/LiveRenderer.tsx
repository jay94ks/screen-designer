import React, { useEffect, useRef, useState } from 'react';

interface LiveRendererProps {
  code: string;
  tweakValues: Record<string, any>;
  width: number;
  height: number;
  onSelectElement?: (info: any) => void;
  interactive?: boolean;
}

export const LiveRenderer: React.FC<LiveRendererProps> = ({
  code,
  tweakValues,
  width,
  height,
  onSelectElement,
  interactive = true
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Listen for error or selection events from iframe
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'LIVE_RENDER_ERROR') {
        setRenderError(e.data.payload);
      } else if (e.data?.type === 'LIVE_RENDER_SUCCESS') {
        setRenderError(null);
      } else if (e.data?.type === 'ELEMENT_INSPECTED') {
        if (onSelectElement) onSelectElement(e.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);

    const safeTweaks = JSON.stringify(tweakValues || {});

    // Complete isolated sandbox template with Babel Standalone, React, Lucide and Tailwind
    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: transparent;
            user-select: ${interactive ? 'auto' : 'none'};
          }
          .inspected-active {
            outline: 2px solid #6366f1 !important;
            outline-offset: 2px !important;
          }
          /* Custom scrollbar */
          ::-webkit-scrollbar { width: 5px; height: 5px; }
          ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
        </style>
      </head>
      <body>
        <div id="root"></div>

        <script type="text/babel">
          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'LIVE_RENDER_ERROR', payload: String(msg) }, '*');
          };

          try {
            const tweaks = ${safeTweaks};

            // Custom component wrapper function
            function CanvasHost() {
              // Inject user code or evaluate
              ${
                code.trim().startsWith('<') || code.trim().startsWith('//') || code.trim().startsWith('function') || code.trim().startsWith('export')
                  ? `
                    // If code contains export default or function component
                    ${code.replace(/export\s+default\s+function/, 'function UserComponent').replace(/export\s+default\s+/, 'const UserComponent = ')}
                    
                    if (typeof UserComponent !== 'undefined') {
                      return <UserComponent {...tweaks} tweaks={tweaks} />;
                    } else {
                      return (
                        <div id="rendered-content">
                          ${code}
                        </div>
                      );
                    }
                  `
                  : `
                    return (
                      <div id="rendered-content">
                        ${code}
                      </div>
                    );
                  `
              }
            }

            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<CanvasHost />);
            window.parent.postMessage({ type: 'LIVE_RENDER_SUCCESS' }, '*');
          } catch (err) {
            window.parent.postMessage({ type: 'LIVE_RENDER_ERROR', payload: err.message }, '*');
          }

          // Click inspection listener
          let activeElem = null;
          document.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeElem) activeElem.classList.remove('inspected-active');
            const target = e.target;
            target.classList.add('inspected-active');
            activeElem = target;

            const computed = window.getComputedStyle(target);
            const info = {
              elementTag: target.tagName.toLowerCase(),
              elementId: target.id || undefined,
              className: target.className || undefined,
              textSnippet: (target.innerText || '').slice(0, 60),
              appliedStyles: {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                padding: computed.padding,
                margin: computed.margin,
                borderRadius: computed.borderRadius,
                display: computed.display
              }
            };
            window.parent.postMessage({ type: 'ELEMENT_INSPECTED', payload: info }, '*');
          }, true);
        </script>
      </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [code, tweakValues, interactive]);

  return (
    <div
      className="relative bg-white overflow-hidden shadow-sm"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <iframe
        ref={iframeRef}
        title="Live Artboard Sandbox"
        className="w-full h-full border-0 block"
        sandbox="allow-scripts allow-same-origin"
      />

      {renderError && (
        <div className="absolute inset-x-2 bottom-2 p-3 bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs rounded-lg backdrop-blur z-50 font-mono shadow-xl">
          <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
            <span>⚠️ 컴파일/렌더링 에러</span>
          </div>
          <div className="text-[11px] leading-relaxed break-words">{renderError}</div>
        </div>
      )}
    </div>
  );
};
