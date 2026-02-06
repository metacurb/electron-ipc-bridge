import { IPC_CONTRACT_CHANNEL, SerializedIpcContract } from "@electron-ipc-controller/shared";
import { contextBridge, ipcRenderer } from "electron";

import { createPreloadApi } from "./create-preload-api";
import { PreloadApi } from "./types";

export const setupPreload = async (apiKey: string = "ipc"): Promise<PreloadApi> => {
  const contract: SerializedIpcContract = await ipcRenderer.invoke(IPC_CONTRACT_CHANNEL);
  const api = createPreloadApi(contract);

  contextBridge.exposeInMainWorld(apiKey, api);

  return api;
};
