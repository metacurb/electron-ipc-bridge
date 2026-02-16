import { getControllerMetadata } from "../metadata/get-controller-metadata";

import { assembleIpc } from "./assemble-ipc";
import { createIpcApp } from "./create-ipc-app";
import { registerContractHandler } from "./register-contract-handler";
import { ControllerResolver } from "./types";

jest.mock("../metadata/get-controller-metadata");
jest.mock("./assemble-ipc");
jest.mock("./register-contract-handler");

const mockAssembleIpc = jest.mocked(assembleIpc);
const mockRegisterContractHandler = jest.mocked(registerContractHandler);
const mockGetControllerMetadata = jest.mocked(getControllerMetadata);

const mockResolver: ControllerResolver = {
  resolve: (Controller) => new Controller(),
};

const controllers = [class A {}, class B {}];

describe("createIpcApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetControllerMetadata.mockImplementation((target) => ({
      handlers: new Map(),
      id: "id",
      namespace: target.name.toLowerCase(),
      target,
    }));
    mockRegisterContractHandler.mockReturnValue(jest.fn());
  });

  test("should call assembleIpc with correct args, and register contract handler", () => {
    const mockDisposer = jest.fn();
    mockAssembleIpc.mockReturnValue([mockDisposer]);

    createIpcApp({
      controllers,
      correlation: false,
      resolver: mockResolver,
    });

    expect(mockAssembleIpc).toHaveBeenCalledWith(controllers, {
      correlation: false,
      resolver: mockResolver,
    });
    expect(mockRegisterContractHandler).toHaveBeenCalledWith(controllers);
  });

  test("should pass interceptor to assembleIpc", () => {
    const interceptor = { intercept: jest.fn() };
    createIpcApp({
      controllers,
      correlation: false,
      interceptor,
      resolver: mockResolver,
    });

    expect(mockAssembleIpc).toHaveBeenCalledWith(controllers, {
      correlation: false,
      interceptor,
      resolver: mockResolver,
    });
  });

  test("should return an object with a dispose method that calls all disposers", () => {
    const disposer1 = jest.fn();
    const disposer2 = jest.fn();
    mockAssembleIpc.mockReturnValue([disposer1, disposer2]);

    const app = createIpcApp({
      controllers,
      resolver: mockResolver,
    });

    app.dispose();

    expect(disposer1).toHaveBeenCalled();
    expect(disposer2).toHaveBeenCalled();
  });

  test("should not call disposers multiple times if dispose is called repeatedly", () => {
    const disposer = jest.fn();
    mockAssembleIpc.mockReturnValue([disposer]);

    const app = createIpcApp({
      controllers,
      resolver: mockResolver,
    });

    app.dispose();
    app.dispose();
    app.dispose();

    expect(disposer).toHaveBeenCalledTimes(1);
  });

  test("should continue disposing other handlers if one fails", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const disposer1 = jest.fn().mockImplementation(() => {
      throw new Error("fail");
    });
    const disposer2 = jest.fn();
    mockAssembleIpc.mockReturnValue([disposer1, disposer2]);

    const app = createIpcApp({
      controllers,
      resolver: mockResolver,
    });

    app.dispose();

    expect(disposer1).toHaveBeenCalled();
    expect(disposer2).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  test("should throw if controllers have duplicate namespaces", () => {
    mockGetControllerMetadata.mockImplementation((target) => ({
      handlers: new Map(),
      id: "id",
      namespace: "same_namespace",
      target,
    }));

    expect(() =>
      createIpcApp({
        controllers,
        resolver: mockResolver,
      }),
    ).toThrow("Duplicate namespace 'same_namespace' found in controllers.");
  });

  test("should throw if controllers is not an array", () => {
    expect(() =>
      createIpcApp({
        // @ts-expect-error testing invalid input
        controllers: null,
        resolver: mockResolver,
      }),
    ).toThrow("controllers must be an array");
  });

  test("should throw if controllers contains non-functions", () => {
    expect(() =>
      createIpcApp({
        // @ts-expect-error testing invalid input
        controllers: ["not a function"],
        resolver: mockResolver,
      }),
    ).toThrow("controllers must contain only constructor functions");
  });

  test("should throw if resolver is missing resolve method", () => {
    expect(() =>
      createIpcApp({
        controllers,
        // @ts-expect-error testing invalid input
        resolver: {},
      }),
    ).toThrow("resolver must have a resolve() method");
  });
});
