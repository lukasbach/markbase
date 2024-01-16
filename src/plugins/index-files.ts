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
        const redirect = path.posix.join(
          base.config.relativeUrl ?? path.posix.sep,
          firstFile.fileName,
        );
        await fs.writeFile(
          path.join(base.getOutDir(), folder, "index.html"),
          `<meta http-equiv="refresh" content="0; url=${redirect}" />`,
        );
      }
    }

    const doc = base.documents.find(
      (d) => d.getSlug() === (base.config.rootDocument ?? "/root"),
    );
    // TODO maybe normalize slugs always? Make sure they always start with a slash..
    if (doc) {
      const redirect = path.posix.join(
        base.config.relativeUrl ?? path.posix.sep,
        doc.getSlug(),
      );
      await fs.writeFile(
        path.join(base.getOutDir(), "index.html"),
        `<meta http-equiv="refresh" content="0; url=${redirect}" />`,
      );
    }
  },
};
