import { ipcMain, IpcMainInvokeEvent } from "electron";

import { IpcHandlerMetadata } from "../metadata/types";

import { registerHandler } from "./register-handler";
import { IpcInterceptor } from "./types";

jest.mock("electron", () => ({
  ipcMain: {
    handle: jest.fn(),
    on: jest.fn(),
    removeHandler: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock("../correlation/wrap-with-correlation", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapWithCorrelation: (handler: any) => handler,
}));

jest.mock("./parameter-injection/create-parameter-injection-wrapper", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createParameterInjectionWrapper: (handler: any) => handler,
}));

describe("Security Fix - Interceptor Pattern", () => {
  const mockInstance = {
    testMethod: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createHandler = (handlerFn: any): IpcHandlerMetadata => ({
    channel: "test-channel",
    handler: handlerFn,
    methodName: "method",
    paramInjections: [],
    type: "handle",
  });

  test("should intercept handler execution", async () => {
    const handlerFn = jest.fn().mockReturnValue("success");
    const handler = createHandler(handlerFn);

    const interceptor: IpcInterceptor = {
      intercept: jest.fn().mockImplementation((context, next) => {
        return next();
      }),
    };

    registerHandler(handler, mockInstance, { correlation: false, interceptor });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registeredHandler = (ipcMain.handle as jest.Mock).mock.calls[0][1] as (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>;

    const result = await registeredHandler({} as IpcMainInvokeEvent, "arg1");

    expect(interceptor.intercept).toHaveBeenCalled();
    // Verify execution continued
    expect(handlerFn).toHaveBeenCalled();
    expect(result).toBe("success");
  });

  test("should be able to sanitize errors", async () => {
    const error = new Error("Sensitive Info");
    const handlerFn = jest.fn().mockImplementation(() => {
      throw error;
    });
    const handler = createHandler(handlerFn);

    const interceptor: IpcInterceptor = {
      intercept: async (context, next) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return await (next() as Promise<any>);
        } catch (err) {
          return "Sanitized Error";
        }
      },
    };

    registerHandler(handler, mockInstance, { correlation: false, interceptor });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const registeredHandler = (ipcMain.handle as jest.Mock).mock.calls[0][1] as (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>;
    const result = await registeredHandler({} as IpcMainInvokeEvent);

    expect(result).toBe("Sanitized Error");
  });

  test("should receive correct context in interceptor", async () => {
     const handlerFn = jest.fn();
     const handler = createHandler(handlerFn);

     const interceptor: IpcInterceptor = {
         intercept: jest.fn().mockImplementation((context, next) => next()),
     };

     registerHandler(handler, mockInstance, { correlation: false, interceptor });

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const registeredHandler = (ipcMain.handle as jest.Mock).mock.calls[0][1] as (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>;
     const mockEvent = { sender: {} } as IpcMainInvokeEvent;
     await registeredHandler(mockEvent);

     expect(interceptor.intercept).toHaveBeenCalledWith(
         expect.objectContaining({
             channel: "test-channel",
             event: mockEvent,
             type: "handle",
         }),
         expect.any(Function)
     );
  });
});
