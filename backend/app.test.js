const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("package exposes production scripts", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
  );

  assert.equal(packageJson.scripts.start, "node app.js");
  assert.equal(packageJson.scripts.test, "node --test");
});

test("application entrypoint exists", () => {
  assert.ok(fs.existsSync(path.join(__dirname, "app.js")));
});
