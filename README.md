# Crafty

## Experimental, just having fun

Crafty is a Minecraft-style voxel game engine written in TypeScript with a WebGPU rendering backend. It is designed around a deferred, HDR, multi-pass render graph, a chunk-based infinite world with procedural terrain, and a component-based game object model. The rendering feature set is comparable to a modern PC game engine: cascaded shadow maps, PBR with image-based lighting, screen-space ambient occlusion, screen-space global illumination, temporal anti-aliasing, volumetric clouds, god rays, depth-of-field, bloom, and water with screen-space reflections.

### [Play Crafty](https://brendan-duncan.github.io/crafty/dist)

![Crafty](assets/crafty.png)

---

## Build & Run

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (ships with `npm`)
- A WebGPU-capable browser

### Install

```sh
npm install
```

### Run the game (single-player)

```sh
npm run dev
```

Vite serves the game at `http://localhost:5173`. The launcher opens with a **Local** tab where you can pick a world seed and click *Start*.

### Run multiplayer

The repo includes an authoritative WebSocket server in `server/`. In two terminals:

```sh
# terminal 1 — install server deps once, then start it
npm run server:install
npm run server                # listens on ws://localhost:8787

# terminal 2 — start the client
npm run dev
```

Open the launcher's **Network** tab, leave the URL at `ws://localhost:8787` (or change it), and click *Connect*. Open additional browser tabs to join the same world. See [`server/README.md`](server/README.md) for environment variables (`PORT`, `SEED`).

### HTTPS Server

To host a server from an HTTPS server, it needs to use a WSS connection.

You can use Apache/nginx Let's Encrypt port 443. 

For a bitnami server:

**/opt/bitnami/apache/conf/bitnami/bitnami-ssl.conf** — inside the \<VirtualHost> block
```
RewriteEngine on
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteRule ^/ws/(.*) "ws://localhost:8787/$1" [P,L]
```

Then the server starts without SSL env vars (plain WS on localhost), and the client connects to wss://example.com/ws/. Port 8787 only listens on 127.0.0.1, never exposed.

### Production build

```sh
npm run build      # type-checks then writes a static bundle to dist/
npm run preview    # serves the built bundle locally
```

### Tests

```sh
npm test           # vitest in watch mode
npm run test:run   # one-shot, suitable for CI
```

---

## [Architecture Design](docs/crafty.md)
