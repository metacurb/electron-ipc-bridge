import { createIpcHandlerDecorator } from "../utils/create-ipc-handler-decorator";

/**
 * Method decorator that registers a one-time handler using `ipcMain.handleOnce`.
 *
 * Behaves like {@link IpcHandle} but the handler is automatically removed after
 * the first invocation.
 *
 * @param name - Optional custom method name used in the channel. Defaults to the decorated method name.
 */
export const IpcHandleOnce = createIpcHandlerDecorator("handleOnce");
