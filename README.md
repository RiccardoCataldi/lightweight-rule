# lightweight-rule

Installs the Cursor rule `lightweight.mdc` in the current project folder:

```bash
npx lightweight-rule
```

## What it does

Copia `rules/lightweight.mdc` in:

```text
.cursor/rules/lightweight.mdc
```

## Local development

From the repository root:

```bash
node bin/install.js
```

## Publish npm

```bash
npm login
npm publish --access public
```
