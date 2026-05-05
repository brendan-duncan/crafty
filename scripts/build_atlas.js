// Build texture atlas from Minecraft RTX texture pack
// Requires: npm install tga-js sharp

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read texture pack path from command line argument
const TEXTURE_PACK_PATH = process.argv[2];
if (!TEXTURE_PACK_PATH) {
  console.error('Usage: node build_atlas.js <path-to-texture-pack>');
  console.error('Example: node build_atlas.js Downloads\\Vanilla-RTX-1.26.12');
  process.exit(1);
}

if (!fs.existsSync(TEXTURE_PACK_PATH)) {
  console.error(`Error: Texture pack path does not exist: ${TEXTURE_PACK_PATH}`);
  process.exit(1);
}

const TEXTURE_LIST_PATH = path.join(TEXTURE_PACK_PATH, 'textures', 'textures_list.json');
if (!fs.existsSync(TEXTURE_LIST_PATH)) {
  console.error(`Error: textures_list.json not found at: ${TEXTURE_LIST_PATH}`);
  console.error('Make sure the texture pack path is correct.');
  process.exit(1);
}
const OUTPUT_DIR = path.join(__dirname, '../assets/generated_atlas');
const TILE_SIZE = 16; // Size of each texture tile
const ATLAS_COLS = 25; // Number of columns in atlas

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read texture list
console.log('Reading texture list...');
const textureList = JSON.parse(fs.readFileSync(TEXTURE_LIST_PATH, 'utf8'));
console.log(`Found ${textureList.length} textures`);

// Convert heightmap to normal map
function heightmapToNormal(heightData, width, height) {
  const normalData = Buffer.alloc(width * height * 4);
  const strength = 2.0; // Normal map strength

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Sample neighboring heights
      const xLeft = Math.max(0, x - 1);
      const xRight = Math.min(width - 1, x + 1);
      const yUp = Math.max(0, y - 1);
      const yDown = Math.min(height - 1, y + 1);

      const hL = heightData[(y * width + xLeft) * 4] / 255.0;
      const hR = heightData[(y * width + xRight) * 4] / 255.0;
      const hU = heightData[(yUp * width + x) * 4] / 255.0;
      const hD = heightData[(yDown * width + x) * 4] / 255.0;

      // Calculate gradients
      const dx = (hR - hL) * strength;
      const dy = (hD - hU) * strength;

      // Normalize
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const nx = (dx / len) * 0.5 + 0.5;
      const ny = (dy / len) * 0.5 + 0.5;
      const nz = (1 / len) * 0.5 + 0.5;

      normalData[idx + 0] = Math.floor(nx * 255);
      normalData[idx + 1] = Math.floor(ny * 255);
      normalData[idx + 2] = Math.floor(nz * 255);
      normalData[idx + 3] = 255;
    }
  }

  return normalData;
}

// Simple TGA parser (supports uncompressed 24/32-bit TGA)
function parseTGA(buffer) {
  const idLength = buffer[0];
  const colorMapType = buffer[1];
  const imageType = buffer[2];
  const width = buffer[12] | (buffer[13] << 8);
  const height = buffer[14] | (buffer[15] << 8);
  const bpp = buffer[16];
  const descriptor = buffer[17];

  // Only support uncompressed true-color images (type 2)
  if (imageType !== 2) {
    throw new Error(`Unsupported TGA image type: ${imageType}`);
  }

  const pixelDataOffset = 18 + idLength;
  const bytesPerPixel = bpp / 8;
  const imageSize = width * height * 4; // Always output RGBA
  const rgba = Buffer.alloc(imageSize);

  let srcIdx = pixelDataOffset;
  let dstIdx = 0;

  // TGA stores pixels in BGR or BGRA format, bottom-to-top by default
  const flipVertical = (descriptor & 0x20) === 0;

  for (let y = 0; y < height; y++) {
    const row = flipVertical ? (height - 1 - y) : y;

    for (let x = 0; x < width; x++) {
      dstIdx = (row * width + x) * 4;

      if (bytesPerPixel === 3) {
        // BGR -> RGBA
        rgba[dstIdx + 0] = buffer[srcIdx + 2]; // R
        rgba[dstIdx + 1] = buffer[srcIdx + 1]; // G
        rgba[dstIdx + 2] = buffer[srcIdx + 0]; // B
        rgba[dstIdx + 3] = 255;                // A
        srcIdx += 3;
      } else if (bytesPerPixel === 4) {
        // BGRA -> RGBA
        rgba[dstIdx + 0] = buffer[srcIdx + 2]; // R
        rgba[dstIdx + 1] = buffer[srcIdx + 1]; // G
        rgba[dstIdx + 2] = buffer[srcIdx + 0]; // B
        rgba[dstIdx + 3] = buffer[srcIdx + 3]; // A
        srcIdx += 4;
      }
    }
  }

  return { width, height, data: rgba };
}

