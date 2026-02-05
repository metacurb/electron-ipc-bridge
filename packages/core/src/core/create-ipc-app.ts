import { getControllerMetadata } from "../metadata/get-controller-metadata";
import { Constructor, Disposer } from "../metadata/types";

import { assembleIpc } from "./assemble-ipc";
import { registerContractHandler } from "./register-contract-handler";
import { ControllerResolver } from "./types";

export interface IpcAppOptions {
  controllers: Constructor[];
  correlation?: boolean;
  resolver: ControllerResolver;
}

export interface IpcApp {
  dispose(): void;
}

export const createIpcApp = ({ controllers, correlation, resolver }: IpcAppOptions): IpcApp => {
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
