import path from "path";
import * as fs from "fs-extra";
import { Plugin } from "../core/plugin";
import { globAll } from "../core/utils";

export const assetsPlugin: Plugin = {
  postbuild: async (base) => {
    for (const file of await globAll(base.config?.assets ?? [], {
      cwd: base.config.basePath,
    })) {
      const from = path.join(base.config.basePath, file);
      const to = path.join(base.getOutDir(), file);

      if (from.startsWith(base.getOutDir())) {
        // eslint-disable-next-line no-continue
        continue;
      }

      await fs.copy(from, to);
    }
  },
};
