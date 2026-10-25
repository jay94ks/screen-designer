import { WebSocketServer, WebSocket } from 'ws';
import { AppState, Artboard, DesignTokens, InspectorSelection } from './types.js';

export class CanvasBridge {
  private wss: WebSocketServer | null = null;
  private client: WebSocket | null = null;
  private state: AppState = {
    artboards: [],
    designTokens: {},
    sliderOverrides: {},
    selectedElement: null
  };

  constructor(private port: number = 49494) {}

  public start(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.wss = new WebSocketServer({ port: this.port });

        this.wss.on('listening', () => {
          console.error(`[ScreenDesigner Bridge] WebSocket server listening on port ${this.port}`);
          resolve();
        });

        this.wss.on('error', (err: any) => {
          console.error(`[ScreenDesigner Bridge] WebSocket server notice: ${err.message}`);
          resolve();
        });

        this.wss.on('connection', (ws) => {
          this.client = ws;
          console.error('[ScreenDesigner Bridge] Electron Canvas connected.');

          // Initial state sync
          this.send({ type: 'SYNC_STATE', payload: this.state });

          ws.on('message', (data) => {
            try {
              const message = JSON.parse(data.toString());
              this.handleIncoming(message);
            } catch (e) {
              console.error('[ScreenDesigner Bridge] Failed to parse message', e);
            }
          });

          ws.on('close', () => {
            this.client = null;
            console.error('[ScreenDesigner Bridge] Electron Canvas disconnected.');
          });
        });
      } catch (e: any) {
        console.error(`[ScreenDesigner Bridge] Failed to initialize WebSocket server: ${e.message}`);
        resolve();
      }
    });
  }

  private handleIncoming(msg: { type: string; payload: any }) {
    switch (msg.type) {
      case 'ELEMENT_SELECTED':
        this.state.selectedElement = msg.payload as InspectorSelection;
        break;
      case 'SLIDERS_CHANGED':
        this.state.sliderOverrides = { ...this.state.sliderOverrides, ...msg.payload };
        break;
      case 'TOKENS_CHANGED':
        this.state.designTokens = { ...this.state.designTokens, ...msg.payload };
        break;
      default:
        break;
    }
  }

  public isConnected(): boolean {
    return this.client !== null && this.client.readyState === WebSocket.OPEN;
  }

  public send(msg: { type: string; payload: any }) {
    if (this.client && this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify(msg));
    }
  }

  public setWorkspace(path: string) {
    this.state.workspacePath = path;
    this.send({ type: 'SET_WORKSPACE', payload: { path } });
  }

  public setArtboards(artboards: Artboard[]) {
    this.state.artboards = artboards;
    this.send({ type: 'SET_ARTBOARDS', payload: artboards });
  }

  public updateArtboard(id: string, code: string, title?: string) {
    const idx = this.state.artboards.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.state.artboards[idx].code = code;
      if (title) this.state.artboards[idx].title = title;
    } else {
      this.state.artboards.push({
        id,
        title: title || id,
        viewport: 'mobile',
        width: 375,
        height: 812,
        code
      });
    }
    this.send({ type: 'UPDATE_ARTBOARD', payload: { id, code, title } });
  }

  public setTokens(tokens: DesignTokens) {
    this.state.designTokens = { ...this.state.designTokens, ...tokens };
    this.send({ type: 'SET_TOKENS', payload: this.state.designTokens });
  }

  public getState(): AppState {
    return this.state;
  }
}
