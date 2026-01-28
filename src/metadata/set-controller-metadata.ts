import { IPC_CONTROLLER_METADATA } from "./constants";
import { generateMetadata } from "./generate-metadata";
import { Constructor, IpcControllerMetadata } from "./types";

export const setControllerMetadata = (target: Constructor) => {
  const existing: IpcControllerMetadata | undefined = Reflect.getMetadata(
    IPC_CONTROLLER_METADATA,
    target,
  );
  if (existing) return existing;

  const meta = generateMetadata(target);
  Reflect.defineMetadata(IPC_CONTROLLER_METADATA, Object.freeze(meta), target);
  return meta;
};
