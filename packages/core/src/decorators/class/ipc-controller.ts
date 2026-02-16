import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { setControllerMetadata } from "../../metadata/set-controller-metadata";
import { Constructor, PendingHandlerMetadata } from "../../metadata/types";
import { createChannelName } from "../../utils/create-channel-name";

/**
 * Class decorator that registers a class as an IPC controller.
 *
 * Methods decorated with {@link IpcHandle}, {@link IpcOn}, or their `Once` variants
 * will be registered as IPC channel handlers when the controller is passed to {@link createIpcApp}.
 *
 * @param namespace - Optional namespace used to prefix all IPC channel names for this controller.
 *   Derives from the class name if omitted.
 *   FileController -> "file"
 *   UserSubscriptionsController => "userSubscriptions"
 *
 * @example
 * ```ts
 * @IpcController("files")
 * class FileController {
 *   @IpcHandle()
 *   readFile(path: string) { ... }
 * }
 * ```
 */
export const IpcController =
  (namespace?: string): ClassDecorator =>
  (target) => {
    const ctor = target as unknown as Constructor<object>;

    const meta = setControllerMetadata(ctor, namespace);

    const pending: PendingHandlerMetadata[] = Reflect.getMetadata(IPC_PENDING_HANDLERS, ctor.prototype) || [];

    for (const handler of pending) {
      if (meta.handlers.has(handler.methodName)) {
        throw new Error(`Duplicate handler name ${handler.methodName} in controller ${ctor.name}`);
      }

      meta.handlers.set(handler.methodName, {
        ...handler,
        channel: createChannelName(namespace || meta.namespace, handler.methodName),
      });
    }
  };
