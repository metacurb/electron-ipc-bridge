import Container from "typedi";

import { createControllerMetadata } from "../metadata/controller-metadata";
import { Constructor } from "../metadata/types";

export interface ControllerOptions {
  namespace?: string;
}

export const Controller = ({
  namespace: userDefinedNamespace,
}: ControllerOptions = {}): ClassDecorator => {
  return (target) => {
    const ctor = target as unknown as Constructor;

    createControllerMetadata(ctor, { namespace: userDefinedNamespace });

    if (!Container.has(ctor)) {
      Container.set(ctor, new ctor());
    }
  };
};
