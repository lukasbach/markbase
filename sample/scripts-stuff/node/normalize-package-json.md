# node/normalize-package-json

Normalizes a package.json file and reorderes its properties in a way that is typical.


## Usage

```bash
npx @lukasbach/scripts node/normalize-package-json
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/normalize-package-json
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Normalizes a package.json file and reorderes its properties in a way that is typical. */

await utils.cd(await utils.node.getPackageRoot());

const {
  name,
  type,
  version,
  private: privat,
  publishConfig,
  description,
  tags,
  author,
  license,
  repository,
  bin,
  main,
  exports,
  typings,
  scripts,
  files,
  dependencies,
  devDependencies,
  peerDependencies,
  engines,
  eslintConfig,
  publish,
  packageManager,
  volta,
  ...rest
} = await utils.node.getPackageJson();

await fs.writeJSON(
  "package.json",
  {
    name,
    type,
    version,
    private: privat,
    publishConfig,
    description,
    tags,
    author,
    license,
    repository,
    bin,
    main,
    exports,
    typings,
    scripts,
    files,
    dependencies,
    devDependencies,
    peerDependencies,
    engines,
    eslintConfig,
    publish,
    packageManager,
    volta,
    ...rest,
  },
  { spaces: 2 }
);

````

