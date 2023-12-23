import { Command } from "commander";
import * as fs from "fs";
import { createServer } from "http-server";
import path from "path";
import { Server as WebSocketServer } from "ws";
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
  base.config.hotreload ??= true;
  base.setOutDir(options.out);
  await base.build();

  const server = createServer({
    root: options.out ?? base.config.out ?? DEFAULT_OUT_DIR,
  });
  const ws = new WebSocketServer({ server: (server as any).server });

  server.listen(options.port, () => {
    console.log(`Server listening on http://localhost:${options.port}`);
  });

  base.logStats();

  const rebuild = async () => {
    if (Date.now() - lastRebuild < 1000) {
      return;
    }

    lastRebuild = Date.now();
    const base = await DocumentBase.fromPath(basePath);
    base.config.hotreload ??= true;
    base.setOutDir(options.out);
    await base.build();
    console.log("Rebuilt document base.");
    ws.clients.forEach((c) => c.send("update"));
  };

  fs.watch(basePath, rebuild);
  fs.watch(path.join(__dirname, "styles"), rebuild);
});
