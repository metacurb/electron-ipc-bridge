import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";

import { wrapWithCorrelation } from "../correlation/wrap-with-correlation";
import { Disposer, IpcHandlerMetadata } from "../metadata/types";

import { createParameterInjectionWrapper } from "./parameter-injection/create-parameter-injection-wrapper";
import { IpcInterceptor } from "./types";

type RegisterHandlerConfig = {
  correlation?: boolean;
  interceptor?: IpcInterceptor;
};

export const registerHandler = (
  handler: IpcHandlerMetadata,
  instance: unknown,
  { correlation, interceptor }: RegisterHandlerConfig,
): Disposer | undefined => {
  const boundOriginalHandler = handler.handler.bind(instance);

  const parameterInjectionWrappedHandler = createParameterInjectionWrapper(
    boundOriginalHandler,
    { channel: handler.channel },
    handler.paramInjections,
  );

  const correlationWrappedHandler = wrapWithCorrelation(parameterInjectionWrappedHandler, correlation);

  const { channel, type } = handler;
  let finalHandler = correlationWrappedHandler;

  if (interceptor) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    finalHandler = (event: IpcMainEvent | IpcMainInvokeEvent, ...args: any[]) => {
      return interceptor.intercept(
        {
          channel,
          event,
          type,
        },
        () => correlationWrappedHandler(event, ...args),
      );
    };
  }

  switch (type) {
    case "handle":
    case "handleOnce":
      ipcMain[type](channel, finalHandler);
      return () => ipcMain.removeHandler(channel);
    case "on":
    case "once":
      ipcMain[type](channel, finalHandler);
      return () => ipcMain.removeListener(channel, finalHandler);
    default: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unknown handler type: ${type}`);
    }
  }
};
