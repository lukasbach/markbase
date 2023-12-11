import { glob, GlobOptions } from "glob";
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
