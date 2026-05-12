import { Vec3 } from '../src/math/index.js';
import { Scene } from '../src/engine/scene.js';
import { GameObject } from '../src/engine/game_object.js';
import { Camera } from '../src/engine/components/camera.js';
import { DirectionalLight } from '../src/engine/components/directional_light.js';
import { MeshRenderer } from '../src/engine/components/mesh_renderer.js';
import { CameraControls } from '../src/engine/camera_controls.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { RenderContext, RenderGraph, GBuffer, ShadowPass, GeometryPass, DeferredLightingPass, AtmospherePass, CloudPass, CloudShadowPass, GodrayPass, CompositePass, } from '../src/renderer/index.js';
import { Mesh, createCloudNoiseTextures } from '../src/assets/index.js';
function createAOTexture(device, width, height) {
    const texture = device.createTexture({
        size: { width, height },
        format: 'r8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    const data = new Uint8Array(width * height).fill(255);
    device.queue.writeTexture({ texture }, data, { bytesPerRow: width }, { width, height });
    return texture.createView();
}
function createControlPanel(effects) {
    const panel = document.getElementById('panel');
    for (const key of Object.keys(effects)) {
        const btn = document.createElement('button');
        btn.className = 'toggle-btn';
        const label = key.toUpperCase().padEnd(5);
        const refresh = () => {
            const on = effects[key];
            btn.textContent = `${label} ${on ? 'ON ' : 'OFF'}`;
            btn.className = `toggle-btn ${on ? 'on' : 'off'}`;
        };
        btn.addEventListener('click', () => {
            effects[key] = !effects[key];
            refresh();
        });
        refresh();
        panel.appendChild(btn);
    }
    return panel;
}
async function main() {
    const canvas = document.getElementById('canvas');
    const fpsElement = document.getElementById('fps');
    const sunSlider = document.getElementById('sun-angle');
    const sunLabel = document.getElementById('sun-label');
    const densitySlider = document.getElementById('cloud-density');
    const densityLabel = document.getElementById('density-label');
    const coverageSlider = document.getElementById('cloud-coverage');
    const coverageLabel = document.getElementById('coverage-label');
    const extinctionSlider = document.getElementById('cloud-extinction');
    const extinctionLabel = document.getElementById('extinction-label');
    const debugEl = document.getElementById('debug');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const renderContext = await RenderContext.create(canvas, { enableErrorHandling: true });
    const { device } = renderContext;
    const scene = new Scene();
    // Camera — looking down at the ground with clouds above
    const cameraGO = new GameObject('Camera');
    cameraGO.position.set(0, 10, 50);
    const camera = cameraGO.addComponent(new Camera(60, 0.1, 500, renderContext.width / renderContext.height));
    // positive pitch = looking down (CameraControls uses -this.pitch in rotation)
    const cameraControls = new CameraControls(0, 0.1, 20, 0.002);
    cameraControls.attach(canvas);
    cameraControls.update(cameraGO, 0);
    scene.add(cameraGO);
    // Directional light (sun)
    const sunGO = new GameObject('Sun');
    const sun = sunGO.addComponent(new DirectionalLight(new Vec3(0.3, -0.8, -0.5).normalize(), new Vec3(1.0, 0.95, 0.9), 1.0, 4));
    scene.add(sunGO);
    // Ground plane
    const planeMesh = Mesh.createPlane(device, 200, 200, 1, 1);
    const groundMat = new PbrMaterial({
        albedo: [0.6, 0.8, 0.6, 1.0],
        roughness: 0.9,
        metallic: 0.0,
    });
    const groundGO = new GameObject('Ground');
    groundGO.addComponent(new MeshRenderer(planeMesh, groundMat));
    scene.add(groundGO);
    // Shadow catcher cubes — these should show clear darkening when cloud shadows are on
    const cubeMesh = Mesh.createCube(device, 2);
    const cubeMat = new PbrMaterial({
        albedo: [1.0, 0.9, 0.8, 1.0],
        roughness: 0.3,
        metallic: 0.0,
    });
    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const radius = 15 + (i % 3) * 8;
        const go = new GameObject(`Target${i}`);
        go.position.set(Math.cos(angle) * radius, 1, Math.sin(angle) * radius);
        go.addComponent(new MeshRenderer(cubeMesh, cubeMat));
        scene.add(go);
    }
    // Cloud noise
    const cloudNoises = createCloudNoiseTextures(device);
    // Cloud settings — shared by both cloud rendering and cloud shadow passes
    const cloudSettings = {
        cloudBase: 30,
        cloudTop: 55,
        coverage: 0.8,
        density: 0.8,
        windOffset: [0, 0],
        anisotropy: 0.85,
        extinction: 0.52,
        ambientColor: [0.4, 0.55, 0.7],
        exposure: 0.2,
    };
    // Render resources
    const gbuffer = GBuffer.create(renderContext);
    const aoView = createAOTexture(device, renderContext.width, renderContext.height);
    const exposureBuf = device.createBuffer({
        label: 'FixedExposure',
        size: 16,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(exposureBuf, 0, new Float32Array([1.0, 0, 0, 0]));
    // Render passes
    const shadowPass = ShadowPass.create(renderContext, 3);
    const geometryPass = GeometryPass.create(renderContext, gbuffer);
    const cloudShadowPass = CloudShadowPass.create(renderContext, cloudNoises);
    const lightingPass = DeferredLightingPass.create(renderContext, gbuffer, shadowPass, aoView, cloudShadowPass.shadowView);
    const cloudPass = CloudPass.create(renderContext, lightingPass.hdrView, gbuffer.depthView, cloudNoises);
    const atmospherePass = AtmospherePass.create(renderContext, lightingPass.hdrView);
    const godrayPass = GodrayPass.create(renderContext, gbuffer, shadowPass, lightingPass.hdrView, lightingPass.cameraBuffer, lightingPass.lightBuffer, cloudNoises);
    const compositePass = CompositePass.create(renderContext, lightingPass.hdrView, aoView, gbuffer.depthView, lightingPass.cameraBuffer, lightingPass.lightBuffer, exposureBuf);
    // Render graph — order matters
    const renderGraph = new RenderGraph();
    renderGraph.addPass(shadowPass);
    renderGraph.addPass(geometryPass);
    renderGraph.addPass(cloudShadowPass);
    renderGraph.addPass(cloudPass);
    renderGraph.addPass(atmospherePass);
    renderGraph.addPass(lightingPass);
    renderGraph.addPass(godrayPass);
    renderGraph.addPass(compositePass);
    atmospherePass.enabled = false;
    // Toggle effects
    const effects = {
        clouds: true,
        cloudShadow: true,
        godray: true,
    };
    createControlPanel(effects);
    // Sun direction from slider
    function updateSun(angleDeg) {
        const angleRad = angleDeg * Math.PI / 180;
        const elev = Math.sin(angleRad);
        const dx = 0.3 * Math.cos(angleRad);
        const dz = 1.0 * Math.cos(angleRad);
        sun.direction.set(dx, -elev, dz).normalize();
        const t = Math.max(0, elev);
        sun.intensity = t * 10.0;
        sun.color.set(1.0, 0.8 + 0.2 * t, 0.6 + 0.4 * t);
        sunLabel.textContent = `${angleDeg}°`;
    }
    updateSun(parseFloat(sunSlider.value));
    sunSlider.addEventListener('input', () => {
        updateSun(parseFloat(sunSlider.value));
    });
    function updateDensity(value) {
        cloudSettings.density = value;
        densityLabel.textContent = value.toFixed(2);
    }
    function updateCoverage(value) {
        cloudSettings.coverage = value;
        coverageLabel.textContent = value.toFixed(2);
    }
    updateDensity(parseFloat(densitySlider.value));
    densitySlider.addEventListener('input', () => {
        updateDensity(parseFloat(densitySlider.value));
    });
    updateCoverage(parseFloat(coverageSlider.value));
    coverageSlider.addEventListener('input', () => {
        updateCoverage(parseFloat(coverageSlider.value));
    });
    function updateExtinction(value) {
        cloudSettings.extinction = value;
        extinctionLabel.textContent = value.toFixed(2);
    }
    updateExtinction(parseFloat(extinctionSlider.value));
    extinctionSlider.addEventListener('input', () => {
        updateExtinction(parseFloat(extinctionSlider.value));
    });
    // Cloud shadow readback debug — copy shadow texture to staging buffer every N frames
    const STAGING_SIZE = 1024 * 1024 * 1; // r8unorm → 1 byte per pixel
    const stagingBuf = device.createBuffer({
        label: 'CloudShadowStaging',
        size: STAGING_SIZE,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    let shadowReadbackFrame = 0;
    // Render loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTime = 0;
    async function render() {
        const now = performance.now();
        const dt = (now - lastTime) * 0.001;
        lastTime = now;
        frameCount++;
        fpsTime += dt;
        if (fpsTime >= 0.5) {
            fpsElement.textContent = `FPS: ${Math.round(frameCount / fpsTime)}`;
            frameCount = 0;
            fpsTime = 0;
        }
        cameraControls.update(cameraGO, dt);
        scene.update(dt);
        const camPos = camera.position();
        const view = camera.viewMatrix();
        const proj = camera.projectionMatrix();
        const vp = camera.viewProjectionMatrix();
        const invVP = vp.invert();
        const cascades = sun.computeCascadeMatrices(camera, 200);
        const meshRenderers = scene.collectMeshRenderers();
        const drawItems = meshRenderers.map((mr) => {
            const w = mr.gameObject.localToWorld();
            return { mesh: mr.mesh, modelMatrix: w, normalMatrix: w.normalMatrix(), material: mr.material };
        });
        const shadowItems = meshRenderers
            .filter((mr) => mr.castShadow)
            .map((mr) => ({ mesh: mr.mesh, modelMatrix: mr.gameObject.localToWorld() }));
        shadowPass.setSceneSnapshot(shadowItems);
        shadowPass.updateScene(scene, camera, sun, 200);
        geometryPass.setDrawItems(drawItems);
        geometryPass.updateCamera(renderContext, view, proj, vp, invVP, camPos, camera.near, camera.far);
        if (effects.clouds) {
            cloudPass.enabled = true;
            atmospherePass.enabled = false;
            const windSpeed = 0.03;
            const windDir = [1, 0.3];
            cloudSettings.windOffset[0] += windSpeed * windDir[0] * dt;
            cloudSettings.windOffset[1] += windSpeed * windDir[1] * dt;
            cloudShadowPass.update(renderContext, cloudSettings, [0, 0], 100);
            godrayPass.updateCloudDensity(renderContext, cloudSettings);
            cloudPass.updateCamera(renderContext, invVP, camPos, camera.near, camera.far);
            cloudPass.updateLight(renderContext, sun.direction, sun.color, sun.intensity);
            cloudPass.updateSettings(renderContext, cloudSettings);
        }
        else {
            cloudPass.enabled = false;
            atmospherePass.enabled = true;
            atmospherePass.update(renderContext, invVP, camPos, sun.direction);
        }
        cloudShadowPass.enabled = effects.cloudShadow;
        lightingPass.updateCamera(renderContext, view, proj, vp, invVP, camPos, camera.near, camera.far);
        lightingPass.updateLight(renderContext, sun.direction, sun.color, sun.intensity, cascades, true, false);
        lightingPass.updateCloudShadow(renderContext, 0, 0, effects.cloudShadow ? 100 : 0);
        godrayPass.enabled = effects.godray;
        // Disable depth fog so it doesn't wash out the ground shadows
        compositePass.depthFogEnabled = false;
        compositePass.updateParams(renderContext, false, 0, true, false, renderContext.hdr);
        await renderGraph.execute(renderContext);
        // Read back the cloud shadow texture every 120 frames to verify content
        shadowReadbackFrame++;
        if (shadowReadbackFrame >= 120 && effects.cloudShadow) {
            shadowReadbackFrame = 0;
            const src = cloudShadowPass.shadowTexture;
            const enc = device.createCommandEncoder();
            enc.copyTextureToBuffer({ texture: src, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } }, { buffer: stagingBuf, bytesPerRow: 1024 }, { width: 1024, height: 1024, depthOrArrayLayers: 1 });
            device.queue.submit([enc.finish()]);
            await stagingBuf.mapAsync(GPUMapMode.READ);
            const mapped = new Uint8Array(stagingBuf.getMappedRange());
            let minV = 255, maxV = 0;
            // Sample a sparse grid (every 64th pixel) for performance
            for (let y = 0; y < 1024; y += 64) {
                for (let x = 0; x < 1024; x += 64) {
                    const v = mapped[y * 1024 + x];
                    if (v < minV)
                        minV = v;
                    if (v > maxV)
                        maxV = v;
                }
            }
            stagingBuf.unmap();
            debugEl.textContent = `CloudShadow: min=${minV}/255 (${(minV / 255).toFixed(2)}), max=${maxV}/255 (${(maxV / 255).toFixed(2)})`;
        }
        requestAnimationFrame(render);
    }
    render();
}
main();
