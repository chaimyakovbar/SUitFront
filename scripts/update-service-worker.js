#!/usr/bin/env node

/**
 * Script to update service worker cache version
 * This ensures that when we deploy, the service worker gets a new cache name
 * and forces all clients to update their cache
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swPath = path.join(__dirname, '../public/sw.js');

if (!fs.existsSync(swPath)) {
  console.error('Service worker file not found at:', swPath);
  process.exit(1);
}

// Read the current service worker
let swContent = fs.readFileSync(swPath, 'utf8');

// Generate new timestamp
const newTimestamp = Date.now();

// Update the cache version
swContent = swContent.replace(
  /const CACHE_VERSION = \d+;/,
  `const CACHE_VERSION = ${newTimestamp};`
);

// Write back to file
fs.writeFileSync(swPath, swContent);

console.log(`✅ Service Worker cache version updated to: ${newTimestamp}`);
console.log(`📁 Updated file: ${swPath}`);
