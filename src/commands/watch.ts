import { Command, Option } from "commander";
import * as fs from "fs";
import { DocumentBase } from "../core/document-base";

export interface BuildOptions {
  out?: string;
}

export const watchCommand = new Command("watch");

watchCommand.argument("<path>", "Path to the document base");

watchCommand.option("-o, --out <path>", "Path to the output directory");

let lastRebuild = Date.now();

watchCommand.action(async (basePath, options: BuildOptions) => {
  fs.watch(basePath, async () => {
    if (Date.now() - lastRebuild < 1000) {
      return;
    }

    lastRebuild = Date.now();
    const base = await DocumentBase.fromPath(basePath);
    await base.build(options.out);
    console.log("Rebuilt document base.");
  });
});
