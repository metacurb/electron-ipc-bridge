import path from "path";
import { forEachChild, isClassDeclaration } from "typescript";

import { getDecorator } from "./get-decorator";
import { createFixtureProgram } from "./test-utils";

describe("getDecorator", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  it("finds a decorator by name", () => {
    const { sourceFile } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    let found = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "IpcController");
        expect(decorator).toBeDefined();
        found = true;
      }
    });

    expect(found).toBe(true);
  });

  it("returns undefined if decorator is not found", () => {
    const { sourceFile } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    let checked = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "NonExistentDecorator");
        expect(decorator).toBeUndefined();
        checked = true;
      }
    });

    expect(checked).toBe(true);
  });
});
