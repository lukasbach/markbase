import { Command } from "commander";
import { DocumentBase } from "../core/document-base";

export interface BuildOptions {
  out?: string;
  config?: string;
}

export const buildCommand = new Command("build");

buildCommand.argument("<path>", "Path to the document base");

buildCommand.option("-o, --out <path>", "Path to the output directory");
buildCommand.option("-c, --config <path>", "Path config file");

buildCommand.action(async (basePath, options: BuildOptions) => {
  const base = await DocumentBase.fromPath(basePath, options.config);
  base.setOutDir(options.out);
  await base.build();
  base.logStats();
});
