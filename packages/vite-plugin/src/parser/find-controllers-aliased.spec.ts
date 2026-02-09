import path from "path";

import { findControllers } from "./find-controllers";

describe("findControllers with aliased createIpcApp", () => {
  it("finds controllers when createIpcApp is imported under an alias", () => {
    const fixturesDir = path.resolve(__dirname, "fixtures/aliased");
    const entryPath = path.join(fixturesDir, "index.ts");
    const tsconfigPath = path.join(fixturesDir, "tsconfig.json");

    const { controllers } = findControllers(entryPath, tsconfigPath);

    expect(controllers).toHaveLength(1);
    expect(controllers[0].namespace).toBe("counter");
  });
});
