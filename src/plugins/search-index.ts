import * as fs from "fs-extra";
import path from "path";
import { Plugin } from "../core/plugin";

export const searchIndexPlugin: Plugin = {
  postbuild: async (base) => {
    const items = base.documents.map((doc) => ({
      title: doc.getDisplayName(),
      path: doc.getSlug(),
    }));
    await fs.writeJson(path.join(base.getOutDir(), "search.json"), items);
  },
};
