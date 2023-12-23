import * as fs from "fs-extra";
import path from "path";
import { Plugin } from "../core/plugin";
import { globAll } from "../core/utils";

export const loadStyleFilesPlugin: Plugin = {
  patchCss: async ({ css }) => {
    const files = await globAll(["styles/**/*.css"], { cwd: __dirname });
    let styles = css;

    for (const file of files) {
      styles += await fs.readFile(path.join(__dirname, file), {
        encoding: "utf-8",
      });
    }

    return styles;
  },
};
