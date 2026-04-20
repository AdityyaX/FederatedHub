#!/usr/bin/env bash
# setup.sh - bootstrap script for FederatedHub
# Usage: ./setup.sh

set -euo pipefail

MIN_NODE_MAJOR=18
MIN_NPM_MAJOR=9

section() {
  printf "\n==============================\n%s\n==============================\n" "$1"
}

fail() {
  printf "Error: %s\n" "$1" >&2
  exit 1
}

extract_major() {
  # Accepts versions like "v18.20.4" or "9.8.1".
  printf "%s" "$1" | sed -E 's/^v?([0-9]+).*/\1/'
}

section "Checking prerequisites"

command -v node >/dev/null 2>&1 || fail "Node.js is not installed. Install Node.js 18+ and rerun."
command -v npm >/dev/null 2>&1 || fail "npm is not installed. Install npm 9+ and rerun."

NODE_VERSION="$(node -v)"
NPM_VERSION="$(npm -v)"
NODE_MAJOR="$(extract_major "$NODE_VERSION")"
NPM_MAJOR="$(extract_major "$NPM_VERSION")"

printf "Detected Node.js: %s\n" "$NODE_VERSION"
printf "Detected npm: %s\n" "$NPM_VERSION"

if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
  fail "Node.js ${MIN_NODE_MAJOR}+ is required (found ${NODE_VERSION})."
fi

if [ "$NPM_MAJOR" -lt "$MIN_NPM_MAJOR" ]; then
  fail "npm ${MIN_NPM_MAJOR}+ is required (found ${NPM_VERSION})."
fi

if [ ! -f "package.json" ]; then
  fail "Run this script from the repository root (package.json not found)."
fi

section "Installing dependencies"
if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

section "Building shared SDK"
npm run build:sdk

section "Setup complete"
printf "Run 'npm run dev' to start Shell, Analytics, and Dashboard.\n"
