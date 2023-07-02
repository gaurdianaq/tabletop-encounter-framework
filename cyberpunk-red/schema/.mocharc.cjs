module.exports = {
  extension: ["ts"],
  require: "ts-node/register",
  spec: ["src/**/test/**/*.test.ts"],
  ui: "bdd",
  recursive: true,
  "node-option": ["loader=ts-node/esm"],
};
