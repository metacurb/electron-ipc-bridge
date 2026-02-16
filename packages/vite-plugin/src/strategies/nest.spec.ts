import path from "path";
import { createProgram } from "typescript";

import { nestResolutionStrategy } from "./nest";
import { ResolutionContext } from "./types";

const fixturesBase = path.resolve(__dirname, "../parser/fixtures");

const createContext = (fixtureDir: string): ResolutionContext => {
  const entryPath = path.join(fixtureDir, "index.ts");
  const program = createProgram([entryPath], {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
  });
  const sourceFile = program.getSourceFile(entryPath);
  if (!sourceFile) throw new Error(`Could not get source file: ${entryPath}`);
  return {
    fileCache: new Map(),
    processedFiles: new Set(),
    sourceFile,
    typeChecker: program.getTypeChecker(),
  };
};

describe("nestResolutionStrategy", () => {
  it("returns controllers when NestFactory.createApplicationContext is present", () => {
    const context = createContext(path.join(fixturesBase, "nest-strategy-resolution"));
    const controllers = nestResolutionStrategy(context);

    expect(controllers.length).toBeGreaterThan(0);
    const classNames = controllers.map((c) => c.className);
    expect(classNames).toContain("AppController");
  });

  it("follows module imports to discover controllers in child modules", () => {
    const context = createContext(path.join(fixturesBase, "nest-strategy-resolution"));
    const controllers = nestResolutionStrategy(context);

    const classNames = controllers.map((c) => c.className);
    expect(classNames).toContain("ChildController");
  });

  it("returns empty array when no createApplicationContext call exists", () => {
    const context = createContext(path.join(fixturesBase, "simple"));
    const controllers = nestResolutionStrategy(context);

    expect(controllers).toEqual([]);
  });
});
