import { Command, Option } from "commander";

interface Options {
  flag?: boolean;
  str?: string;
  number2?: number;
}

export const sampleCommand = new Command("sample");

sampleCommand.argument("<name>", "Name of the sample");

sampleCommand.option("-f, --flag", "Flag");
sampleCommand.option("-s, --str <string>", "String");
sampleCommand.addOption(
  new Option("--number <number>").argParser((v) => parseInt(v, 10))
);

sampleCommand.action((name, options: Options) => {});
