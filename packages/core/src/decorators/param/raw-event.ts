import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) => event;

/**
 * Parameter decorator that injects the raw Electron IPC event object
 * (`IpcMainEvent` or `IpcMainInvokeEvent`) into the handler method parameter.
 */
export const RawEvent = createParamDecorator(impl);
