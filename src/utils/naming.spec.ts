import { buildChannel, deriveNamespaceFromClassName } from "./naming";

describe("Naming Utils", () => {
  describe("buildChannel", () => {
    test("should combine namespace and method with a colon", () => {
      expect(buildChannel("user", "create")).toBe("user:create");
    });
  });

  describe("deriveNamespaceFromClassName", () => {
    test.each([
      ["UserController", "user"],
      ["UserControllerController", "user_controller"],
      ["UserProfileController", "user_profile"],
    ])('should remove "Controller" suffix from %s', (input, expected) => {
      expect(deriveNamespaceFromClassName(input)).toBe(expected);
    });

    test("should snake_case camelCase names", () => {
      expect(deriveNamespaceFromClassName("UserProfileController")).toBe("user_profile");
    });

    test("should handle names without Controller suffix", () => {
      expect(deriveNamespaceFromClassName("Auth")).toBe("auth");
    });

    test("should handle lowercase names", () => {
      expect(deriveNamespaceFromClassName("status")).toBe("status");
    });
  });
});
