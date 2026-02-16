import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import type { ParameterInjectionContext } from "../../metadata/types";
import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = (_event: IpcMainEvent | IpcMainInvokeEvent, context: ParameterInjectionContext) => context.channel;

/**
 * Parameter decorator that injects the IPC channel name into the handler method parameter.
 *
 * @example
 * ```ts
 * @IpcHandle()
 * readFile(@Channel() channel: string, path: string) { ... }
 * ```
 */
export const Channel = createParamDecorator(impl);
