import fs from "fs";
import path from "path";

import { generateIpc } from "./generate-ipc.js";
import { PluginState } from "./plugin-state.js";

// Mock external modules
jest.mock("fs");
jest.mock("path", () => {
  const originalPath = jest.requireActual("path");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalPath,
    dirname: jest.fn(),
    relative: jest.fn(),
    resolve: jest.fn(),
  };
});

// Mock internal modules
jest.mock("./generator/generate-global-types.js", () => ({
  generateGlobalTypes: jest.fn().mockReturnValue("mockGlobalTypes"),
}));
jest.mock("./generator/generate-runtime-types.js", () => ({
  generateRuntimeTypes: jest.fn().mockReturnValue("mockRuntimeTypes"),
}));
jest.mock("./parser/find-controllers.js", () => ({
  findControllers: jest.fn().mockReturnValue({
    controllers: ["mockController"],
    processedFiles: ["mockFile.ts"],
    program: {},
  }),
}));
jest.mock("./preload/resolve-api-root.js", () => ({
  resolveApiRootFromPreload: jest.fn().mockReturnValue({
    dependencies: ["mockPreloadDep.ts"],
    namespace: {},
  }),
}));
jest.mock("./resolve-type-paths.js", () => ({
  resolveTypePaths: jest.fn().mockReturnValue({
    globalPath: "/root/dist/global.d.ts",
    runtimePath: "/root/dist/runtime.ts",
  }),
}));

describe("generateIpc", () => {
  const mockRoot = "/root";
  const mockOptions = {
    main: "src/main.ts",
    preload: "src/preload.ts",
    types: {},
  };
  let mockState: PluginState;

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = new PluginState();

    // Setup default mock behaviors
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (path.resolve as jest.Mock).mockImplementation((...args: string[]) => args.join("/"));
    (path.dirname as jest.Mock).mockImplementation((p: string) => p.substring(0, p.lastIndexOf("/")));
    (path.relative as jest.Mock).mockImplementation((_from: string, to: string) => `relative/${to}`);
  });

  it("should generate types when main entry exists", () => {
    generateIpc(mockRoot, mockState, mockOptions);

    expect(fs.existsSync).toHaveBeenCalledWith("/root/src/main.ts");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "/root/dist/runtime.ts",
      "mockRuntimeTypes"
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "/root/dist/global.d.ts",
      "mockGlobalTypes"
    );
  });

  it("should warn and return if main entry does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    generateIpc(mockRoot, mockState, mockOptions);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Main entry not found"));
    expect(fs.writeFileSync).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
