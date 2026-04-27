#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rulesDir = path.join(__dirname, "..", "rules");
const skillsDir = path.join(__dirname, "..", "skills");
const targetRulesDir = path.join(process.cwd(), ".cursor", "rules");
const targetSkillsDir = path.join(process.cwd(), ".cursor", "skills");
const rules = fs.readdirSync(rulesDir).filter((file) => file.endsWith(".mdc"));
const skills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
  .map((entry) => entry.name);

fs.mkdirSync(targetRulesDir, { recursive: true });
for (const rule of rules) {
  fs.copyFileSync(path.join(rulesDir, rule), path.join(targetRulesDir, rule));
}

fs.mkdirSync(targetSkillsDir, { recursive: true });
for (const skill of skills) {
  fs.cpSync(path.join(skillsDir, skill), path.join(targetSkillsDir, skill), { recursive: true });
}

if (rules.length === 0) {
  console.log("No .mdc rules found in package rules folder.");
} else {
  console.log(`\ninstalled ${rules.length} rule(s): ${rules.join(", ")}`);
}

if (skills.length === 0) {
  console.log("No skills found in package skills folder.");
} else {
  console.log(`\ninstalled ${skills.length} skill(s): ${skills.join(", ")}`);
}
