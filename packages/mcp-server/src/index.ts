#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CanvasBridge } from './bridge.js';
import { TOOLS, ToolDefinition, executeTool } from './tools.js';

export { TOOLS, executeTool, CanvasBridge };

export function createMcpServer(bridge: CanvasBridge): McpServer {
  const server = new McpServer({
    name: 'screen-designer-mcp',
    version: '0.1.0'
  });

  for (const tool of TOOLS) {
    // Register canonical tool name
    server.tool(
      tool.name,
      tool.description,
      tool.parameters.shape,
      async (args: any) => {
        return await tool.execute(args, bridge);
      }
    );

    // Register backwards-compatible aliases
    if (tool.aliases && tool.aliases.length > 0) {
      for (const alias of tool.aliases) {
        server.tool(
          alias,
          `[Alias for ${tool.name}] ${tool.description}`,
          tool.parameters.shape,
          async (args: any) => {
            return await tool.execute(args, bridge);
          }
        );
      }
    }
  }

  return server;
}

export async function runServer(): Promise<void> {
  const bridge = new CanvasBridge(49494);
  await bridge.start();

  const server = createMcpServer(bridge);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[ScreenDesigner MCP] Stdio transport connected and ready with ${TOOLS.length} tools.`);
}

// Auto-run only if executed directly as entrypoint
const isDirectRun = process.argv[1] && (
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
  process.argv[1].endsWith('screen-designer-mcp') ||
  process.env.MCP_SERVER_AUTO_START === 'true'
);

if (isDirectRun && process.env.MCP_SERVER_NO_AUTO_START !== 'true') {
  runServer().catch((err) => {
    console.error('[ScreenDesigner MCP] Failed to start server:', err);
    process.exit(1);
  });
}
