import { Mat4 } from '../../src/math/mat4.js';
import { Vec3 } from '../../src/math/vec3.js';
import { ForwardPass, type DirectionalLightData, type PointLightData, type SpotLightData } from '../../src/renderer/passes/forward_pass.js';
import { DirectionalShadowPass } from '../../src/renderer/passes/directional_shadow_pass.js';
import { SpotShadowPass } from '../../src/renderer/passes/spot_shadow_pass.js';
import { PointShadowPass } from '../../src/renderer/passes/point_shadow_pass.js';
import { RenderContext } from '../../src/renderer/render_context.js';
import { RenderGraph } from '../../src/renderer/render_graph.js';
import { CameraControls } from '../../src/engine/camera_controls.js';
import type { Material } from '../../src/engine/components/mesh_renderer.js';
import type { Mesh } from '../../src/assets/mesh.js';

// Simple mesh builder
function createCubeMesh(device: GPUDevice): Mesh {
  const positions = new Float32Array([
    // Front
    -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,  0.5,
    // Back
    -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5, -0.5,
    // Top
    -0.5,  0.5, -0.5, -0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5,  0.5, -0.5,
    // Bottom
    -0.5, -0.5, -0.5,  0.5, -0.5, -0.5,  0.5, -0.5,  0.5, -0.5, -0.5,  0.5,
    // Right
     0.5, -0.5, -0.5,  0.5,  0.5, -0.5,  0.5,  0.5,  0.5,  0.5, -0.5,  0.5,
    // Left
    -0.5, -0.5, -0.5, -0.5, -0.5,  0.5, -0.5,  0.5,  0.5, -0.5,  0.5, -0.5,
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    // Top
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    // Right
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  const uvs = new Float32Array([
    0, 1,  1, 1,  1, 0,  0, 0,
    0, 1,  1, 1,  1, 0,  0, 0,
    0, 1,  1, 1,  1, 0,  0, 0,
    0, 1,  1, 1,  1, 0,  0, 0,
    0, 1,  1, 1,  1, 0,  0, 0,
    0, 1,  1, 1,  1, 0,  0, 0,
  ]);

  const tangents = new Float32Array([
    1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
    -1, 0, 0, 1,  -1, 0, 0, 1,  -1, 0, 0, 1,  -1, 0, 0, 1,
    1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
    1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,  1, 0, 0, 1,
    0, 0, -1, 1,  0, 0, -1, 1,  0, 0, -1, 1,  0, 0, -1, 1,
    0, 0, 1, 1,  0, 0, 1, 1,  0, 0, 1, 1,  0, 0, 1, 1,
  ]);

  const indices = new Uint32Array([
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    8, 9, 10,  8, 10, 11,
    12, 13, 14,  12, 14, 15,
    16, 17, 18,  16, 18, 19,
    20, 21, 22,  20, 22, 23,
  ]);

  const vertexCount = positions.length / 3;
  const vertexData = new Float32Array(vertexCount * 12);
  for (let i = 0; i < vertexCount; i++) {
    vertexData[i * 12 + 0] = positions[i * 3 + 0];
    vertexData[i * 12 + 1] = positions[i * 3 + 1];
    vertexData[i * 12 + 2] = positions[i * 3 + 2];
    vertexData[i * 12 + 3] = normals[i * 3 + 0];
    vertexData[i * 12 + 4] = normals[i * 3 + 1];
    vertexData[i * 12 + 5] = normals[i * 3 + 2];
    vertexData[i * 12 + 6] = uvs[i * 2 + 0];
    vertexData[i * 12 + 7] = uvs[i * 2 + 1];
    vertexData[i * 12 + 8] = tangents[i * 4 + 0];
    vertexData[i * 12 + 9] = tangents[i * 4 + 1];
    vertexData[i * 12 + 10] = tangents[i * 4 + 2];
    vertexData[i * 12 + 11] = tangents[i * 4 + 3];
  }

  const vertexBuffer = device.createBuffer({
    label: 'CubeVertexBuffer',
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  const indexBuffer = device.createBuffer({
    label: 'CubeIndexBuffer',
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  return {
    vertexBuffer,
    indexBuffer,
    indexCount: indices.length,
  };
}

function createPlaneMesh(device: GPUDevice): Mesh {
  const size = 20;
  const vertexData = new Float32Array([
    // position            normal           uv       tangent
    -size, 0, -size,  0, 1, 0,  0, 0,  1, 0, 0, 1,
     size, 0, -size,  0, 1, 0,  size, 0,  1, 0, 0, 1,
     size, 0,  size,  0, 1, 0,  size, size,  1, 0, 0, 1,
    -size, 0,  size,  0, 1, 0,  0, size,  1, 0, 0, 1,
  ]);

  // Reverse winding order for correct front face when viewed from above
  const indices = new Uint32Array([0, 2, 1, 0, 3, 2]);

  const vertexBuffer = device.createBuffer({
    label: 'PlaneVertexBuffer',
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  const indexBuffer = device.createBuffer({
    label: 'PlaneIndexBuffer',
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  return {
    vertexBuffer,
    indexBuffer,
    indexCount: indices.length,
  };
}

function createFallbackTexture(device: GPUDevice, r: number, g: number, b: number, a: number): GPUTextureView {
  const texture = device.createTexture({
    size: { width: 1, height: 1 },
    format: 'rgba8unorm',
    usage: 0x04 | 0x02, // TEXTURE_BINDING | COPY_DST
  });
  device.queue.writeTexture(
    { texture },
    new Uint8Array([r, g, b, a]),
    { bytesPerRow: 4 },
    { width: 1, height: 1 }
  );
  return texture.createView();
}

function createFallbackCubemap(device: GPUDevice): GPUTexture {
  const texture = device.createTexture({
    size: { width: 1, height: 1, depthOrArrayLayers: 6 },
    format: 'rgba16float',
    dimension: '2d',
    usage: 0x04 | 0x02, // TEXTURE_BINDING | COPY_DST
    mipLevelCount: 1,
  });
  // Moderate fallback - 0.5 in float16 (0x3800)
  const data = new Uint16Array([0x3800, 0x3800, 0x3800, 0x3C00]); // rgb=0.5, a=1.0
  for (let i = 0; i < 6; i++) {
    device.queue.writeTexture(
      { texture, origin: { x: 0, y: 0, z: i } },
      data,
      { bytesPerRow: 8 },
      { width: 1, height: 1 }
    );
  }
  return texture;
}

function createDepthTexture(device: GPUDevice, width: number, height: number): GPUTextureView {
  const texture = device.createTexture({
    size: { width, height },
    format: 'depth32float',
    usage: 0x10 | 0x04, // RENDER_ATTACHMENT | TEXTURE_BINDING
  });
  return texture.createView();
}

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsElement = document.getElementById('fps')!;

  const renderContext = await RenderContext.create(canvas);
  const device = renderContext.device;

  // Create depth texture for rendering (will be recreated on resize)
  let depthTexture = device.createTexture({
    size: { width: renderContext.width, height: renderContext.height },
    format: 'depth32float',
    usage: 0x10, // RENDER_ATTACHMENT
  });

  // Create meshes
  const cubeMesh = createCubeMesh(device);
  const planeMesh = createPlaneMesh(device);

  // Create fallback textures
  const whiteView = createFallbackTexture(device, 255, 255, 255, 255);
  const flatNormalView = createFallbackTexture(device, 128, 128, 255, 255);
  const merView = createFallbackTexture(device, 0, 0, 255, 255);
  const irradianceTex = createFallbackCubemap(device);
  const prefilterTex = createFallbackCubemap(device);
  const brdfTex = device.createTexture({
    size: { width: 1, height: 1 },
    format: 'rgba16float',
    usage: 0x04 | 0x02, // TEXTURE_BINDING | COPY_DST
  });
  device.queue.writeTexture(
    { texture: brdfTex },
    new Uint16Array([0x3C00, 0x0000, 0, 0]), // r=1.0, g=0.0
    { bytesPerRow: 8 },
    { width: 1, height: 1 }
  );

  // Create materials
  const opaqueMaterial: Material = {
    albedo: [1.0, 0.2, 0.2, 1.0],
    roughness: 0.5,
    metallic: 0.0,
  };

  const metallicMaterial: Material = {
    albedo: [0.8, 0.8, 0.8, 1.0],
    roughness: 0.4,
    metallic: 0.5,
  };

  const transparentMaterial: Material = {
    albedo: [0.2, 0.6, 1.0, 0.5],
    roughness: 0.1,
    metallic: 0.0,
  };

  const planeMaterial: Material = {
    albedo: [0.5, 0.7, 0.5, 1.0],
    roughness: 0.9,
    metallic: 0.0,
  };

  // Create forward pass first (it contains the shadow map array)
  const iblTextures = {
    irradiance: irradianceTex,
    prefiltered: prefilterTex,
    brdfLut: brdfTex,
    irradianceView: irradianceTex.createView({ dimension: 'cube' }),
    prefilteredView: prefilterTex.createView({ dimension: 'cube' }),
    brdfLutView: brdfTex.createView(),
    levels: 1,
    destroy() {
      irradianceTex.destroy();
      prefilterTex.destroy();
      brdfTex.destroy();
    },
  };
  const forwardPass = ForwardPass.create(renderContext, iblTextures);

  // Get shadow map array from forward pass and create layer views for shadow passes
  const shadowMapArray = forwardPass.shadowMapArray;
  const dirShadowMapView = shadowMapArray.createView({
    dimension: '2d',
    baseArrayLayer: 0,
    arrayLayerCount: 1,
  });
  const spotShadowMapView = shadowMapArray.createView({
    dimension: '2d',
    baseArrayLayer: 1,
    arrayLayerCount: 1,
  });

  // Create shadow passes
  const dirShadowPass = DirectionalShadowPass.create(renderContext, dirShadowMapView);
  const spotShadowPass = SpotShadowPass.create(renderContext, spotShadowMapView);

  // Point light shadow cube maps (2 point lights) - these still use separate textures
  const shadowCubeSize = 1024;
  const pointShadowCubes: GPUTexture[] = [];
  for (let i = 0; i < 2; i++) {
    const cube = device.createTexture({
      label: `PointShadowCube${i}`,
      size: { width: shadowCubeSize, height: shadowCubeSize, depthOrArrayLayers: 6 },
      format: 'depth32float',
      dimension: '2d',
      usage: 0x10 | 0x04, // RENDER_ATTACHMENT | TEXTURE_BINDING
    });
    pointShadowCubes.push(cube);
  }

  // Create point shadow passes for each point light
  const pointShadowPasses: PointShadowPass[] = [];
  for (let i = 0; i < 2; i++) {
    const pass = PointShadowPass.create(renderContext, pointShadowCubes[i]);
    pointShadowPasses.push(pass);
  }

  // Create render graph
  const renderGraph = new RenderGraph();
  renderGraph.addPass(dirShadowPass);
  for (const pass of pointShadowPasses) {
    renderGraph.addPass(pass);
  }
  renderGraph.addPass(spotShadowPass);
  renderGraph.addPass(forwardPass);

  // Camera setup
  const camPos = new Vec3(0, 3, 8);
  const cameraControls = new CameraControls(0, -20 * Math.PI / 180, 5, 0.002);
  cameraControls.attach(renderContext.canvas);

  // Animation state
  let time = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let fpsTime = 0;

  // Render loop
  async function render() {
    const now = performance.now();
    const dt = (now - lastTime) * 0.001;
    lastTime = now;
    time += dt;

    // FPS counter
    frameCount++;
    fpsTime += dt;
    if (fpsTime >= 0.5) {
      const fps = Math.round(frameCount / fpsTime);
      fpsElement.textContent = `FPS: ${fps}`;
      frameCount = 0;
      fpsTime = 0;
    }

    // Handle canvas resize
    const needsResize = renderContext.canvas.width !== renderContext.canvas.clientWidth ||
                        renderContext.canvas.height !== renderContext.canvas.clientHeight;
    if (needsResize) {
      renderContext.canvas.width = renderContext.canvas.clientWidth;
      renderContext.canvas.height = renderContext.canvas.clientHeight;

      // Recreate depth texture with new dimensions
      depthTexture.destroy();
      depthTexture = device.createTexture({
        size: { width: renderContext.width, height: renderContext.height },
        format: 'depth32float',
        usage: 0x10, // RENDER_ATTACHMENT
      });

      // Resize forward pass internal textures
      forwardPass.resize(device, renderContext.width, renderContext.height);
    }

    // Update camera with CameraControls
    const fakeGameObject = {
      position: camPos,
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    };
    cameraControls.update(fakeGameObject as any, dt);

    // Build view matrix from yaw/pitch
    const sinY = Math.sin(cameraControls.yaw);
    const cosY = Math.cos(cameraControls.yaw);
    const sinP = Math.sin(cameraControls.pitch);
    const cosP = Math.cos(cameraControls.pitch);

    const forward = new Vec3(-sinY * cosP, -sinP, -cosY * cosP).normalize();
    const target = camPos.add(forward);
    const view = Mat4.lookAt(camPos, target, new Vec3(0, 1, 0));
    const aspect = renderContext.width / renderContext.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 100);
    const viewProj = proj.multiply(view);
    const invViewProj = viewProj.invert();

    forwardPass.updateCamera(renderContext, view, proj, viewProj, invViewProj, camPos, 0.1, 100);

    // Update lights
    const lightDir = new Vec3(-0.3, -0.8, -0.5).normalize();

    // Create shadow view-projection matrix aligned with light direction
    const sceneCenter = new Vec3(0, 1, 0); // Center around the cubes
    const shadowDistance = 20; // Distance from scene center
    const shadowCameraPos = sceneCenter.sub(lightDir.scale(shadowDistance));
    const lightView = Mat4.lookAt(shadowCameraPos, sceneCenter, new Vec3(0, 1, 0));
    const lightProj = Mat4.orthographic(-10, 10, -10, 10, 1, 40);
    const lightViewProj = lightProj.multiply(lightView);

    const directionalLight: DirectionalLightData = {
      direction: lightDir,
      intensity: 1.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      lightViewProj: lightViewProj,
      shadowMap: dirShadowMapView,
    };

    const pointLights: PointLightData[] = [
      {
        position: new Vec3(Math.sin(time) * 3, 2, Math.cos(time) * 3),
        range: 8,
        color: new Vec3(1.0, 0.3, 0.3),
        intensity: 10,
        castShadows: true,
      },
      {
        position: new Vec3(Math.sin(time + Math.PI) * 3, 2, Math.cos(time + Math.PI) * 3),
        range: 8,
        color: new Vec3(0.3, 0.3, 1.0),
        intensity: 10,
        castShadows: true,
      },
    ];

    // Compute spot light view-projection matrix
    const spotPosition = new Vec3(0, 5, 0);
    const spotDirection = new Vec3(0, -1, 0);
    const spotOuterAngle = 30;
    const spotRange = 10;

    const spotTarget = spotPosition.add(spotDirection);
    const viewDir = spotDirection.normalize();
    let spotUp = new Vec3(0, 1, 0);
    if (Math.abs(viewDir.dot(spotUp)) > 0.99) {
      spotUp = new Vec3(0, 0, 1);
    }
    const spotView = Mat4.lookAt(spotPosition, spotTarget, spotUp);
    const spotProj = Mat4.perspective(spotOuterAngle * 2 * Math.PI / 180, 1.0, 0.1, spotRange);
    const spotViewProj = spotProj.multiply(spotView);

    const spotLights: SpotLightData[] = [
      {
        position: spotPosition,
        range: spotRange,
        direction: spotDirection,
        innerAngle: 20,
        color: new Vec3(1.0, 1.0, 0.5),
        outerAngle: spotOuterAngle,
        intensity: 20,
        castShadows: true,
        lightViewProj: spotViewProj,
        shadowMap: spotShadowMapView,
      },
    ];

    // Create draw items
    const drawItems = [
      {
        mesh: planeMesh,
        modelMatrix: Mat4.identity(),
        normalMatrix: Mat4.identity(),
        material: planeMaterial,
        transparent: false,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(-2, 1, 0).multiply(Mat4.rotationY(time * 50 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: opaqueMaterial,
        transparent: false,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(2, 1, 0).multiply(Mat4.rotationY(time * -50 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: metallicMaterial,
        transparent: false,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(0, 2, -2).multiply(Mat4.rotationY(time * 30 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: transparentMaterial,
        transparent: true,
      },
    ];

    // Update shadow passes
    const shadowDrawItems = drawItems.filter(item => !item.transparent).map(item => ({
      mesh: item.mesh,
      modelMatrix: item.modelMatrix,
    }));

    // Directional light shadow pass
    dirShadowPass.enabled = directionalLight.castShadows;
    if (directionalLight.castShadows) {
      dirShadowPass.setDrawItems(shadowDrawItems);
      dirShadowPass.updateCamera(renderContext, lightViewProj);
    }

    // Spot light shadow pass
    const spotShadowEnabled = spotLights.length > 0 && spotLights[0].castShadows === true;
    spotShadowPass.enabled = spotShadowEnabled;
    if (spotShadowEnabled) {
      const spot = spotLights[0];
      // Use the same view-projection matrix as the light data
      spotShadowPass.setDrawItems(shadowDrawItems);
      spotShadowPass.updateCamera(renderContext, spot.lightViewProj!);
    }

    // Point light shadow passes
    for (let i = 0; i < pointShadowPasses.length; i++) {
      const enabled = i < pointLights.length && pointLights[i].castShadows === true;
      pointShadowPasses[i].enabled = enabled;

      if (enabled) {
        const light = pointLights[i];
        const lightPos = light.position;

        // Create 6 view-projection matrices for cube faces
        const viewProjs: Mat4[] = [];
        const targets = [
          new Vec3(lightPos.x + 1, lightPos.y, lightPos.z),     // +X
          new Vec3(lightPos.x - 1, lightPos.y, lightPos.z),     // -X
          new Vec3(lightPos.x, lightPos.y + 1, lightPos.z),     // +Y
          new Vec3(lightPos.x, lightPos.y - 1, lightPos.z),     // -Y
          new Vec3(lightPos.x, lightPos.y, lightPos.z + 1),     // +Z
          new Vec3(lightPos.x, lightPos.y, lightPos.z - 1),     // -Z
        ];
        const ups = [
          new Vec3(0, -1, 0),  // +X
          new Vec3(0, -1, 0),  // -X
          new Vec3(0, 0, 1),   // +Y
          new Vec3(0, 0, -1),  // -Y
          new Vec3(0, -1, 0),  // +Z
          new Vec3(0, -1, 0),  // -Z
        ];

        for (let j = 0; j < 6; j++) {
          const view = Mat4.lookAt(lightPos, targets[j], ups[j]);
          const proj = Mat4.perspective(90 * Math.PI / 180, 1.0, 0.1, light.range);
          viewProjs.push(proj.multiply(view));
        }

        pointShadowPasses[i].setDrawItems(shadowDrawItems);
        pointShadowPasses[i].updateCamera(renderContext, lightPos, viewProjs, light.range);
      }
    }

    // Update forward pass
    forwardPass.updateLights(renderContext, directionalLight, pointLights, spotLights);
    forwardPass.setDrawItems(drawItems);

    // Manual execution to control pass order
    const encoder = device.createCommandEncoder({ label: 'MainEncoder' });

    // Execute shadow passes (render directly to array layers)
    if (dirShadowPass.enabled) {
      dirShadowPass.execute(encoder, renderContext);
    }

    for (let i = 0; i < pointShadowPasses.length; i++) {
      if (pointShadowPasses[i].enabled) {
        pointShadowPasses[i].execute(encoder, renderContext);
      }
    }

    if (spotShadowPass.enabled) {
      spotShadowPass.execute(encoder, renderContext);
    }

    // Execute forward pass
    forwardPass.execute(encoder, renderContext);

    device.queue.submit([encoder.finish()]);

    requestAnimationFrame(render);
  }

  render();
}

main();
