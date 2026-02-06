export type IpcHandlerType = "handle" | "handleOnce" | "on" | "once";
export type IpcDecoratorName = "IpcHandle" | "IpcHandleOnce" | "IpcOn" | "IpcOnce";

export interface SerializedHandler {
  channel: string;
  methodName: string;
  type: IpcHandlerType;
}

export interface SerializedController {
  handlers: SerializedHandler[];
  id: string;
  namespace: string;
}

export interface SerializedIpcContract {
  controllers: SerializedController[];
}
