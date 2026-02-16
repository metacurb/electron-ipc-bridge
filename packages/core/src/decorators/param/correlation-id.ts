import { getCorrelationId } from "../../correlation/get-correlation-id";
import { createParamDecorator } from "../utils/create-param-decorator";

export const impl = () => getCorrelationId();

/**
 * Parameter decorator that injects the current correlation ID into the handler method parameter.
 *
 * Correlation IDs are generated per IPC invocation when the `correlation` option
 * is enabled in {@link createIpcApp}. Returns `undefined` if correlation is disabled.
 */
export const CorrelationId = createParamDecorator(impl);
