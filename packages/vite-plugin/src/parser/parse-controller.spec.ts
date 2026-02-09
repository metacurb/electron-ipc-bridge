import path from "path";
import { forEachChild, isClassDeclaration } from "typescript";

import { getDecorator } from "./get-decorator";
import { parseController } from "./parse-controller";
import { parseMethod } from "./parse-method";
import { createFixtureProgram } from "./test-utils";
import { MethodMetadata } from "./types";

jest.mock("./parse-method");

const mockParseMethod = jest.mocked(parseMethod);

describe("parseController", () => {
  const fixturesDir = path.resolve(__dirname, "fixtures/simple");

  beforeEach(() => {
    jest.clearAllMocks();
    mockParseMethod.mockReturnValue({
      decoratorName: "IpcHandle",
      name: "mockMethod",
      params: [],
      returnType: "void",
    } as unknown as MethodMetadata);
  });

  it("parses controller metadata calls parseMethod using IpcController decorator", () => {
    const { sourceFile, typeChecker } = createFixtureProgram(fixturesDir, "counter.controller.ts");
    let parsed = false;

    forEachChild(sourceFile, (node) => {
      if (isClassDeclaration(node) && node.name?.text === "CounterController") {
        const decorator = getDecorator(node, "IpcController");
        if (decorator) {
          const metadata = parseController(node, decorator, sourceFile, typeChecker);
          expect(metadata.className).toBe("CounterController");
          expect(metadata.namespace).toBe("counter");
          expect(mockParseMethod).toHaveBeenCalled();
          expect(metadata.methods).toContainEqual(expect.objectContaining({ name: "mockMethod" }));
          parsed = true;
        }
      }
    });

    expect(parsed).toBe(true);
  });
});
