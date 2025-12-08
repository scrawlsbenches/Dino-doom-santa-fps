#!/usr/bin/env node
/**
 * Build script to create a single-file, portable HTML version of DINO DOOM
 *
 * This bundles all JS modules and inlines CSS into one self-contained HTML file
 * Perfect for sharing, hosting anywhere, or playing offline
 */

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function build() {
    console.log('🦖 DINO DOOM Build Script');
    console.log('Building single-file portable version...\n');

    // 1. Bundle JavaScript with esbuild
    console.log('📦 Bundling JavaScript modules...');
    const jsResult = await esbuild.build({
        entryPoints: [path.join(rootDir, 'js/main.js')],
        bundle: true,
        minify: true,
        format: 'iife',
        write: false,
        target: ['es2020'],
    });
    const bundledJS = jsResult.outputFiles[0].text;
    console.log(`   ✓ JS bundled: ${(bundledJS.length / 1024).toFixed(1)}KB`);

    // 2. Read and minify CSS
    console.log('🎨 Processing CSS...');
    let css = fs.readFileSync(path.join(rootDir, 'css/styles.css'), 'utf8');
    // Basic CSS minification
    css = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around punctuation
        .replace(/;}/g, '}') // Remove trailing semicolons
        .trim();
    console.log(`   ✓ CSS minified: ${(css.length / 1024).toFixed(1)}KB`);

    // 3. Read HTML template and extract body content
    console.log('🏗️  Building HTML...');
    const originalHTML = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

    // Extract the body content (everything inside game-container)
    const bodyMatch = originalHTML.match(/<div id="game-container">[\s\S]*?<\/div>\s*<script/);
    const bodyContent = bodyMatch ? bodyMatch[0].replace(/<script$/, '') : '';

    // Build the single-file HTML
    const singleFileHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DINO DOOM: Santa's Last Stand</title>
    <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Orbitron:wght@700;900&family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    ${bodyContent}
    <script>${bundledJS}</script>
</body>
</html>`;

    // 4. Write the output
    const distDir = path.join(rootDir, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    const outputPath = path.join(distDir, 'dino-doom.html');
    fs.writeFileSync(outputPath, singleFileHTML);

    const finalSize = (singleFileHTML.length / 1024).toFixed(1);
    console.log(`   ✓ HTML generated\n`);

    console.log('═══════════════════════════════════════════════');
    console.log(`🎮 BUILD COMPLETE!`);
    console.log(`📁 Output: dist/dino-doom.html`);
    console.log(`📊 Size: ${finalSize}KB`);
    console.log('═══════════════════════════════════════════════');
    console.log('\n✨ Just open dino-doom.html in any browser to play!');
    console.log('   Share it, host it, carry it on a USB - it just works!\n');
}

build().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
