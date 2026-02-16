import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor, Disposer } from "../metadata/types";

import { assembleIpc } from "./assemble-ipc";
import { registerContractHandler } from "./register-contract-handler";
import { ControllerResolver } from "./types";

/**
 * Configuration options for {@link createIpcApp}.
 */
export interface IpcAppOptions {
  /** Array of classes decorated with {@link IpcController} to register as IPC handlers. */
  controllers: Constructor[];
  /**
   * When `true`, generates a unique correlation ID for each IPC invocation,
   * accessible via {@link getCorrelationId} or the {@link CorrelationId} parameter decorator.
   * @default false (disabled)
   */
  correlation?: boolean;
  /**
   * A resolver responsible for instantiating controller classes. This allows
   * integration with dependency injection containers (e.g. NestJS, tsyringe).
   */
  resolver: ControllerResolver;
}

/**
 * The return value of {@link createIpcApp}. Provides a handle to tear down
 * all registered IPC handlers.
 */
export interface IpcApp {
  /** Removes all IPC handlers registered by this application. */
  dispose(): void;
}

/**
 * Initializes IPC handlers for the given controllers in the Electron main process.
 *
 * Validates that all controllers are properly decorated, ensures no duplicate
 * namespaces exist, and registers each handler method on the appropriate
 * `ipcMain` channel.
 *
 * @param options - The {@link IpcAppOptions} configuration.
 * @returns An {@link IpcApp} instance whose `dispose` method tears down all handlers.
 * @throws If `controllers` is not an array, contains non-constructor values,
 *   `resolver` is missing a `resolve` method, or duplicate namespaces are found.
 *
 * @example
 * ```ts
 * const app = createIpcApp({
 *   controllers: [FileController, WindowController],
 *   correlation: true,
 *   resolver: { resolve: (Ctrl) => container.get(Ctrl) },
 * });
 *
 * // On app quit:
 * app.dispose();
 * ```
 */
export const createIpcApp = ({ controllers, correlation = false, resolver }: IpcAppOptions): IpcApp => {
  if (!Array.isArray(controllers)) {
    throw new Error("controllers must be an array");
  }
  if (controllers.length > 0 && controllers.some((c) => typeof c !== "function")) {
    throw new Error("controllers must contain only constructor functions");
  }
  if (typeof resolver?.resolve !== "function") {
    throw new Error("resolver must have a resolve() method");
  }

  const namespaces = new Set<string>();

  for (const Controller of controllers) {
    const meta = getControllerMetadata(Controller);
    if (namespaces.has(meta.namespace)) {
      throw new Error(`Duplicate namespace '${meta.namespace}' found in controllers.`);
    }
    namespaces.add(meta.namespace);
  }

  const disposers: Disposer[] = [];

  disposers.push(...assembleIpc(controllers, { correlation, resolver }));
  disposers.push(registerContractHandler(controllers));

  return {
    dispose() {
      const handlers = disposers.splice(0, disposers.length);

      for (const dispose of handlers) {
        try {
          dispose();
        } catch (error) {
          console.error("Failed to dispose IPC handler:", error);
        }
      }
    },
  };
};
