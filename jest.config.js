module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  clearMocks: true,
  testMatch: ["<rootDir>/test/**/*.test.ts?(x)"],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // collectCoverage: true,
  // collectCoverageFrom: ["test/**/*.test.ts"]
};