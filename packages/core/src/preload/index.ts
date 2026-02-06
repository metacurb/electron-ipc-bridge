export { createPreloadApi } from "./create-preload-api";
export { setupPreload } from "./setup-preload";
export type { Disposer, HandleMethod, MethodCreator, PreloadApi, PreloadNamespace, SendMethod } from "./types";

export type {
  IpcHandlerType,
  SerializedController,
  SerializedHandler,
  SerializedIpcContract,
} from "@electron-ipc-controller/shared";
export { IPC_CONTRACT_CHANNEL } from "@electron-ipc-controller/shared";
