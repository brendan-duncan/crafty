# Crafty Server

Authoritative WebSocket server for Crafty multiplayer. Hosts one or more persistent worlds; clients pick a world (or create a new one) from the launcher's Network tab.

## Run

```
cd server
npm install
npm run dev
```

Listens on `ws://localhost:8787` by default. Override:

| Env var    | Default              | Notes                                          |
|------------|----------------------|------------------------------------------------|
| `PORT`     | `8787`               | WebSocket port                                 |
| `DATA_DIR` | `<this dir>/data/`   | Directory holding `<worldId>.json` save files  |

## Persistence

- Each world is a single JSON file at `data/<worldId>.json`.
- World state is loaded into memory on first join and stays resident until the process exits.
- Auto-saves every 5 s when a world has unsaved changes; an atomic `write-tmp + rename` makes saves crash-safe.
- On `SIGINT` / `SIGTERM` the server flushes every dirty world before exiting.
- Per-player position is keyed by the client-provided `playerKey` (a UUID stored in the client's `localStorage`), so renaming doesn't lose progress.

The `data/` directory is excluded from git — it's the live world database.

## Protocol

Message shapes are defined in [`../shared/net_protocol.ts`](../shared/net_protocol.ts) and shared with the client. The connection lifecycle is:

```
client → hello { playerKey, name, version }
server → world_list { worlds: [...] }

(optional) client → create_world { name, seed }
          server → world_created { world }

client → join_world { worldId }
server → welcome { playerId, seed, sunAngle, lastPosition, players, edits }

… in-game messages …
```
