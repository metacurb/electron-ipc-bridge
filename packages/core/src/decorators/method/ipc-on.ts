import { createIpcHandlerDecorator } from "../utils/create-ipc-handler-decorator";

/**
 * Method decorator that registers a handler using `ipcMain.on`.
 *
 * Use this for fire-and-forget style IPC — the renderer sends a message
 * via `ipcRenderer.send` and does not expect a return value.
 *
 * @param name - Optional custom method name used in the channel. Defaults to the decorated method name.
 */
export const IpcOn = createIpcHandlerDecorator("on");
