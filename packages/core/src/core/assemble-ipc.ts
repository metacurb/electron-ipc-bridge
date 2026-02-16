import { registerHandler } from "../core/register-handler";
import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor, Disposer } from "../metadata/types";

import { ControllerResolver, IpcInterceptor } from "./types";

export const assembleIpc = (
  controllers: Constructor[],
  options: {
    correlation?: boolean;
    interceptor?: IpcInterceptor;
    resolver: ControllerResolver;
  },
): Disposer[] => {
  const disposers: Disposer[] = [];

  for (const Controller of controllers) {
    let instance;
    try {
      instance = options.resolver.resolve(Controller);
    } catch (error) {
      throw new Error(
        `Failed to resolve controller '${Controller.name}': ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    const meta = getControllerMetadata(Controller);

    if (meta.handlers.size === 0) {
      console.warn(`Controller '${Controller.name}' has no IPC handlers registered.`);
    }

    for (const handler of meta.handlers.values()) {
      const dispose = registerHandler(handler, instance, {
        correlation: options.correlation,
        interceptor: options.interceptor,
      });
      if (dispose) disposers.push(dispose);
    }
  }

  return disposers;
};
