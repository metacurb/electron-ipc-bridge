import { IPC_PARAM_INJECTIONS } from "../../metadata/constants";
import { ParameterInjection, ParameterInjectionType } from "../../metadata/types";

import { createParameterInjectionDecorator } from "./create-parameter-injection-decorator";

describe("createParameterInjectionDecorator", () => {
  const TestDecorator = createParameterInjectionDecorator(
    "TEST_TYPE" as ParameterInjectionType,
    false,
  );
  const MultiAllowedDecorator = createParameterInjectionDecorator(
    "MULTI_TYPE" as ParameterInjectionType,
    true,
  );

  test("should store parameter index in metadata", () => {
    class TestClass {
      testMethod(@TestDecorator() param: unknown) {
        return param;
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections).toHaveLength(1);
    expect(injections[0]).toEqual({
      index: 0,
      type: "TEST_TYPE",
    });
  });

  test("should work with decorator at any position", () => {
    class TestClass {
      method(a: string, @TestDecorator() b: unknown, c: number) {
        return { a, b, c };
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "method",
    );

    expect(injections[0].index).toBe(1);
  });

  test("should throw error when duplicate not allowed", () => {
    expect(() => {
      class TestClass {
        testMethod(@TestDecorator() a: unknown, @TestDecorator() b: unknown) {
          return null;
        }
      }
    }).toThrow("already has a @");
  });

  test("should allow multiple when allowMultiple is true", () => {
    class TestClass {
      testMethod(@MultiAllowedDecorator() a: unknown, @MultiAllowedDecorator() b: unknown) {
        return { a, b };
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections).toHaveLength(2);
  });

  test("should work with different methods independently", () => {
    class TestClass {
      method1(@TestDecorator() param: unknown) {
        return param;
      }

      method2(a: string, @TestDecorator() param: unknown) {
        return { a, param };
      }
    }

    const injections1: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "method1",
    );
    const injections2: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "method2",
    );

    expect(injections1[0].index).toBe(0);
    expect(injections2[0].index).toBe(1);
  });

  test("should support multiple different injection types on same method", () => {
    const TypeA = createParameterInjectionDecorator("TYPE_A" as ParameterInjectionType, false);
    const TypeB = createParameterInjectionDecorator("TYPE_B" as ParameterInjectionType, false);

    class TestClass {
      testMethod(@TypeA() a: unknown, @TypeB() b: unknown) {
        return { a, b };
      }
    }

    const injections: ParameterInjection[] = Reflect.getOwnMetadata(
      IPC_PARAM_INJECTIONS,
      TestClass.prototype,
      "testMethod",
    );

    expect(injections).toHaveLength(2);
    expect(injections.map((i) => i.type)).toContain("TYPE_A");
    expect(injections.map((i) => i.type)).toContain("TYPE_B");
  });
});
