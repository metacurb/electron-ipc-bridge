import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) => event.senderFrame;

/**
 * Parameter decorator that injects the {@link Electron.WebFrameMain | WebFrameMain}
 * of the sender frame into the handler method parameter.
 */
export const Origin = createParamDecorator(impl);
