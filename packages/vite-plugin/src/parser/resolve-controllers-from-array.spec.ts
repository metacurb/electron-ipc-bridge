import { factory, TypeChecker } from "typescript";

import { resolveController } from "./resolve-controller";
import { resolveControllersFromArray } from "./resolve-controllers-from-array";
import { ControllerMetadata } from "./types";

jest.mock("./resolve-controller");

describe("resolveControllersFromArray", () => {
  it("should call resolveController for each element", () => {
    const element1 = factory.createIdentifier("Controller1");
    const element2 = factory.createIdentifier("Controller2");
    const arrayLiteral = factory.createArrayLiteralExpression([element1, element2]);
    const typeChecker = {} as TypeChecker;
    const processedFiles = new Set<string>();
    const controllers: ControllerMetadata[] = [];
    const fileCache = new Map<string, ControllerMetadata[]>();

    resolveControllersFromArray(arrayLiteral, typeChecker, processedFiles, controllers, fileCache);

    expect(resolveController).toHaveBeenCalledTimes(2);
    expect(resolveController).toHaveBeenCalledWith(element1, typeChecker, processedFiles, controllers, fileCache);
    expect(resolveController).toHaveBeenCalledWith(element2, typeChecker, processedFiles, controllers, fileCache);
  });
});
