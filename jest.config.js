/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...require("ts-jest").createDefaultPreset().transform,
  },
};