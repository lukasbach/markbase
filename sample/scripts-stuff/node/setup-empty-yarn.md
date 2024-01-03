# node/setup-empty-yarn

Creates a new empty yarn repository.


## Usage

```bash
npx @lukasbach/scripts node/setup-empty-yarn
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/setup-empty-yarn
```

## Options

- `--name`, `-n`: What is the name of the package?
- `--description`, `-d`: What is the description of the package?
- `--topics`: What are the tags of the package (comma seperated)?
- `--author`, `-a`: What is the author of the package?
- `--license`, `-l`: What is the license of the package?
- `--path`: Where do you want to create the project?
- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Referenced scripts

- [`node/yarn-nodemodules`](node/yarn-nodemodules)
- [`node/configure-npm-repo`](node/configure-npm-repo)

## Script source

```typescript
/** Creates a new empty yarn repository. */

const projectPath = await ask.text("path", "Where do you want to create the project?", process.cwd());
await utils.cd(projectPath);
await fs.writeJSON(
  "package.json",
  {
    name: projectPath.replaceAll("\\", "/").split("/").pop(),
    version: "0.0.0",
    private: true,
    scripts: {},
  },
  { spaces: 2 }
);

await utils.runScript("node/yarn-nodemodules");
await utils.runScript("node/configure-npm-repo");
await $`git init`;

````

