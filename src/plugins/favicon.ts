/* eslint-disable no-param-reassign */
import path from "path";
import * as os from "os";
import { renderToString } from "react-dom/server";
import * as fs from "fs-extra";
import { Plugin } from "../core/plugin";
import { allIcons } from "../components/all-icons";

let faviconResponse: any;

export const faviconPlugin: Plugin = {
  prebuild: async (base) => {
    base.config.favicon ??= {};
    base.config.favicon.source ??= "icon:HiOutlineDocumentText";
    if (base.config.favicon.source.startsWith("icon:")) {
      const tempFile = path.join(os.tmpdir(), "favicon.svg");
      const icon = base.config.favicon.source.replace("icon:", "");
      const svg = renderToString(allIcons[icon]({ size: 32 }));
      await fs.writeFile(tempFile, svg);
      base.config.favicon.source = tempFile;
    }
    const { favicons } = await import("favicons");
    faviconResponse = await favicons(
      base.config.favicon.source,
      base.config.favicon.configuration ?? {}
    );
  },
  postbuild: async (base) => {
    for (const img of faviconResponse.images) {
      await fs.ensureDir(path.dirname(path.join(base.getOutDir(), img.name)));
      await fs.writeFile(path.join(base.getOutDir(), img.name), img.contents);
    }
    for (const file of faviconResponse.files) {
      await fs.ensureDir(path.dirname(path.join(base.getOutDir(), file.name)));
      await fs.writeFile(path.join(base.getOutDir(), file.name), file.contents);
    }
  },
  patchRenderedDocument: async ({ content }) => {
    return content.replace(
      "</head>",
      `${faviconResponse.html.join("")}</head>`
    );
  },
};
