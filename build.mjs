#!/usr/bin/env zx

(async () => {
  if (process.platform === 'win32') {
    $.shell = "cmd.exe";
    $.prefix = "";
  }

  await $`npx tsc`;
  await $`npx tsc -p ./tsconfig-client.json`;
  await fs.copy("node_modules/highlight.js/styles", "highlight-styles");
  await fs.copy("./readme.MD", "./docs/root.md");
  await fs.copy("./demo.png", "./docs/demo.png");

  await $`node ./lib/index.js build ./docs`
  await $`node ./lib/index.js build ./docs -c ./variations/hoisted-headings.yml`
  await $`node ./lib/index.js build ./docs -c ./variations/theming.yml`
  await $`node ./lib/index.js build ./docs -c ./variations/without-sidebar.yml`
})();