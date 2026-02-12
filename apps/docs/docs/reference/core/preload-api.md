---
title: Preload API
sidebar_position: 4
description: setupPreload, PreloadApi types, and the managed preload entry.
---

# Preload API

## `setupPreload(options?: { namespace?: string }): Promise<PreloadApi>`

Fetches the IPC contract from main process, creates a renderer-safe API object, and exposes it through Electron's [`contextBridge`](https://www.electronjs.org/docs/latest/api/context-bridge).

```ts
type HandleMethod<TArgs extends unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => Promise<TReturn>;
type SendMethod<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;
type PreloadNamespace = Record<string, HandleMethod | SendMethod>;
type PreloadApi = Record<string, PreloadNamespace>;
```

### Defaults

- `namespace` defaults to `"ipc"`
- Contract is fetched through `IPC_CONTRACT_CHANNEL`

### Behaviour

- `handle`/`handleOnce` methods are exposed via [`ipcRenderer.invoke`](https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args)
- `on`/`once` methods are exposed via [`ipcRenderer.send`](https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrenderersendchannel-args)
- return value resolves to the constructed `PreloadApi` object

### Failure modes to account for

- If contract fetch fails, promise rejects
- If [`contextBridge.exposeInMainWorld`](https://www.electronjs.org/docs/latest/api/context-bridge#contextbridgeexposeinmainworldapikey-api) fails (for example duplicate key or invalid preload context), promise rejects

## Managed preload entry

For zero-config preload, use:

```ts
preload: require.resolve("@electron-ipc-bridge/core/preload.js");
```

This runs `setupPreload()` internally using the default namespace `"ipc"`.

## Related guides

- [Preload Integration](../../guides/preload.md)
