import { createMock } from "@golevelup/ts-jest";
import { BrowserWindow } from "electron";

import { IPC_METADATA_CHANNEL } from "./constants";
import { emitMetadata } from "./emit-metadata";
import { IpcControllerMetadata } from "./types";

describe("emitMetadata", () => {
  let mockWindow: jest.Mocked<BrowserWindow>;
  let controllersMeta: Map<string, IpcControllerMetadata>;
  let mockWebContents: jest.Mocked<Electron.WebContents>;

  beforeEach(() => {
    mockWebContents = {
      isLoading: jest.fn(),
      once: jest.fn(),
      send: jest.fn(),
    } as unknown as jest.Mocked<Electron.WebContents>;

    mockWindow = {
      webContents: mockWebContents,
    } as unknown as jest.Mocked<BrowserWindow>;

    controllersMeta = new Map();

    jest.clearAllMocks();
  });

  it("should do nothing if targetWindow is undefined", () => {
    emitMetadata(controllersMeta);
    expect(mockWebContents.send).not.toHaveBeenCalled();
  });

  it("should send metadata immediately if webContents is not loading", () => {
    mockWebContents.isLoading.mockReturnValue(false);

    emitMetadata(controllersMeta, mockWindow);

    expect(mockWebContents.send).toHaveBeenCalledWith(IPC_METADATA_CHANNEL, controllersMeta);
    expect(mockWebContents.once).not.toHaveBeenCalled();
  });

  it("should wait for did-finish-load if webContents is loading", () => {
    mockWebContents.isLoading.mockReturnValue(true);

    emitMetadata(controllersMeta, mockWindow);

    expect(mockWebContents.send).not.toHaveBeenCalled();
    expect(mockWebContents.once).toHaveBeenCalledWith("did-finish-load", expect.any(Function));

    const callback = mockWebContents.once.mock.calls[0][1];
    // @ts-expect-error we don't care about the type here, we're just testing the callback
    callback();

    expect(mockWebContents.send).toHaveBeenCalledWith(IPC_METADATA_CHANNEL, controllersMeta);
  });
});
