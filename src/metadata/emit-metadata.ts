import { BrowserWindow } from "electron";

import { IPC_METADATA_CHANNEL } from "./constants";
import { IpcControllerMetadata } from "./types";

export const emitMetadata = (
  controllersMeta: Map<string, IpcControllerMetadata>,
  targetWindow?: BrowserWindow,
) => {
  if (!targetWindow) return;

  const { webContents } = targetWindow;

  if (!webContents.isLoading()) {
    webContents.send(IPC_METADATA_CHANNEL, controllersMeta);
  } else {
    webContents.once("did-finish-load", () =>
      webContents.send(IPC_METADATA_CHANNEL, controllersMeta),
    );
  }
};
