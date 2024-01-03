# node/yarn-nodemodules

Configures the .yarnrc.yml file to use the node-modules linker, and adds the necessary items to .gitignore.


## Usage

```bash
npx @lukasbach/scripts node/yarn-nodemodules
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/yarn-nodemodules
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Configures the .yarnrc.yml file to use the node-modules linker, and adds the necessary items to .gitignore. */

const packageRoot = await utils.node.getPackageRoot();

const gitignore = `${(await utils.maybeReadTextFile(path.join(packageRoot, ".gitignore"))) ?? ""}
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
node_modules
yarn-error.log\n`;

await fs.remove(path.join(packageRoot, "package-lock.json"));
await fs.writeFile(path.join(packageRoot, ".yarnrc.yml"), "nodeLinker: node-modules\n");
await fs.writeFile(path.join(packageRoot, ".gitignore"), gitignore);
await $({ cwd: packageRoot })`yarn`;

````

