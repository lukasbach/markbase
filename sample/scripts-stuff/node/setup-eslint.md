# node/setup-eslint

Adds my personal ESLint config with @lukasbach/eslint-config-deps to the package setup.


## Usage

```bash
npx @lukasbach/scripts node/setup-eslint
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/setup-eslint
```

## Options

- `--rule`: Which rules to use?
- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/** Adds my personal ESLint config with @lukasbach/eslint-config-deps to the package setup. */

const ruleSet = await ask.choice("rule", "Which rules to use?", ["@lukasbach/base", "@lukasbach/base/react"]);

await utils.node.addDevDependency("eslint @lukasbach/eslint-config-deps");
await utils.node.amendPackageJson({
  scripts: {
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
  },
  eslintConfig: {
    extends: ruleSet,
    parserOptions: {
      project: "./tsconfig.json",
    },
    ignorePatterns: ["lib", "*.js"],
  },
});

````

