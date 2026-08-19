#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const skillsDir = path.join(__dirname, "..", "skills");
const skills = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
  .map((entry) => entry.name);

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    cursorLocal: args.has("--cursor-local"),
    cursorGlobal: args.has("--cursor-global"),
    claudeLocal: args.has("--claude-local"),
    claudeGlobal: args.has("--claude-global") || args.has("--claude"),
    all: args.has("--all"),
    yes: args.has("--yes") || args.has("-y"),
    help: args.has("--help") || args.has("-h"),
  };
}

function printHelp() {
  console.log(
    [
      "Usage: npx @telesio/lightweight-rule@latest [options]",
      "",
      "Options:",
      "  --cursor-local    Install into ./.cursor/skills (repo-local)",
      "  --cursor-global   Install into ~/.cursor/skills (global)",
      "  --claude-local    Install into ./.claude/skills (repo-local)",
      "  --claude-global   Install into ~/.claude/skills (global)",
      "  --claude          Alias for --claude-global",
      "  --all             Same as --cursor-local --cursor-global --claude-local --claude-global",
      "  -y, --yes     Non-interactive (defaults to --cursor-local)",
      "  -h, --help    Show help",
      "",
      "Interactive mode (default): choose targets via multi-select.",
    ].join("\n"),
  );
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer || "").trim());
    }),
  );
}

async function chooseTargets(args) {
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.all) return { cursorLocal: true, cursorGlobal: true, claudeLocal: true, claudeGlobal: true };
  if (args.cursorLocal || args.cursorGlobal || args.claudeLocal || args.claudeGlobal) {
    return {
      cursorLocal: args.cursorLocal,
      cursorGlobal: args.cursorGlobal,
      claudeLocal: args.claudeLocal,
      claudeGlobal: args.claudeGlobal,
    };
  }
  if (args.yes) return { cursorLocal: true, cursorGlobal: false, claudeLocal: false, claudeGlobal: false };

  if (!process.stdin.isTTY)
    return { cursorLocal: true, cursorGlobal: false, claudeLocal: false, claudeGlobal: false };

  console.log("Install targets:");
  console.log("  1) Cursor (local)  (./.cursor/skills)");
  console.log("  2) Cursor (global) (~/.cursor/skills)");
  console.log("  3) Claude (local)  (./.claude/skills)");
  console.log("  4) Claude (global) (~/.claude/skills)");
  console.log("");

  const answer = (await ask("Select (comma-separated, e.g. 1,2). Default: 1 > ")) || "1";
  const tokens = answer
    .split(/[,\s]+/g)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  let cursorLocal = false;
  let cursorGlobal = false;
  let claudeLocal = false;
  let claudeGlobal = false;
  for (const t of tokens) {
    if (t === "1" || t === "cursor-local") cursorLocal = true;
    else if (t === "2" || t === "cursor-global") cursorGlobal = true;
    else if (t === "3" || t === "claude-local") claudeLocal = true;
    else if (t === "4" || t === "claude-global" || t === "claude") claudeGlobal = true;
  }

  if (!cursorLocal && !cursorGlobal && !claudeLocal && !claudeGlobal) {
    console.log("No valid selection. Defaulting to Cursor (local).");
    return { cursorLocal: true, cursorGlobal: false, claudeLocal: false, claudeGlobal: false };
  }

  return { cursorLocal, cursorGlobal, claudeLocal, claudeGlobal };
}

function installSkills(targetSkillsDir) {
  fs.mkdirSync(targetSkillsDir, { recursive: true });
  for (const skill of skills) {
    fs.cpSync(path.join(skillsDir, skill), path.join(targetSkillsDir, skill), { recursive: true });
  }
}

function logInstalled(label, dest) {
  if (skills.length === 0) console.log("No skills found in package skills folder.");
  else console.log(`\ninstalled ${skills.length} ${label} skill(s): ${skills.join(", ")}`);
  if (dest) console.log(`to ${dest}`);
}

(async () => {
  const args = parseArgs(process.argv);
  const targets = await chooseTargets(args);

  if (targets.cursorLocal) installSkills(path.join(process.cwd(), ".cursor", "skills"));
  if (targets.cursorGlobal) installSkills(path.join(os.homedir(), ".cursor", "skills"));
  if (targets.claudeLocal) installSkills(path.join(process.cwd(), ".claude", "skills"));
  if (targets.claudeGlobal) installSkills(path.join(os.homedir(), ".claude", "skills"));

  const didSomething = targets.cursorLocal || targets.cursorGlobal || targets.claudeLocal || targets.claudeGlobal;
  if (!didSomething) {
    console.log("Nothing selected. Exiting.");
    process.exit(0);
  }

  if (targets.cursorLocal) logInstalled("Cursor (local)");
  if (targets.cursorGlobal) logInstalled("Cursor (global)", path.join(os.homedir(), ".cursor", "skills"));
  if (targets.claudeLocal) logInstalled("Claude (local)", path.join(process.cwd(), ".claude", "skills"));
  if (targets.claudeGlobal) logInstalled("Claude (global)", path.join(os.homedir(), ".claude", "skills"));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
