# Server

Authoritative WebSocket server for multiplayer. **Separate npm package** — it has its own `package.json` and `node_modules`.

## Install / run

```sh
npm run server:install   # from repo root, once
npm run server           # listens on ws://localhost:8787
```

Env vars: `PORT`, `SEED`. See [README.md](README.md) for HTTPS/WSS reverse-proxy setup.

## Files

- [src/server.ts](src/server.ts) — entry point, WS upgrade, room dispatch.
- [src/world_room.ts](src/world_room.ts) — per-world room: holds connected players, broadcasts state.
- [src/world_state.ts](src/world_state.ts) — authoritative world state (blocks, entities).
- [src/world_repository.ts](src/world_repository.ts) — persistence to `data/`.
- [data/](data/) — on-disk world saves (gitignored or local).

## Wire protocol

Shared with the client in [../shared/net_protocol.ts](../shared/net_protocol.ts). Both ends import from the same file — keep them in sync.

## Conventions

- TypeScript, ESM, `.js` import extensions (same as the rest of the repo).
- No game-rendering code here. Pure simulation + networking.
