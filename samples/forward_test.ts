import { Mat4 } from '../src/math/mat4.js';
import { Vec3 } from '../src/math/vec3.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import { AtmospherePass } from '../src/renderer/passes/atmosphere_pass.js';
import { SpotLight } from '../src/renderer/spot_light.js';
import type { DirectionalLight } from '../src/renderer/directional_light.js';
import type { PointLight } from '../src/renderer/point_light.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import { SpotShadowPass } from '../src/renderer/passes/spot_shadow_pass.js';
import { PointShadowPass } from '../src/renderer/passes/point_shadow_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { RenderGraph } from '../src/renderer/render_graph.js';
import { CameraController } from '../src/engine/camera_controller.js';
import { GameObject, Camera } from '../src/engine/index.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh } from '../src/assets/mesh.js';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fpsElement = document.getElementById('fps')!;

  const ctx = await RenderContext.create(canvas);
  const device = ctx.device;

  // Create meshes
  const cubeMesh = Mesh.createCube(device);
  const planeMesh = Mesh.createPlane(device, 20, 20);

  // Create materials
  const opaqueMaterial = new PbrMaterial({
    albedo: [1.0, 0.2, 0.2, 1.0],
    roughness: 0.5,
    metallic: 0.0,
  });

  const metallicMaterial = new PbrMaterial({
    albedo: [0.8, 0.8, 0.8, 1.0],
    roughness: 0.4,
    metallic: 0.5,
  });

  const transparentMaterial = new PbrMaterial({
    albedo: [0.2, 0.6, 1.0, 0.5],
    roughness: 0.1,
    metallic: 0.0,
    transparent: true,
  });

  const planeMaterial = new PbrMaterial({
    albedo: [0.5, 0.7, 0.5, 1.0],
    roughness: 0.9,
    metallic: 0.0,
  });

  const forwardPass = ForwardPass.create(ctx, { load: 'load' });

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
  const dirShadowPass = DirectionalShadowPass.create(ctx, dirShadowMapView);
  const spotShadowPass = SpotShadowPass.create(ctx, spotShadowMapView);

  // Point light shadow passes share the forward pass's cube-array texture
  const pointShadowCubeArray = forwardPass.pointShadowCubeArray;
  const pointShadowPasses: PointShadowPass[] = [];
  for (let i = 0; i < 2; i++) {
    pointShadowPasses.push(PointShadowPass.create(ctx, pointShadowCubeArray, i * 6));
  }

  const atmospherePass = AtmospherePass.create(ctx, { load: 'clear' });

  // Create render graph
  const renderGraph = new RenderGraph();
  renderGraph.addPass(dirShadowPass);
  for (const pass of pointShadowPasses) {
    renderGraph.addPass(pass);
  }
  renderGraph.addPass(spotShadowPass);
  renderGraph.addPass(atmospherePass);
  renderGraph.addPass(forwardPass);

  // Camera setup — use a proper GameObject with a Camera component
  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(0, 3, 8);
  const camera = cameraGO.addComponent(Camera.createPerspective(60, 0.1, 100, ctx.width / ctx.height));

  const cameraController = CameraController.create({
    yaw: 0, pitch: -20 * Math.PI / 180, speed: 5, sensitivity: 0.002, pointerLock: false,
  });
  cameraController.attach(ctx.canvas);

  // Light toggle states
  let directionalLightEnabled = true;
  let spotLightEnabled = true;
  let pointLightsEnabled = true;

  // Hotkeys: 1 = directional, 2 = spot, 3 = point
  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      directionalLightEnabled = !directionalLightEnabled;
      console.log(`Directional light: ${directionalLightEnabled ? 'ON' : 'OFF'}`);
    } else if (e.key === '2') {
      spotLightEnabled = !spotLightEnabled;
      console.log(`Spot light: ${spotLightEnabled ? 'ON' : 'OFF'}`);
    } else if (e.key === '3') {
      pointLightsEnabled = !pointLightsEnabled;
      console.log(`Point lights: ${pointLightsEnabled ? 'ON' : 'OFF'}`);
    }
  });

  // Render loop
  async function render() {
    ctx.update();

    fpsElement.textContent = `FPS: ${ctx.fps}`;

    const backbufferView = ctx.backbufferView;

    forwardPass.setOutput(backbufferView, ctx.backbufferDepthView);
    atmospherePass.setOutput(backbufferView);

    // Update camera aspect ratio and controller
    camera.aspect = ctx.width / ctx.height;
    cameraController.update(cameraGO, ctx.deltaTime);

    // Derive matrices from the Camera component
    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix();
    const viewProj = camera.viewProjectionMatrix();
    const invViewProj = viewProj.invert();
    const camPos = camera.position();

    forwardPass.updateCamera(ctx, view, proj, viewProj, invViewProj, camPos, camera.near, camera.far);

    // Update lights
    const lightDir = new Vec3(-0.3, -0.8, -0.5).normalize();

    // Create shadow view-projection matrix aligned with light direction
    const sceneCenter = new Vec3(0, 1, 0); // Center around the cubes
    const shadowDistance = 20;             // Distance from scene center
    const shadowCameraPos = sceneCenter.sub(lightDir.scale(shadowDistance));
    const lightView = Mat4.lookAt(shadowCameraPos, sceneCenter, new Vec3(0, 1, 0));
    const lightProj = Mat4.orthographic(-10, 10, -10, 10, 1, 40);
    const lightViewProj = lightProj.multiply(lightView);

    const directionalLight: DirectionalLight = {
      direction: lightDir,
      intensity: 1.5,
      color: new Vec3(1.0, 0.95, 0.9),
      castShadows: true,
      lightViewProj,
      shadowMap: dirShadowMapView,
    };

    const pointLights: PointLight[] = [
      {
        position: new Vec3(Math.sin(ctx.elapsedTime) * 3, 2, Math.cos(ctx.elapsedTime) * 3),
        range: 8,
        color: new Vec3(1.0, 0.3, 0.3),
        intensity: 10,
        castShadows: true,
      }
    ];

    const spotLights: SpotLight[] = [
      new SpotLight({
        position: new Vec3(0, 5, 0),
        range: 10,
        direction: new Vec3(0, -1, 0),
        innerAngle: 20,
        color: new Vec3(1.0, 1.0, 0.5),
        outerAngle: 30,
        intensity: 20,
        castShadows: true,
        shadowMap: spotShadowMapView,
      }),
    ];

    // Create draw items
    const drawItems = [
      {
        mesh: planeMesh,
        modelMatrix: Mat4.identity(),
        normalMatrix: Mat4.identity(),
        material: planeMaterial,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(-2, 1, 0).multiply(Mat4.rotationY(ctx.elapsedTime * 50 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: opaqueMaterial,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(2, 1, 0).multiply(Mat4.rotationY(ctx.elapsedTime * -50 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: metallicMaterial,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(0, 2, -2).multiply(Mat4.rotationY(ctx.elapsedTime * 30 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: transparentMaterial,
      },
      {
        mesh: cubeMesh,
        modelMatrix: Mat4.translation(2, 2, -2).multiply(Mat4.rotationY(ctx.elapsedTime * 30 * Math.PI / 180)),
        normalMatrix: Mat4.identity(),
        material: transparentMaterial,
      },
    ];

    // Update shadow passes
    const shadowDrawItems = drawItems.filter(item => !item.material.transparent).map(item => ({
      mesh: item.mesh,
      modelMatrix: item.modelMatrix,
    }));

    // Directional light shadow pass
    dirShadowPass.enabled = directionalLight.castShadows;
    if (directionalLight.castShadows) {
      dirShadowPass.setDrawItems(shadowDrawItems);
      dirShadowPass.updateCamera(ctx, lightViewProj);
    }

    // Spot light shadow pass
    const spotShadowEnabled = spotLights.length > 0 && spotLights[0].castShadows === true;
    spotShadowPass.enabled = spotShadowEnabled;
    if (spotShadowEnabled) {
      const spot = spotLights[0];
      spotShadowPass.setDrawItems(shadowDrawItems);
      spotShadowPass.updateLight(ctx, spot);
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
        pointShadowPasses[i].updateCamera(ctx, lightPos, viewProjs, light.range);
      }
    }

    // Apply light toggles
    const activeDirectionalLight: DirectionalLight = directionalLightEnabled
      ? directionalLight
      : { ...directionalLight, intensity: 0, castShadows: false };
    const activePointLights = pointLightsEnabled ? pointLights : [];
    const activeSpotLights = spotLightEnabled ? spotLights : [];

    // Disable shadow passes for toggled-off lights
    dirShadowPass.enabled = activeDirectionalLight.castShadows;
    spotShadowPass.enabled = activeSpotLights.length > 0 && activeSpotLights[0].castShadows === true;
    for (let i = 0; i < pointShadowPasses.length; i++) {
      pointShadowPasses[i].enabled = i < activePointLights.length && activePointLights[i].castShadows === true;
    }

    // Update forward pass
    forwardPass.updateLights(ctx, activeDirectionalLight, activePointLights, activeSpotLights);
    forwardPass.setDrawItems(drawItems);

    atmospherePass.update(ctx, invViewProj, camPos, lightDir);

    // Manual execution to control pass order
    const encoder = device.createCommandEncoder({ label: 'MainEncoder' });

    renderGraph.execute(ctx);

    device.queue.submit([encoder.finish()]);

    requestAnimationFrame(render);
  }

  render();
}

main();
