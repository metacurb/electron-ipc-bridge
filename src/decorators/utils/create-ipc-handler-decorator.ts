import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { IpcHandlerType, PendingHandlerMetadata } from "../../metadata/types";

export const createIpcHandlerDecorator = (type: IpcHandlerType) => (): MethodDecorator => {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    if (typeof descriptor?.value !== "function") {
      throw new Error(`IPC decorators can only be applied to methods.`);
    }

    const handlerMeta: PendingHandlerMetadata = {
      handler: descriptor.value,
      methodName: String(propertyKey),
      type,
    };

    const pending: PendingHandlerMetadata[] =
      Reflect.getMetadata(IPC_PENDING_HANDLERS, target) || [];

    if (pending.some((h) => h.methodName === String(propertyKey))) {
      throw new Error(`Method '${String(propertyKey)}' already has an IPC decorator.`);
    }

    pending.push(handlerMeta);

    Reflect.defineMetadata(IPC_PENDING_HANDLERS, pending, target);
  };
};
