import { glob, GlobOptions } from "glob";

export const globAll = async (patterns: string[], options: GlobOptions) => {
  const results = await Promise.all(patterns.map((p) => glob(p, options)));
  return results.flat() as string[];
};
