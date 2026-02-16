import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (event: IpcMainEvent | IpcMainInvokeEvent) => event.sender;

/**
 * Parameter decorator that injects the {@link Electron.WebContents | WebContents}
 * instance of the sender into the handler method parameter.
 */
export const Sender = createParamDecorator(impl);
