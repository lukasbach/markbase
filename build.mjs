#!/usr/bin/env zx

(async () => {
  if (process.platform === 'win32') {
    $.shell = "cmd.exe";
    $.prefix = "";
  }

  await $`npx tsc`;
  await $`npx tsc -p ./tsconfig-client.json`;
  await fs.copy("node_modules/highlight.js/styles", "highlight-styles");
})();