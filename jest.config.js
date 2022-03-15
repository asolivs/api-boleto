module.exports = {
  rootDir: "./",
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!<rootDir>/src/clients/**/*.{ts,js}",
    "!<rootDir>/src/endpoints/**/*.{ts,js}",
  ],
};
