import path from "path";

import { findControllers } from "./find-controllers";
import { processCreateIpcAppCall } from "./process-create-ipc-app-call";

jest.mock("./process-create-ipc-app-call");

describe("findControllers", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("finds controllers from entry file calling processCreateIpcAppCall", () => {
    const entryPath = path.join(fixturesDir, "index.ts");
    const { processedFiles } = findControllers(entryPath, path.join(fixturesDir, "tsconfig.json"));

    expect(processCreateIpcAppCall).toHaveBeenCalled();
    expect(processedFiles.size).toBeGreaterThan(0);
  });

  it("passes no resolution strategy to processCreateIpcAppCall when resolutionStrategy is omitted", () => {
    const entryPath = path.join(fixturesDir, "index.ts");
    findControllers(entryPath, path.join(fixturesDir, "tsconfig.json"));

    expect(processCreateIpcAppCall).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      undefined,
    );
  });

  it("passes nest strategy function to processCreateIpcAppCall when resolutionStrategy is 'nest'", () => {
    const entryPath = path.join(fixturesDir, "index.ts");
    findControllers(entryPath, path.join(fixturesDir, "tsconfig.json"), undefined, "nest");

    expect(processCreateIpcAppCall).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.any(Function),
    );
  });
});
