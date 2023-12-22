import * as fs from "fs-extra";
import { Plugin } from "../core/plugin";

export const rootDocumentPlugin: Plugin = {
  postbuild: async (base) => {
    const { rootDocument } = base.config;
    if (rootDocument) {
      const doc = base.documents.find((d) => d.getSlug() === rootDocument);
    }
  },
};
