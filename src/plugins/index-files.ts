import * as fs from "fs-extra";
import path from "path";
import { Plugin } from "../core/plugin";

export const indexFilesPlugin: Plugin = {
  postbuild: async (base) => {
    for (const folder of base.getAllFolders()) {
      const firstFile = base
        .getFolderItems(folder)
        .find((f) => f.type === "document");
      if (firstFile) {
        await fs.writeFile(
          path.join(base.getOutDir(), folder, "index.html"),
          `<meta http-equiv="refresh" content="0; url=${firstFile.fileName}" />`
        );
      }
    }

    if (base.config.rootDocument) {
      const doc = base.documents.find(
        (d) => d.getSlug() === base.config.rootDocument
      );
      // TODO maybe normalize slugs always? Make sure they always start with a slash..
      if (doc) {
        await fs.writeFile(
          path.join(base.getOutDir(), "index.html"),
          `<meta http-equiv="refresh" content="0; url=${doc.getSlug()}" />`
        );
      }
    }
  },
};
