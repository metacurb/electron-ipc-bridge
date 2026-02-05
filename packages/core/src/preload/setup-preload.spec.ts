import { ipcRenderer } from "electron";

import { IPC_CONTRACT_CHANNEL } from "../core/constants";
import { SerializedIpcContract } from "../core/types";

import { setupPreload } from "./setup-preload";

const mockIpcRender = jest.mocked(ipcRenderer);

describe("setupPreload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve with api when contract is received", async () => {
    const contract: SerializedIpcContract = { controllers: [] };

    mockIpcRender.invoke.mockResolvedValue(contract);

    const api = await setupPreload();

    expect(mockIpcRender.invoke).toHaveBeenCalledWith(IPC_CONTRACT_CHANNEL);
    expect(api).toEqual({});
  });
});
