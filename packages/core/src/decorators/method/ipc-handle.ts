import { createIpcHandlerDecorator } from "../utils/create-ipc-handler-decorator";

/**
 * Method decorator that registers a handler using `ipcMain.handle`.
 *
 * Use this for request/response style IPC — the renderer invokes the channel
 * via `ipcRenderer.invoke` and receives the return value as a promise.
 *
 * @param name - Optional custom method name used in the channel. Defaults to the decorated method name.
 */
export const IpcHandle = createIpcHandlerDecorator("handle");
