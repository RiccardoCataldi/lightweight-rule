#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "rules", "lightweight.mdc");
const targetDir = path.join(process.cwd(), ".cursor", "rules");
const target = path.join(targetDir, "lightweight.mdc");

fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);

console.log("✓ lightweight rule installed in .cursor/rules/lightweight.mdc");
