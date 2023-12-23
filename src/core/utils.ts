import { glob, GlobOptions } from "glob";
import { exec } from "child_process";
import * as fs from "fs-extra";
import path from "path";
import { parse as parseYaml } from "yaml";
import { TocEntry } from "./types";

export const globAll = async (patterns: string[], options: GlobOptions) => {
  const results = await Promise.all(patterns.map((p) => glob(p, options)));
  return results.flat() as string[];
};

export const nestifyTocs = (tocs: TocEntry[]) => {
  const root: TocEntry[] = [];
  const stack: TocEntry[] = [];
  tocs.forEach((toc) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= toc.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      root.push(toc);
    } else {
      const current = stack[stack.length - 1];
      current.children ??= [];
      current.children.push(toc);
    }
    stack.push(toc);
  });
  return root;
};

export const tryToGetLastEditDate = async (file: string) => {
  try {
    let stdout = "";
    const result = await exec(
      `git log -1 --pretty="format:%ci" --format=%cI ${file}`
    );
    result.stdout?.on("data", (data) => {
      stdout += data;
    });
    await new Promise((resolve) => {
      result.stdout?.on("close", resolve);
    });
    const date = new Date(stdout.trim());
    date.toISOString();
    return Number.isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
};

export const getConfigFileAt = async (configFile: string) => {
  const file = path.join(
    path.dirname(configFile),
    path.basename(configFile, path.extname(configFile))
  );
  if (await fs.pathExists(`${file}.json`)) {
    return fs.readJson(`${file}.json`);
  }
  if (await fs.pathExists(`${file}.js`)) {
    return (await import(`${file}.js`)).default.default;
  }
  if (await fs.pathExists(`${file}.mjs`)) {
    return (await import(`file://${file}.mjs`)).default.default;
  }
  if (await fs.pathExists(`${file}.yml`)) {
    return parseYaml(fs.readFileSync(`${file}.yml`, "utf-8"));
  }
  if (await fs.pathExists(`${file}.yaml`)) {
    return parseYaml(fs.readFileSync(`${file}.yaml`, "utf-8"));
  }
  return {};
};
