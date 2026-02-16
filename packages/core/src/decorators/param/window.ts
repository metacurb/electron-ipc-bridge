import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) => BrowserWindow.fromWebContents(event.sender);

/**
 * Parameter decorator that injects the {@link Electron.BrowserWindow | BrowserWindow}
 * that sent the IPC message into the handler method parameter.
 *
 * Returns `null` if the sender is not associated with a `BrowserWindow`.
 */
export const Window = createParamDecorator(impl);
