import { GameObject, Camera, CameraController, PlayerController, Scene, SpotLight } from '../../src/engine/index.js';
import { Vec3 } from '../../src/math/index.js';
import type { BlockWorld } from '../../src/block/index.js';

export interface PlayerSetup {
  cameraGO: GameObject;
  camera: Camera;
  player: PlayerController;
  freeCamera: CameraController;
  isPlayerMode: () => boolean;
  flashlight: SpotLight;
  isFlashlightEnabled: () => boolean;
  isRunEnabled: () => boolean;
  setRunEnabled: (enabled: boolean) => void;
  modeEl: HTMLDivElement;
  toggleController: () => void;
  setFlashlightEnabled: (enabled: boolean) => void;
  setPlayerUIVisible: (visible: boolean) => void;
}

export function setupPlayer(
  canvas: HTMLCanvasElement,
  scene: Scene,
  world: BlockWorld,
  canvasWidth: number,
  canvasHeight: number,
  flashlightTexture: GPUTexture,
  reticleElement?: HTMLDivElement,
  hotbarElement?: HTMLDivElement,
): PlayerSetup {
  const cameraGO = new GameObject({ name: 'Camera' });
  cameraGO.position.set(64, 25, 64);
  const camera = cameraGO.addComponent(Camera.createPerspective(70, 0.1, 1000, canvasWidth / canvasHeight));
  scene.add(cameraGO);

  // Flashlight spotlight attached to camera
  const flashlightGO = new GameObject({ name: 'Flashlight' });
  const flashlight = flashlightGO.addComponent(new SpotLight());
  flashlight.color = new Vec3(1.0, 0.95, 0.9);
  flashlight.intensity = 0.0;
  flashlight.range = 80.0;
  flashlight.innerAngle = 12;
  flashlight.outerAngle = 25;
  flashlight.castShadow = false;
  flashlight.projectionTexture = flashlightTexture;
  cameraGO.addChild(flashlightGO);
  scene.add(flashlightGO);
  let flashlightEnabled = false;
  let runEnabled = false;

  const player = new PlayerController(world, Math.PI, 0.1);
  player.attach(canvas);

  const freeCamera = CameraController.create({ yaw: Math.PI, pitch: 0.1, speed: 15, sensitivity: 0.002, pointerLock: true });
  let usePlayerController = true;

  const modeEl = document.createElement('div');
  modeEl.textContent = 'PLAYER';
  modeEl.style.cssText = [
    'position:fixed', 'top:12px', 'left:12px',
    'font-family:ui-monospace,monospace', 'font-size:13px', 'font-weight:bold',
    'color:#4f4', 'background:rgba(0,0,0,0.45)',
    'padding:4px 8px', 'border-radius:4px', 'pointer-events:none',
    'letter-spacing:0.05em',
  ].join(';');
  document.body.appendChild(modeEl);

  function setPlayerUIVisible(visible: boolean): void {
    if (reticleElement) {
      reticleElement.style.display = visible ? '' : 'none';
    }
    if (hotbarElement) {
      hotbarElement.style.display = visible ? 'flex' : 'none';
    }
  }

  function toggleController(): void {
    usePlayerController = !usePlayerController;
    if (usePlayerController) {
      player.yaw = freeCamera.yaw;
      player.pitch = freeCamera.pitch;
      freeCamera.detach();
      player.attach(canvas);
    } else {
      freeCamera.yaw = player.yaw;
      freeCamera.pitch = player.pitch;
      player.detach();
      freeCamera.attach(canvas);
    }
    modeEl.textContent = usePlayerController ? 'PLAYER' : 'FREE';
    modeEl.style.color = usePlayerController ? '#4f4' : '#4cf';
    setPlayerUIVisible(usePlayerController);
  }

  function setFlashlightEnabled(enabled: boolean): void {
    flashlightEnabled = enabled;
    flashlight.intensity = flashlightEnabled ? 25.0 : 0.0;
  }

  function setRunEnabled(enabled: boolean): void {
    runEnabled = enabled;
    player.inputSprint = runEnabled;
  }

  // Double-tap Space to toggle controller
  let lastSpaceUp = -Infinity;
  document.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      lastSpaceUp = performance.now();
    }
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'KeyC' && !e.repeat) {
      toggleController();
      return;
    }
    if (e.code !== 'Space' || e.repeat) {
      return;
    }
    if (performance.now() - lastSpaceUp < 400 && document.pointerLockElement === canvas) {
      const wasPlayer = usePlayerController;
      toggleController();
      lastSpaceUp = -Infinity;
      if (wasPlayer) {
        freeCamera.pressKey('Space');
      }
    }
  });

  // Flashlight toggle
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF' && !e.repeat) {
      setFlashlightEnabled(!flashlightEnabled);
      console.log(`Flashlight ${flashlightEnabled ? 'ON' : 'OFF'} (intensity: ${flashlight.intensity})`);
    }
    // Run toggle
    if (e.code === 'KeyR' && !e.repeat) {
      setRunEnabled(!runEnabled);
      console.log(`Run ${runEnabled ? 'ON' : 'OFF'}`);
    }
    // Ctrl+W to reload
    if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      window.location.reload();
    }
  });

  return {
    cameraGO,
    camera,
    player,
    freeCamera,
    isPlayerMode: () => usePlayerController,
    flashlight,
    isFlashlightEnabled: () => flashlightEnabled,
    isRunEnabled: () => runEnabled,
    setRunEnabled,
    modeEl,
    toggleController,
    setFlashlightEnabled,
    setPlayerUIVisible,
  };
}
