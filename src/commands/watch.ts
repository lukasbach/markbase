import { Command, Option } from "commander";
import * as fs from "fs";
import { createServer } from "http-server";
import { DEFAULT_OUT_DIR, DocumentBase } from "../core/document-base";

export interface BuildOptions {
  out?: string;
  port: string;
}

export const watchCommand = new Command("watch");

watchCommand.argument("<path>", "Path to the document base");

watchCommand.option("-o, --out <path>", "Path to the output directory");
watchCommand.option("-p, --port <port>", "Server port", "3030");

let lastRebuild = Date.now();

watchCommand.action(async (basePath, options: BuildOptions) => {
  const base = await DocumentBase.fromPath(basePath);
  await base.build(options.out);

  fs.watch(basePath, async () => {
    if (Date.now() - lastRebuild < 1000) {
      return;
    }

    lastRebuild = Date.now();
    const base = await DocumentBase.fromPath(basePath);
    await base.build(options.out);
    console.log("Rebuilt document base.");
  });

  const server = createServer({
    root: options.out ?? base.config.out ?? DEFAULT_OUT_DIR,
  });

  server.listen(options.port, () => {
    console.log(`Server listening on http://localhost:${options.port}`);
  });

  base.logStats();
});
