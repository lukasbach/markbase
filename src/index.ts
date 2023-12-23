#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { buildCommand } from "./commands/build";
import { watchCommand } from "./commands/watch";

const program = new Command();

let cliVersion: string;
try {
  cliVersion = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"), {
      encoding: "utf-8",
    })
  ).version;
} catch (e) {
  cliVersion = "unknown";
}

program.version(cliVersion).addCommand(buildCommand).addCommand(watchCommand);

program.parse();
