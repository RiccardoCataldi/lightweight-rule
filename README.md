# lightweight-rule

Installs skills for Cursor and/or Claude:

```bash
npx @telesio/lightweight-rule@latest
```

Interactive prompt lets you choose:
- Cursor (local): `./.cursor/...`
- Cursor (global): `~/.cursor/...`
- Claude (local): `./.claude/...`
- Claude (global): `~/.claude/...`

Flags (non-interactive):
- `--cursor-local`
- `--cursor-global`
- `--claude-local`
- `--claude-global` (or `--claude`)
- `--all`

## Flow

```
/setup-skills   (once per repo)
/grill-with-docs  →  /to-spec  →  /to-tickets  →  /implement  →  /code-review
         ↑
    /wayfinder   (only if the work does not fit in one session)
```

`/to-prd` is now `/to-spec`. `/to-issues` is now `/to-tickets`.

## Skills

### Interview

`/grilling` is the interview engine. `/grill-me` and `/grill-with-docs` are the two ways in; other skills call `/grilling` internally.

- **grilling** — Relentless interview primitive: one round of frontier questions at a time until every design branch is settled. Facts are looked up; decisions go to you. Rarely invoked on its own.
- **grill-me** — Run grilling only. No docs. Use with no repo, or when you do not want `CONTEXT.md` / ADRs.
- **grill-with-docs** — Grilling plus domain-modeling. Same interview, and it writes glossary terms and ADRs as decisions land. Default entry point in a working repo.

### Main flow

- **setup-skills** — One-time per-repo setup: issue tracker, triage labels, and where domain docs live.
- **to-spec** — Turn the current conversation into a spec and publish it. No new interview, synthesis only.
- **to-tickets** — Split a spec or plan into tracer-bullet tickets, each declaring what blocks it.
- **implement** — Build from a spec or tickets, test-first at agreed seams, then run code-review and commit.
- **code-review** — Review the diff on two axes: repo standards, and whether it matches the spec.
- **wayfinder** — Map work too big for one session as decision tickets on the tracker. Plans the route; does not build.

### Supporting

- **tdd** — Red-green test-first reference: what to test, where (seams), and which anti-patterns to avoid. Driven by `/implement`.
- **domain-modeling** — Maintain `CONTEXT.md` and ADRs: challenge terms, record decisions. Driven by `/grill-with-docs`.
- **codebase-design** — Vocabulary for deep modules (module, interface, depth, seam, adapter). Reference for `/tdd` and architecture work.
- **improve-codebase-architecture** — Scan for deepening opportunities, open a visual HTML report, then grill the candidate you pick.
- **triage** — Move issues through triage states, verify claims, grill if needed, write agent-ready briefs.
- **handoff** — Compact this conversation into a document another agent can pick up.
- **caveman** — Ultra-compressed replies to cut tokens while staying technically accurate.
- **ponytail** — Lazy senior-dev mode: the smallest change that fully solves the task. From [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail).

## Publish

```bash
npm version patch --no-git-tag-version
npm login
npm whoami
npm publish --access public
```
