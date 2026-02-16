import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) => event.processId;

/**
 * Parameter decorator that injects the OS-level process ID of the renderer
 * that sent the IPC message into the handler method parameter.
 */
export const ProcessId = createParamDecorator(impl);
