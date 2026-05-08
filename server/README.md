# Crafty Server

Authoritative WebSocket server for Crafty multiplayer.

## Run

```
cd server
npm install
npm run dev
```

Listens on `ws://localhost:8787` by default. Override with `PORT=9000 npm run dev`.

## Protocol

Message shapes are defined in [`../shared/net_protocol.ts`](../shared/net_protocol.ts) and shared with the client. The server is authoritative over the block-edit log; clients send intents and apply confirmations broadcast back.

The server uses the same world seed for everyone (default `13`) and only stores edits made on top of the seeded terrain. New clients receive the full edit log on connect via the `welcome` message.
