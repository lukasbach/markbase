# node/add-js-extensions-in-imports

Replaces all imports in the nodejs package to include .js file extensions. Ignores imports of packages (i.e.
non-relative imports), and imports of non-code files. This is part of the the adoption process for ESM builds.


## Usage

```bash
npx @lukasbach/scripts node/add-js-extensions-in-imports
```

You can call the script directly if you have installed it globally:

```bash
npm i -g @lukasbach/scripts
ldo node/add-js-extensions-in-imports
```

## Options


- `-v`, `--verbose`: Verbose logging

You can also omit options, and will be asked for them interactively.

Add `--yes` to skip all confirmations.

## Script source

```typescript
/**
 * Replaces all imports in the nodejs package to include .js file extensions. Ignores imports of packages (i.e.
 * non-relative imports), and imports of non-code files. This is part of the the adoption process for ESM builds.
 */

const matcher = path.join(await utils.node.getPackageRoot(), "src/**/*.{ts,tsx,js}").replace(/\\/g, "/");
const files = await glob(matcher);

for (const file of files) {
  const content = await fs.readFile(file, "utf-8");
  let count = 0;
  // eslint-disable-next-line @typescript-eslint/no-loop-func
  const newContent = content.replace(/from\s+['"]([^'"]+)['"]/g, (_, importPath) => {
    const ext = path.extname(importPath);

    if (!importPath.startsWith(".") || (ext && ext !== ".ts" && ext !== ".tsx")) {
      return `from "${importPath}"`;
    }

    count++;

    if (ext === ".ts" || ext === ".tsx") {
      return `from "${importPath.slice(0, -ext.length)}.js"`;
    }

    return `from "${importPath}.js"`;
  });
  await fs.writeFile(file, newContent, "utf-8");
  if (count > 0) {
    log.info(`Updated ${file} (${count} replacements)`);
  } else {
    log.verbose(`No changes in file ${file}`);
  }
}

````

