const fs = require('fs');
const path = require('path');

const DOCS = path.resolve(__dirname, '..', 'docs');
const BOOK = path.resolve(__dirname, '..', 'book');
const OUTPUT = path.resolve(BOOK, 'crafty-book.md');

// Normalize image paths: all images should be relative to docs/
function normalizeImagePaths(content, sourceDir) {
  // sourceDir is relative to DOCS, e.g. 'chapters' or ''
  return content.replace(
    /(!\[.*?\]\()(.*?)(\))/g,
    (match, prefix, imgPath, suffix) => {
      let normalized = imgPath;
      // If path starts with ../, resolve it relative to the source
      if (normalized.startsWith('../')) {
        normalized = normalized.replace('../', '');
      } else if (normalized.startsWith('./')) {
        normalized = normalized.replace('./', '');
      }
      // If coming from chapters/, images might be at ../illustrations/ -> illustrations/
      if (sourceDir === 'chapters' && normalized.startsWith('../')) {
        normalized = normalized.substring(3);
      }
      // Handle relative paths from chapter files
      if (sourceDir === '' && !normalized.startsWith('images/') && !normalized.startsWith('illustrations/')) {
        // Keep as is
      }
      return `${prefix}${normalized}${suffix}`;
    }
  );
}

function stripNav(lines) {
  const result = [...lines];
  while (result.length > 0 && (
    result[0].trim().startsWith('[Contents]') ||
    result[0].trim().startsWith('[') && result[0].trim().endsWith(')')
  )) {
    result.shift();
  }
  while (result.length > 0 && (
    result[result.length - 1].trim().startsWith('[Contents]') ||
    result[result.length - 1].trim().startsWith('[') && result[result.length - 1].trim().endsWith(')')
  )) {
    result.pop();
  }
  return result;
}

function readChapter(file) {
  const content = fs.readFileSync(path.join(DOCS, 'chapters', file), 'utf-8');
  let normalized = normalizeImagePaths(content, 'chapters');
  let lines = normalized.split('\n');
  lines = stripNav(lines);
  return lines.join('\n');
}

function readAppendix(file) {
  const content = fs.readFileSync(path.join(DOCS, 'appendix', file), 'utf-8');
  return normalizeImagePaths(content, 'appendix');
}

// Build combined markdown
const parts = [];

// YAML front matter for md-to-pdf
parts.push(`\
---
title: "Crafty: Building a WebGPU Voxel Game Engine"
author: Brendan Duncan
---

`);

// Title page (HTML for better control)
parts.push(`\
<div style="text-align: center; padding-top: 30%;">
  <h1 style="font-size: 2.5em; margin-bottom: 0.2em;">Crafty</h1>
  <h2 style="font-size: 1.5em; color: #555; font-weight: normal; margin-top: 0;">Building a WebGPU Voxel Game Engine</h2>
  <p style="margin-top: 3em; font-size: 1.1em; color: #777;">Brendan Duncan</p>
</div>

<div style="page-break-after: always;"></div>

`);

// Include the crafty.md front matter
const craftyMd = fs.readFileSync(path.join(DOCS, 'crafty.md'), 'utf-8');
const craftyLines = craftyMd.split('\n');
const tocIndex = craftyLines.findIndex(l => l.trim() === '## Table of Contents');
const introPart = tocIndex >= 0 ? craftyLines.slice(0, tocIndex).join('\n') : craftyMd;
parts.push(normalizeImagePaths(introPart, ''));
parts.push('\n\n<div style="page-break-after: always;"></div>\n\n');

// Table of Contents placeholder will be auto-generated

// Chapter files
const chapterFiles = fs.readdirSync(path.join(DOCS, 'chapters'))
  .filter(f => f.endsWith('.md'))
  .sort();

for (const file of chapterFiles) {
  parts.push(readChapter(file));
  parts.push('\n\n<div style="page-break-after: always;"></div>\n\n');
}

// Appendices heading
parts.push(`\
# Appendices

<div style="page-break-after: always;"></div>

`);

const appendixFiles = fs.readdirSync(path.join(DOCS, 'appendix'))
  .filter(f => f.endsWith('.md'))
  .sort();

for (const file of appendixFiles) {
  parts.push(readAppendix(file));
  parts.push('\n\n<div style="page-break-after: always;"></div>\n\n');
}

let combined = parts.join('\n');
// Clean up any remaining navigation links
combined = combined.replace(/^\[Contents\].*\n?/gm, '');
combined = combined.replace(/^\s*[-]{4,}\s*$/gm, '');

fs.writeFileSync(OUTPUT, combined, 'utf-8');
console.log(`Book written to ${OUTPUT}`);
console.log(`Size: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
