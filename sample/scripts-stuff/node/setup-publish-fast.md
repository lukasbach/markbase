# node/setup-publish-fast

Sets up a NPM package release configuration with the package publish-fast.


## Usage

```bash
npx @lukasbach/scripts node/setup-publish-fast
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/setup-publish-fast
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Sets up a NPM package release configuration with the package publish-fast. */

await utils.node.addDevDependency("publish-fast");
await utils.node.amendPackageJson({
  scripts: {
    release: "publish-fast",
  },
  publishConfig: {
    access: "public",
  },
  publish: {
    preScripts: "build,lint:test,test",
    releaseNotesSource: "next-releasenotes.md",
  },
});
await fs.writeFile(path.join(await utils.node.getPackageRoot(), "next-releasenotes.md"), "");

````

