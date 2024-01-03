# node/test

Runs various npm scripts that typically exist for verification purposes, such as build, test and lint.


## Usage

```bash
npx @lukasbach/scripts node/test
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/test
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Runs various npm scripts that typically exist for verification purposes, such as build, test and lint. */

await utils.cd(await utils.node.getPackageRoot());
await utils.node.runScript("build --if-present");
await utils.node.runScript("build:ci --if-present");
await utils.node.runScript("lint --if-present");
await utils.node.runScript("lint:ci --if-present");
await utils.node.runScript("lint:test --if-present");
await utils.node.runScript("test --if-present");
await utils.node.runScript("test:ci --if-present");

````

