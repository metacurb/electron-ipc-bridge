import { IPC_PENDING_HANDLERS } from "../../metadata/constants";
import { PendingHandlerMetadata } from "../../metadata/types";

import { createIpcHandlerDecorator } from "./create-ipc-handler-decorator";

describe("createIpcHandlerDecorator", () => {
  const TestDecorator = createIpcHandlerDecorator("handle");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should attach metadata", () => {
    class TestController {
      @TestDecorator()
      methodName() {}
    }

    const [meta]: PendingHandlerMetadata[] = Reflect.getOwnMetadata(
      IPC_PENDING_HANDLERS,
      TestController.prototype,
    );

    expect(meta).toEqual<PendingHandlerMetadata>({
      handler: expect.any(Function),
      methodName: "methodName",
      type: "handle",
    });
  });

  test("should throw if multiple decorators applied to same method", () => {
    expect(() => {
      class TestController {
        @TestDecorator()
        @TestDecorator()
        methodName() {}
      }
    }).toThrow("Method 'methodName' already has an IPC decorator.");
  });

  test("should throw if applied to a non-method", () => {
    expect(() => {
      class TestController {
        // @ts-expect-error This is a method decorator, but we're validating it anyway
        @TestDecorator()
        notAMethod = "string";
      }
    }).toThrow("IPC decorators can only be applied to methods.");
  });
});
