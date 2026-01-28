import { randomUUID } from "node:crypto";

import { deriveNamespace } from "../utils/derive-namespace";

import { Constructor, IpcControllerMetadata } from "./types";

export const generateMetadata = (target: Constructor): IpcControllerMetadata => ({
  handlers: new Map(),
  id: randomUUID(),
  namespace: deriveNamespace(target.name),
  target,
});
