import { loadEnv } from "@medusajs/utils";

loadEnv("test", process.cwd());

export const transform = {
  "^.+\\.[jt]s$": [
    "@swc/jest",
    {
      jsc: {
        parser: { syntax: "typescript", decorators: true },
      },
    },
  ],
};
export const testEnvironment = "node";
export const moduleFileExtensions = ["js", "ts", "json"];
export const modulePathIgnorePatterns = ["dist/", "<rootDir>/.medusa/"];
export const setupFiles = ["./integration-tests/setup.js"];

if (process.env.TEST_TYPE === "integration:http") {
  module.exports.testMatch = ["**/integration-tests/http/*.spec.[jt]s"];
} else if (process.env.TEST_TYPE === "integration:modules") {
  module.exports.testMatch = ["**/src/modules/*/__tests__/**/*.[jt]s"];
} else if (process.env.TEST_TYPE === "unit") {
  module.exports.testMatch = ["**/src/**/__tests__/**/*.unit.spec.[jt]s"];
}
