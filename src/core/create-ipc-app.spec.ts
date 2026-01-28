import { Container } from "typedi";

import { getControllerMetadata } from "../metadata/controller-metadata";
import { IpcControllerMetadata, IpcHandlerMetadata } from "../metadata/types";
import { generatePreloadApi } from "../preload/generate-preload-api";

import { createIpcApp } from "./create-ipc-app";
import { registerHandler } from "./register-handler";

jest.mock("../metadata/controller-metadata");
jest.mock("../preload/generate-preload-api");
jest.mock("./register-handler");

const mockContainer = jest.mocked(Container);
const mockGetControllerMetadata = jest.mocked(getControllerMetadata);
const mockGeneratePreloadApi = jest.mocked(generatePreloadApi);
const mockRegisterHandler = jest.mocked(registerHandler);

describe("createIpcApp", () => {
  class TestController {}

  const mockHandlerMeta: IpcHandlerMetadata = {
    handler: jest.fn(),
    methodName: "testMethod",
    rawEvent: false,
    type: "handle",
  };

  const mockControllerMeta: IpcControllerMetadata = {
    handlers: new Map([["testMethod", mockHandlerMeta]]),
    id: "TestController",
    namespace: "test",
    target: TestController,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create an IPC app and register handlers for each controller", () => {
    mockGetControllerMetadata.mockReturnValue(mockControllerMeta);
    const mockInstance = new TestController();
    mockContainer.get.mockReturnValue(mockInstance);

    const disposeFn = jest.fn();
    mockRegisterHandler.mockReturnValue(disposeFn);

    const app = createIpcApp({
      controllers: [TestController],
      correlation: true,
    });

    expect(mockGetControllerMetadata).toHaveBeenCalledWith(TestController);
    expect(mockContainer.get).toHaveBeenCalledWith(TestController);
    expect(mockRegisterHandler).toHaveBeenCalledWith(mockHandlerMeta, mockInstance, {
      correlation: true,
      namespace: "test",
    });

    app.dispose();
    expect(disposeFn).toHaveBeenCalled();
  });

  test("should handle multiple handlers in a controller", () => {
    const handler2: IpcHandlerMetadata = { ...mockHandlerMeta, methodName: "method2" };
    const multiHandlerMeta: IpcControllerMetadata = {
      ...mockControllerMeta,
      handlers: new Map([
        ["testMethod", mockHandlerMeta],
        ["method2", handler2],
      ]),
    };

    mockGetControllerMetadata.mockReturnValue(multiHandlerMeta);
    mockContainer.get.mockReturnValue(new TestController());

    createIpcApp({
      controllers: [TestController],
      correlation: false,
    });

    expect(mockRegisterHandler).toHaveBeenCalledTimes(2);
    expect(mockRegisterHandler).toHaveBeenCalledWith(mockHandlerMeta, expect.any(Object), {
      correlation: false,
      namespace: "test",
    });
    expect(mockRegisterHandler).toHaveBeenCalledWith(handler2, expect.any(Object), {
      correlation: false,
      namespace: "test",
    });
  });

  test("should generate preload API with collected metadata", () => {
    mockGetControllerMetadata.mockReturnValue(mockControllerMeta);
    mockContainer.get.mockReturnValue(new TestController());

    const app = createIpcApp({
      controllers: [TestController],
      correlation: true,
    });

    app.generatePreloadApi();

    expect(mockGeneratePreloadApi).toHaveBeenCalledWith({
      controllers: new Map([[mockControllerMeta.id, mockControllerMeta]]),
    });
  });

  test("should support default correlation value", () => {
    mockGetControllerMetadata.mockReturnValue(mockControllerMeta);
    mockContainer.get.mockReturnValue(new TestController());

    createIpcApp({
      controllers: [TestController],
    });

    expect(mockRegisterHandler).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({ correlation: true }),
    );
  });

  test("should handle multiple controllers", () => {
    class Controller1 {}
    class Controller2 {}

    const meta1: IpcControllerMetadata = { ...mockControllerMeta, id: "C1", target: Controller1 };
    const meta2: IpcControllerMetadata = { ...mockControllerMeta, id: "C2", target: Controller2 };

    mockGetControllerMetadata.mockReturnValueOnce(meta1).mockReturnValueOnce(meta2);

    createIpcApp({
      controllers: [Controller1, Controller2],
      correlation: true,
    });

    expect(mockGetControllerMetadata).toHaveBeenCalledTimes(2);
    expect(mockContainer.get).toHaveBeenCalledWith(Controller1);
    expect(mockContainer.get).toHaveBeenCalledWith(Controller2);
  });

  describe("dispose", () => {
    test("should call all disposers from all controllers and handlers", () => {
      const dispose1 = jest.fn();
      const dispose2 = jest.fn();
      const dispose3 = jest.fn();

      const meta1: IpcControllerMetadata = {
        ...mockControllerMeta,
        handlers: new Map([
          ["h1", { ...mockHandlerMeta, methodName: "h1" }],
          ["h2", { ...mockHandlerMeta, methodName: "h2" }],
        ]),
        id: "C1",
      };
      const meta2: IpcControllerMetadata = {
        ...mockControllerMeta,
        handlers: new Map([["h3", { ...mockHandlerMeta, methodName: "h3" }]]),
        id: "C2",
      };

      mockGetControllerMetadata.mockReturnValueOnce(meta1).mockReturnValueOnce(meta2);
      mockContainer.get.mockReturnValue({});

      mockRegisterHandler
        .mockReturnValueOnce(dispose1)
        .mockReturnValueOnce(dispose2)
        .mockReturnValueOnce(dispose3);

      const app = createIpcApp({ controllers: [class {}, class {}] });

      app.dispose();

      expect(dispose1).toHaveBeenCalled();
      expect(dispose2).toHaveBeenCalled();
      expect(dispose3).toHaveBeenCalled();
    });

    test("should not throw if no disposers were registered", () => {
      const meta: IpcControllerMetadata = { ...mockControllerMeta, handlers: new Map() };
      mockGetControllerMetadata.mockReturnValue(meta);

      const app = createIpcApp({ controllers: [class {}] });

      expect(() => app.dispose()).not.toThrow();
    });
  });

  describe("generatePreloadApi", () => {
    test("should return the result from generatePreloadApi implementation", () => {
      const mockApi = { some: "api" };
      mockGeneratePreloadApi.mockReturnValue(mockApi);
      mockGetControllerMetadata.mockReturnValue(mockControllerMeta);
      mockContainer.get.mockReturnValue({});

      const app = createIpcApp({ controllers: [TestController] });
      const result = app.generatePreloadApi();

      expect(result).toBe(mockApi);
      expect(mockGeneratePreloadApi).toHaveBeenCalled();
    });
  });
});
