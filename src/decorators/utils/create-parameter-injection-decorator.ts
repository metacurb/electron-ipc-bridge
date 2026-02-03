import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection, ParameterInjectionType } from "../../metadata/types";

export const createParameterInjectionDecorator =
  (
    injectionType: ParameterInjectionType,
    allowMultiple: boolean = false,
  ): (() => ParameterDecorator) =>
  (): ParameterDecorator =>
  (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (!propertyKey) {
      return;
    }

    const existingInjections: ParameterInjection[] =
      Reflect.getOwnMetadata(IPC_PARAM_INJECTIONS, target, propertyKey) || [];

    if (!allowMultiple) {
      const existing = existingInjections.find((inj) => inj.type === injectionType);
      if (existing) {
        throw new Error(
          `Method '${String(propertyKey)}' already has a @${injectionType} ` +
            `decorator at parameter index ${existing.index}. ` +
            `Only one @${injectionType} decorator is allowed per method.`,
        );
      }
    }

    const newInjection: ParameterInjection = {
      index: parameterIndex,
      type: injectionType,
    };

    Reflect.defineMetadata(
      IPC_PARAM_INJECTIONS,
      [...existingInjections, newInjection],
      target,
      propertyKey,
    );
  };