// Load TGA file
async function loadTGA(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    const buffer = fs.readFileSync(filePath);
    const result = parseTGA(buffer);

    console.log(`Loaded ${path.basename(filePath)}: ${result.width}x${result.height}`);
    return result;
  } catch (err) {
    console.warn(`Failed to load ${filePath}: ${err.message}`);
    return null;
  }
}

// Create a default texture (magenta for missing textures)
function createDefaultTexture(size) {
  const data = Buffer.alloc(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = 255; // R
    data[i + 1] = 0;   // G
    data[i + 2] = 255; // B
    data[i + 3] = 255; // A
  }
  return { width: size, height: size, data };
}

// Create a flat normal map
function createDefaultNormal(size) {
  const data = Buffer.alloc(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = 128; // R (normal X)
    data[i + 1] = 128; // G (normal Y)
    data[i + 2] = 255; // B (normal Z pointing up)
    data[i + 3] = 255; // A
  }
  return { width: size, height: size, data };
}

// Create a default MER map (no metallic, no emission, mid roughness)
function createDefaultMER(size) {
  const data = Buffer.alloc(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = 0;   // R (metallic)
    data[i + 1] = 0;   // G (emission)
    data[i + 2] = 128; // B (roughness)
    data[i + 3] = 255; // A
  }
  return { width: size, height: size, data };
}

