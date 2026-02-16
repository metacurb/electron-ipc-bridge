import { correlationStore } from "./correlation-store";

/**
 * Returns the correlation ID for the current IPC handler invocation, or `undefined`
 * if correlation tracking is not enabled or called outside of an IPC handler context.
 *
 * Correlation IDs are scoped using `AsyncLocalStorage`, so each concurrent
 * invocation receives its own unique ID.
 */
export const getCorrelationId = () => correlationStore.getStore();
