#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Crear el servidor MCP
const server = new Server({
  name: 'mcp-server-demo',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Handler para listar herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'obtener_hora',
        description: 'Obtiene la hora actual del sistema',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    ]
  };
});

// Handler para ejecutar herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'obtener_hora') {
    const horaActual = new Date().toLocaleTimeString('es-ES');
    return {
      content: [
        {
          type: 'text',
          text: `La hora actual es: ${horaActual}`
        }
      ]
    };
  }

  throw new Error(`Herramienta desconocida: ${name}`);
});

// Iniciar el servidor con transporte stdio
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Servidor MCP iniciado');
}

main().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
