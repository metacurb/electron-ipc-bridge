<p align="center">
  <img src="apps/docs/static/img/logo.png" alt="Electron IPC Controller" width="120" />
</p>

<h1 align="center">Electron IPC Controller</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9" alt="Electron" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  A type-safe, class-based IPC framework for Electron — inspired by NestJS.<br/>
  Define controllers in main, <strong>automatically</strong> get fully typed APIs in the renderer.
</p>

<p align="center">
  <a href="https://metacurb.github.io/electron-ipc-controller/"><strong>Documentation</strong></a> ·
  <a href="https://metacurb.github.io/electron-ipc-controller/quickstart"><strong>Quickstart</strong></a> ·
  <a href="https://metacurb.github.io/electron-ipc-controller/examples"><strong>Examples</strong></a>
</p>

---

## At a Glance

**Controller** (main process):

```ts
import { IpcController, IpcHandle } from "@electron-ipc-controller/core";

@IpcController("users")
export class UserController {
  @IpcHandle()
  async getUser(id: string) {
    return { id, name: "Alice" };
  }
}
```

**Renderer**:

```ts
const user = await window.ipc.users.getUser("123");
console.log(user.name); // "Alice"  — fully typed, auto-completed
```

## Features

- **Zero channel boilerplate** — channels are generated automatically
- **Auto-generated renderer types** — the Vite plugin analyses your controllers and outputs `d.ts` declarations
- **Parameter injection** — `@Sender()`, `@Window()`, `@RawEvent()`, and custom decorators
- **No manual preload wiring** — `setupPreload()` handles everything
- **DI-friendly** — bring your own container (TypeDI, NestJS, or a simple factory)

## Install

```bash
npm install @electron-ipc-controller/core reflect-metadata
npm install -D @electron-ipc-controller/vite-plugin
```

## Getting Started

Head to the **[Quickstart guide](https://metacurb.github.io/electron-ipc-controller/quickstart)** for full setup instructions, including TypeScript config, Vite plugin setup, preload wiring, and your first controller.

## Documentation

Full documentation is available at **[metacurb.github.io/electron-ipc-controller](https://metacurb.github.io/electron-ipc-controller/)**.

## License

MIT
