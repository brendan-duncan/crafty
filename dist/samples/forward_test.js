import { Mat4 } from '../src/math/mat4.js';
import { Vec3 } from '../src/math/vec3.js';
import { ForwardPass } from '../src/renderer/passes/forward_pass.js';
import { SpotLight } from '../src/renderer/spot_light.js';
import { DirectionalShadowPass } from '../src/renderer/passes/directional_shadow_pass.js';
import { SpotShadowPass } from '../src/renderer/passes/spot_shadow_pass.js';
import { PointShadowPass } from '../src/renderer/passes/point_shadow_pass.js';
import { RenderContext } from '../src/renderer/render_context.js';
import { RenderGraph } from '../src/renderer/render_graph.js';
import { CameraControls } from '../src/engine/camera_controls.js';
import { PbrMaterial } from '../src/renderer/materials/pbr_material.js';
import { Mesh } from '../src/assets/mesh.js';
async function main() {
    const canvas = document.getElementById('canvas');
    const fpsElement = document.getElementById('fps');
    const renderContext = await RenderContext.create(canvas);
    const device = renderContext.device;
    // Create depth texture for rendering (will be recreated on resize)
    let depthTexture = device.createTexture({
        size: { width: renderContext.width, height: renderContext.height },
        format: 'depth32float',
        usage: 0x10, // RENDER_ATTACHMENT
    });
    // Create meshes
    const cubeMesh = Mesh.createCube(device);
    const planeMesh = Mesh.createPlane(device, 20, 20);
    // Create fallback textures
    const irradianceTex = renderContext.createDefaultCubemap();
    const prefilterTex = renderContext.createDefaultCubemap();
    const brdfTex = renderContext.createDefaultBrdfLUT();
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
    // Point light shadow passes share the forward pass's cube-array texture
    const pointShadowCubeArray = forwardPass.pointShadowCubeArray;
    const pointShadowPasses = [];
    for (let i = 0; i < 2; i++) {
        pointShadowPasses.push(PointShadowPass.create(renderContext, pointShadowCubeArray, i * 6));
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
    // Light toggle states
    let directionalLightEnabled = true;
    let spotLightEnabled = true;
    let pointLightsEnabled = true;
    // Hotkeys: 1 = directional, 2 = spot, 3 = point
    window.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            directionalLightEnabled = !directionalLightEnabled;
            console.log(`Directional light: ${directionalLightEnabled ? 'ON' : 'OFF'}`);
        }
        else if (e.key === '2') {
            spotLightEnabled = !spotLightEnabled;
            console.log(`Spot light: ${spotLightEnabled ? 'ON' : 'OFF'}`);
        }
        else if (e.key === '3') {
            pointLightsEnabled = !pointLightsEnabled;
            console.log(`Point lights: ${pointLightsEnabled ? 'ON' : 'OFF'}`);
        }
    });
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
        cameraControls.update(fakeGameObject, dt);
        // Build view matrix from yaw/pitch
        const sinY = Math.sin(cameraControls.yaw);
        const cosY = Math.cos(cameraControls.yaw);
        const sinP = Math.sin(cameraControls.pitch);
        const cosP = Math.cos(cameraControls.pitch);
        const forward = new Vec3(-sinY * cosP, -sinP, -cosY * cosP).normalize();
        const target = camPos.add(forward).add(new Vec3(0, -0.5, 0)); // Look slightly down
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
        const directionalLight = {
            direction: lightDir,
            intensity: 1.5,
            color: new Vec3(1.0, 0.95, 0.9),
            castShadows: true,
            lightViewProj,
            shadowMap: dirShadowMapView,
        };
        const pointLights = [
            {
                position: new Vec3(Math.sin(time) * 3, 2, Math.cos(time) * 3),
                range: 8,
                color: new Vec3(1.0, 0.3, 0.3),
                intensity: 10,
                castShadows: true,
            }
        ];
        const spotLights = [
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
                modelMatrix: Mat4.translation(-2, 1, 0).multiply(Mat4.rotationY(time * 50 * Math.PI / 180)),
                normalMatrix: Mat4.identity(),
                material: opaqueMaterial,
            },
            {
                mesh: cubeMesh,
                modelMatrix: Mat4.translation(2, 1, 0).multiply(Mat4.rotationY(time * -50 * Math.PI / 180)),
                normalMatrix: Mat4.identity(),
                material: metallicMaterial,
            },
            {
                mesh: cubeMesh,
                modelMatrix: Mat4.translation(0, 2, -2).multiply(Mat4.rotationY(time * 30 * Math.PI / 180)),
                normalMatrix: Mat4.identity(),
                material: transparentMaterial,
            },
            {
                mesh: cubeMesh,
                modelMatrix: Mat4.translation(2, 2, -2).multiply(Mat4.rotationY(time * 30 * Math.PI / 180)),
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
            dirShadowPass.updateCamera(renderContext, lightViewProj);
        }
        // Spot light shadow pass
        const spotShadowEnabled = spotLights.length > 0 && spotLights[0].castShadows === true;
        spotShadowPass.enabled = spotShadowEnabled;
        if (spotShadowEnabled) {
            const spot = spotLights[0];
            spotShadowPass.setDrawItems(shadowDrawItems);
            spotShadowPass.updateLight(renderContext, spot);
        }
        // Point light shadow passes
        for (let i = 0; i < pointShadowPasses.length; i++) {
            const enabled = i < pointLights.length && pointLights[i].castShadows === true;
            pointShadowPasses[i].enabled = enabled;
            if (enabled) {
                const light = pointLights[i];
                const lightPos = light.position;
                // Create 6 view-projection matrices for cube faces
                const viewProjs = [];
                const targets = [
                    new Vec3(lightPos.x + 1, lightPos.y, lightPos.z), // +X
                    new Vec3(lightPos.x - 1, lightPos.y, lightPos.z), // -X
                    new Vec3(lightPos.x, lightPos.y + 1, lightPos.z), // +Y
                    new Vec3(lightPos.x, lightPos.y - 1, lightPos.z), // -Y
                    new Vec3(lightPos.x, lightPos.y, lightPos.z + 1), // +Z
                    new Vec3(lightPos.x, lightPos.y, lightPos.z - 1), // -Z
                ];
                const ups = [
                    new Vec3(0, -1, 0), // +X
                    new Vec3(0, -1, 0), // -X
                    new Vec3(0, 0, 1), // +Y
                    new Vec3(0, 0, -1), // -Y
                    new Vec3(0, -1, 0), // +Z
                    new Vec3(0, -1, 0), // -Z
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
        // Apply light toggles
        const activeDirectionalLight = directionalLightEnabled
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
        forwardPass.updateLights(renderContext, activeDirectionalLight, activePointLights, activeSpotLights);
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
