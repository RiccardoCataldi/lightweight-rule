#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const targetDir = path.join(process.cwd(), ".cursor", "rules");
const rulesDir = path.join(__dirname, "..", "rules");
const rules = fs.readdirSync(rulesDir).filter((file) => file.endsWith(".mdc"));

fs.mkdirSync(targetDir, { recursive: true });
for (const rule of rules) {
  fs.copyFileSync(path.join(rulesDir, rule), path.join(targetDir, rule));
}

if (rules.length === 0) {
  console.log("No .mdc rules found in package rules folder.");
} else {
  console.log(`✓ installed ${rules.length} rule(s): ${rules.join(", ")}`);
}
