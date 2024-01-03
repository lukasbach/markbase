# node/kill-all

Kills all node processes. Only works under windows.


## Usage

```bash
npx @lukasbach/scripts node/kill-all
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/kill-all
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Kills all node processes. Only works under windows. */

await $`taskkill /f /im node.exe`;

````

