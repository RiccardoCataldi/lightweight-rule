# lightweight-rule

Installs rules + skills for Cursor and/or Claude:

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

## Publish

```bash
npm version patch --no-git-tag-version
npm publish --access public
```
