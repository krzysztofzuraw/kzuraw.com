---
title: Dynamic Configuration for MCP Servers Using Environment Variables
description: Learn how to dynamically configure your MCP (Model Context Protocol) GraphQL server with environment variables for flexible and secure deployment.
pubDate: 2025-06-01T12:18:45Z
slug: dynamic-configuration-for-mcp-servers-using-environment-variables
source:
  url: https://dev.to/saleor/dynamic-configuration-for-mcp-servers-using-environment-variables-2a0o
  title: "Dynamic Configuration for MCP Servers Using Environment Variables"
---

This blog post explains how to configure Model Context Protocol ([MCP](https://modelcontextprotocol.io/introduction)) server that can be dynamically controlled through environment variables.

## Problem

When setting up [mcp-graphql](https://github.com/blurrah/mcp-graphql), we needed a way for the MCP server to use a dynamic GraphQL endpoint and token. Hardcoding these values was not an option, as different Saleor environments require different configurations.

## Solution

Here’s what we did:

1. Created a shell script to manage the mcp-graphql startup.
2. Loaded the endpoint and token from a **`.env`** file within the script.
3. Launched the MCP server using these environment variables.
4. Used this shell script as the entry point for MCP configuration in clients like Cursor or VSCode

Below is the shell script (`start-mcp-graphql.sh`) that performs steps 1–3:

```bash
#!/usr/bin/env bash

set -a
# Load environment variables from .env file next to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"
set +a

ENDPOINT="$MCP_GRAPHQL_ENDPOINT" HEADERS="{\"Authorization\":\"Bearer $MCP_GRAPHQL_TOKEN\"}" npx mcp-graphql
```

### Using the Script in MCP Clients

To use this setup with Cursor, add the following to your configuration:

```json
{
  "mcpServers": {
    "Saleor GraphQL API": {
      "command": "./mcp/start-mcp-graphql.sh"
    }
  }
}
```

For VSCode, configure the server as follows:

```json
{
  "servers": {
    "Saleor GraphQL API": {
      "type": "stdio",
      "command": "${workspaceFolder}/mcp/start-mcp-graphql.sh"
    }
  }
}
```

## Summary

With this approach, you can easily configure your MCP server dynamically using environment variables. You’ll find all the source code, scripts, and editor configs ready to explore in the [Saleor apps repository](https://github.com/saleor/apps/tree/main).
