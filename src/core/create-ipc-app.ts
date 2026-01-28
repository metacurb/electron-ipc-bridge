import { Container } from "typedi";

import { getControllerMetadata } from "../metadata/controller-metadata";
import {
  Constructor,
  Disposer,
  IpcApplicationMetadata,
  IpcControllerMetadata,
} from "../metadata/types";
import { generatePreloadApi } from "../preload/generate-preload-api";

import { registerHandler } from "./register-handler";

interface IpcAppOptions {
  controllers: Constructor[];
  correlation?: boolean;
}

export interface IpcApp {
  dispose(): void;
  generatePreloadApi: () => ReturnType<typeof generatePreloadApi>;
}

export const createIpcApp = ({ controllers, correlation = true }: IpcAppOptions): IpcApp => {
  const controllersMeta = new Map<string, IpcControllerMetadata>();
  const disposers: Disposer[] = [];

  for (const Controller of controllers) {
    const meta = getControllerMetadata(Controller);
    const instance = Container.get(Controller);

    for (const handler of meta.handlers.values()) {
      const dispose = registerHandler(handler, instance, {
        correlation,
        namespace: meta.namespace,
      });
      if (dispose) {
        disposers.push(dispose);
      }
    }

    controllersMeta.set(meta.id, meta);
  }

  const metadata: IpcApplicationMetadata = {
    controllers: controllersMeta,
  };

  return {
    dispose() {
      for (const dispose of disposers) {
        dispose();
      }
    },
    generatePreloadApi: () => generatePreloadApi(metadata),
  };
};
