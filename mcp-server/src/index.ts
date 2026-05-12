#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getConfig } from './config.js';
import { Venym SearchAPI } from './venym-search-api.js';
import {
  createSwiftSearchTool,
  createScrapeForgeTool,
  createDeepDiveTool,
  createExtractContactsTool,
  createBatchScrapeTool
} from './tools.js';

async function main() {
  try {
    // Load configuration
    const config = getConfig();
    const api = new Venym SearchAPI(config);

    // Create MCP server
    const server = new McpServer({
      name: 'venym-search-mcp-server',
      version: '1.0.0',
      description: 'Model Context Protocol server for Venym Search APIs - providing web search, scraping, and research capabilities'
    });

    // Register tools
    const swiftSearchTool = createSwiftSearchTool(api);
    server.registerTool(
      swiftSearchTool.name,
      {
        title: 'SwiftSearch',
        description: swiftSearchTool.description,
        inputSchema: swiftSearchTool.inputSchema
      },
      swiftSearchTool.handler
    );

    const scrapeForgeTool = createScrapeForgeTool(api);
    server.registerTool(
      scrapeForgeTool.name,
      {
        title: 'ScrapeForge',
        description: scrapeForgeTool.description,
        inputSchema: scrapeForgeTool.inputSchema
      },
      scrapeForgeTool.handler
    );

    const deepDiveTool = createDeepDiveTool(api);
    server.registerTool(
      deepDiveTool.name,
      {
        title: 'DeepDive',
        description: deepDiveTool.description,
        inputSchema: deepDiveTool.inputSchema
      },
      deepDiveTool.handler
    );

    const extractContactsTool = createExtractContactsTool();
    server.registerTool(
      extractContactsTool.name,
      {
        title: 'Extract Contacts',
        description: extractContactsTool.description,
        inputSchema: extractContactsTool.inputSchema
      },
      extractContactsTool.handler
    );

    const batchScrapeTool = createBatchScrapeTool(api);
    server.registerTool(
      batchScrapeTool.name,
      {
        title: 'Batch Scrape',
        description: batchScrapeTool.description,
        inputSchema: batchScrapeTool.inputSchema
      },
      batchScrapeTool.handler
    );

    // Connect via stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // Log server start (to stderr so it doesn't interfere with MCP communication)
    console.error('Venym Search MCP Server started successfully');
    console.error(`API Base URL: ${config.baseUrl}`);
    console.error('Tools registered: swift_search, scrape_forge, deep_dive, extract_contacts, batch_scrape');

  } catch (error) {
    console.error('Failed to start Venym Search MCP Server:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.error('Venym Search MCP Server shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Venym Search MCP Server shutting down...');
  process.exit(0);
});

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});