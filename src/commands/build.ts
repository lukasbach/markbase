import { Command, Option } from "commander";
import { DocumentBase } from "../core/document-base";

export interface BuildOptions {
  out?: string;
}

export const buildCommand = new Command("build");

buildCommand.argument("<path>", "Path to the document base");

buildCommand.option("-o, --out <path>", "Path to the output directory");

buildCommand.action(async (basePath, options: BuildOptions) => {
  const base = await DocumentBase.fromPath(basePath);
  await base.build(options.out);
});
