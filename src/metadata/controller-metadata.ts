import { randomUUID } from "node:crypto";

import { deriveNamespaceFromClassName } from "../utils/naming";

import { ControllerConstructor, IpcControllerMetadata } from "./types";

const IPC_CONTROLLER_METADATA = Symbol("ipc:controller");

export const generateMeta = (
  target: ControllerConstructor,
  namespace?: string,
): IpcControllerMetadata => ({
  handlers: new Map(),
  id: randomUUID(),
  namespace: namespace ?? deriveNamespaceFromClassName(target.name),
  target,
});

export const getControllerMetadata = (target: ControllerConstructor) => {
  const meta: IpcControllerMetadata | undefined = Reflect.getMetadata(
    IPC_CONTROLLER_METADATA,
    target,
  );
  if (!meta) {
    throw new Error(
      `Controller ${target.name} has no IPC metadata. Did you forget to apply the @Controller decorator?`,
    );
  }
  return meta;
};

export const createControllerMetadata = (
  target: ControllerConstructor,
  options?: { namespace?: string },
) => {
  const existing: IpcControllerMetadata | undefined = Reflect.getMetadata(
    IPC_CONTROLLER_METADATA,
    target,
  );
  if (existing) return existing;

  const meta = generateMeta(target, options?.namespace);
  Reflect.defineMetadata(IPC_CONTROLLER_METADATA, Object.freeze(meta), target);
  return meta;
};
