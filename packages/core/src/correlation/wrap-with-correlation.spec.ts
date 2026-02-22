import { randomUUID } from "crypto";

import { correlationStore } from "./correlation-store";
import { wrapWithCorrelation } from "./wrap-with-correlation";

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "generated-uuid"),
}));

describe("wrapWithCorrelation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should run handler in correlation context when enabled", () => {
    const handler = jest.fn<string | undefined, []>().mockImplementation(() => correlationStore.getStore());

    const wrapped = wrapWithCorrelation(handler, true);
    const result = wrapped();

    expect(result).toBe("generated-uuid");
    expect(handler).toHaveBeenCalled();
    expect(randomUUID).toHaveBeenCalled();
  });

  test("should not run handler in correlation context when disabled", () => {
    const handler = jest.fn();
    const wrapped = wrapWithCorrelation(handler, false);

    expect(wrapped).toBe(handler);
    expect(randomUUID).not.toHaveBeenCalled();
  });

  test("should reuse existing correlation context if available", () => {
    const existingId = "existing-correlation-id";
    const handler = jest.fn<string | undefined, []>().mockImplementation(() => correlationStore.getStore());

    const wrapped = wrapWithCorrelation(handler, true);

    const result = correlationStore.run(existingId, () => wrapped());

    expect(result).toBe(existingId);
    expect(handler).toHaveBeenCalled();
    expect(randomUUID).not.toHaveBeenCalled();
  });

  test("should preserve 'this' context", () => {
    const handler = jest.fn(function (this: { foo: string }) {
      return this.foo;
    });
    const context = { foo: "bar" };
    const wrapped = wrapWithCorrelation(handler, true);

    const result = wrapped.call(context);

    expect(result).toBe("bar");
    expect(handler).toHaveBeenCalled();
  });

  test("should preserve 'this' context when called as a method", () => {
    const obj = {
      foo: "bar",
      method() {
        return this.foo;
      },
    };
    // @ts-expect-error - method wrapping
    obj.method = wrapWithCorrelation(obj.method, true);

    const result = obj.method();

    expect(result).toBe("bar");
  });
});
