import Container from "typedi";

import { registerHandler } from "../core/register-handler";

import { emitMetadata } from "./emit-metadata";
import { getControllerMetadata } from "./get-controller-metadata";
import { Constructor, Disposer, IpcControllerMetadata } from "./types";

export const registerHandlers = (controllers: Constructor[], correlation: boolean) => {
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

  return { controllersMeta, disposers, emitMetadata };
};
