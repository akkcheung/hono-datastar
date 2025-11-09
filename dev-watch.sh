#!/usr/bin/env bash

set -e
ENTRY_FILE="src/server.js"

find . -type f -name "*.js" | entr -r bun "$ENTRY_FILE"