async function buildAtlas() {
  console.log('Loading textures...');

  const atlasRows = Math.ceil(textureList.length / ATLAS_COLS);
  const atlasWidth = ATLAS_COLS * TILE_SIZE;
  const atlasHeight = atlasRows * TILE_SIZE;

  console.log(`Atlas size: ${atlasWidth}x${atlasHeight} (${ATLAS_COLS}x${atlasRows} tiles)`);

  // Create buffers for each atlas
  const colorAtlas = Buffer.alloc(atlasWidth * atlasHeight * 4);
  const normalAtlas = Buffer.alloc(atlasWidth * atlasHeight * 4);
  const merAtlas = Buffer.alloc(atlasWidth * atlasHeight * 4);

  // Fill with default colors
  colorAtlas.fill(0);
  normalAtlas.fill(128);
  merAtlas.fill(0);

  const atlasData = [];
  let processedCount = 0;

  for (let i = 0; i < textureList.length; i++) {
    const textureName = textureList[i];
    const col = i % ATLAS_COLS;
    const row = Math.floor(i / ATLAS_COLS);

    if (!textureName.startsWith('textures/blocks/')) {
      continue; // Skip non-block textures for now
    }

    const colorPath = path.join(TEXTURE_PACK_PATH, `${textureName}.tga`);

    if (!fs.existsSync(colorPath)) {
      console.warn(`File not found: ${colorPath}`);
      continue;
    }

    console.log(`Processing ${i + 1}/${textureList.length}: ${textureName} at (${col}, ${row})`);
    
    const merPath = path.join(TEXTURE_PACK_PATH, `${textureName}_mer.tga`);
    const heightPath = path.join(TEXTURE_PACK_PATH, `${textureName}_heightmap.tga`);

    console.log(`  Color: ${colorPath}`);
    console.log(`  MER: ${merPath}`);
    console.log(`  Height: ${heightPath}`);

    // Load textures
    let colorTex = await loadTGA(colorPath);
    let merTex = await loadTGA(merPath);
    let heightTex = await loadTGA(heightPath);

    console.log(`  Loaded - Color: ${colorTex ? 'YES' : 'NO'}, MER: ${merTex ? 'YES' : 'NO'}, Height: ${heightTex ? 'YES' : 'NO'}`);

    // Use defaults if missing
    if (!colorTex) {
      console.log(`  Using default color texture`);
      colorTex = createDefaultTexture(TILE_SIZE);
    }
    if (!merTex) {
      console.log(`  Using default MER texture`);
      merTex = createDefaultMER(TILE_SIZE);
    }
    if (!heightTex) {
      console.log(`  Using default normal texture`);
      heightTex = createDefaultNormal(TILE_SIZE);
    }

    // Resize if necessary
    if (colorTex.width !== TILE_SIZE || colorTex.height !== TILE_SIZE) {
      const resized = await sharp(colorTex.data, {
        raw: { width: colorTex.width, height: colorTex.height, channels: 4 }
      })
        .resize(TILE_SIZE, TILE_SIZE, { kernel: 'nearest' })
        .raw()
        .toBuffer();
      colorTex = { width: TILE_SIZE, height: TILE_SIZE, data: resized };
    }

    if (merTex.width !== TILE_SIZE || merTex.height !== TILE_SIZE) {
      const resized = await sharp(merTex.data, {
        raw: { width: merTex.width, height: merTex.height, channels: 4 }
      })
        .resize(TILE_SIZE, TILE_SIZE, { kernel: 'nearest' })
        .raw()
        .toBuffer();
      merTex = { width: TILE_SIZE, height: TILE_SIZE, data: resized };
    }

    if (heightTex.width !== TILE_SIZE || heightTex.height !== TILE_SIZE) {
      const resized = await sharp(heightTex.data, {
        raw: { width: heightTex.width, height: heightTex.height, channels: 4 }
      })
        .resize(TILE_SIZE, TILE_SIZE, { kernel: 'nearest' })
        .raw()
        .toBuffer();
      heightTex = { width: TILE_SIZE, height: TILE_SIZE, data: resized };
    }

    // Convert heightmap to normal
    const normalTex = {
      width: TILE_SIZE,
      height: TILE_SIZE,
      data: heightmapToNormal(heightTex.data, TILE_SIZE, TILE_SIZE)
    };

    // Copy to atlas
    let nonZeroPixels = 0;
    for (let ty = 0; ty < TILE_SIZE; ty++) {
      for (let tx = 0; tx < TILE_SIZE; tx++) {
        const srcIdx = (ty * TILE_SIZE + tx) * 4;
        const dstX = col * TILE_SIZE + tx;
        const dstY = row * TILE_SIZE + ty;
        const dstIdx = (dstY * atlasWidth + dstX) * 4;

        // Copy color
        colorAtlas[dstIdx + 0] = colorTex.data[srcIdx + 0];
        colorAtlas[dstIdx + 1] = colorTex.data[srcIdx + 1];
        colorAtlas[dstIdx + 2] = colorTex.data[srcIdx + 2];
        colorAtlas[dstIdx + 3] = colorTex.data[srcIdx + 3];

        // Count non-zero pixels for verification
        if (colorTex.data[srcIdx + 0] !== 0 || colorTex.data[srcIdx + 1] !== 0 || colorTex.data[srcIdx + 2] !== 0) {
          nonZeroPixels++;
        }

        // Copy normal
        normalAtlas[dstIdx + 0] = normalTex.data[srcIdx + 0];
        normalAtlas[dstIdx + 1] = normalTex.data[srcIdx + 1];
        normalAtlas[dstIdx + 2] = normalTex.data[srcIdx + 2];
        normalAtlas[dstIdx + 3] = normalTex.data[srcIdx + 3];

        // Copy MER
        merAtlas[dstIdx + 0] = merTex.data[srcIdx + 0];
        merAtlas[dstIdx + 1] = merTex.data[srcIdx + 1];
        merAtlas[dstIdx + 2] = merTex.data[srcIdx + 2];
        merAtlas[dstIdx + 3] = merTex.data[srcIdx + 3];
      }
    }
    console.log(`  Copied to atlas - Non-zero pixels: ${nonZeroPixels}/${TILE_SIZE * TILE_SIZE}`);

    atlasData.push({
      name: textureName,
      x: col,
      y: row,
      index: i
    });

    processedCount++;
  }

  console.log(`Processed ${processedCount} textures`);

  // Save atlases
  console.log('Saving color atlas...');
  await sharp(colorAtlas, {
    raw: { width: atlasWidth, height: atlasHeight, channels: 4 }
  })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'rtx_color_atlas.png'));

  console.log('Saving normal atlas...');
  await sharp(normalAtlas, {
    raw: { width: atlasWidth, height: atlasHeight, channels: 4 }
  })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'rtx_normal_atlas.png'));

  console.log('Saving MER atlas...');
  await sharp(merAtlas, {
    raw: { width: atlasWidth, height: atlasHeight, channels: 4 }
  })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'rtx_mer_atlas.png'));

  // Save atlas metadata
  const metadata = {
    atlasWidth,
    atlasHeight,
    tileSize: TILE_SIZE,
    columns: ATLAS_COLS,
    rows: atlasRows,
    textures: atlasData
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'rtx_atlas_data.json'),
    JSON.stringify(metadata, null, 2)
  );

  console.log('Done! Atlas files saved to:', OUTPUT_DIR);
  console.log('- rtx_color_atlas.png');
  console.log('- rtx_normal_atlas.png');
  console.log('- rtx_mer_atlas.png');
  console.log('- rtx_atlas_data.json');
}

buildAtlas().catch(err => {
  console.error('Error building atlas:', err);
  process.exit(1);
});
