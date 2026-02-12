---
sidebar_position: 8
title: Lifecycle & Cleanup
description: When IPC handlers are registered and how to dispose them for dynamic windows or shutdown.
---

# Lifecycle & Cleanup

IPC handlers are registered when `createIpcApp` is called and can be explicitly disposed when no longer needed.

Calling `dispose()` removes all registered handlers and listeners created by the app instance. This is useful when:

- Windows are created and destroyed dynamically
- You want deterministic teardown
- You need to fully clean up IPC listeners during app shutdown

```typescript title="src/main/index.ts"
const ipcApp = createIpcApp({
  controllers: [CounterController],
  correlation: true,
  resolver: {
    resolve: (Controller) => new Controller(),
  },
});

// ...

mainWindow.on("closed", () => {
  ipcApp.dispose();
});
```
