import { IpcHandlerType } from "@electron-ipc-bridge/shared";
import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { Constructor } from "../metadata/types";

export interface ControllerResolver {
  resolve<T>(controller: Constructor<T>): T;
}

export interface ExecutionContext {
  channel: string;
  event: IpcMainEvent | IpcMainInvokeEvent;
  type: IpcHandlerType;
}

export interface IpcInterceptor {
  intercept(context: ExecutionContext, next: () => unknown): Promise<unknown> | unknown;
}
