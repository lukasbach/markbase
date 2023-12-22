import { Plugin } from "../core/plugin";

export const indexFilesPlugin: Plugin = {
  postbuild: async (base) => {
    base.getFolderFiles();
  },
};
