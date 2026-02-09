import crypto from "crypto";

import { ControllerMetadata } from "./parser/types.js";

export const hashControllerMetadata = (controllers: ControllerMetadata[]): string => {
  const stable = controllers.map((c) => ({
    methods: c.methods.map((m) => ({
      decoratorName: m.decoratorName,
      name: m.name,
      params: m.params,
      returnType: m.returnType,
    })),
    namespace: c.namespace,
    referencedTypes: c.referencedTypes.map((t) => t.definition),
  }));

  return crypto.createHash("md5").update(JSON.stringify(stable)).digest("hex");
};
