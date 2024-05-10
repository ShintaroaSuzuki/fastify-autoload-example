module.exports = {
  globalSetup: "<rootDir>/utils/jest.e2e.setup.ts",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
  moduleFileExtensions: ["js", "ts"],
  rootDir: "src",
  testRegex: ".*\\.e2e\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  reporters: [
    "default",
    [
      "jest-junit",
      { outputDirectory: "coverage", outputName: "junit.e2e.xml" },
    ],
  ],
};
