#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";
import * as path from "path";

interface Options {
  small?: boolean;
  pizzaType: string;
}

let cliVersion: string;
try {
  cliVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf-8" })).version;
} catch (e) {
  cliVersion = "unknown";
}

program
  .version(cliVersion)
  .option("-s, --small", "small pizza size")
  .requiredOption("-p, --pizza-type <type>", "flavour of pizza");

program.parse(process.argv);

const options = program.opts() as Options;

console.log(options);