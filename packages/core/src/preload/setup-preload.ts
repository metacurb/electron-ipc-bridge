import { ipcRenderer } from "electron";

import { IPC_CONTRACT_CHANNEL } from "../core/constants";
import { SerializedIpcContract } from "../core/types";

import { createPreloadApi } from "./create-preload-api";
import { PreloadApi } from "./types";

export const setupPreload = async (): Promise<PreloadApi> => {
  const contract: SerializedIpcContract = await ipcRenderer.invoke(IPC_CONTRACT_CHANNEL);
  return createPreloadApi(contract);
};
