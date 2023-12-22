import * as fs from "fs-extra";
import path from "path";
import { Plugin } from "../core/plugin";

export const sitemapPlugin: Plugin = {
  postbuild: async (base) => {
    let content = "";
    for (const doc of base.documents) {
      content += `<url>`;
      content += `<loc>${doc.getSlug()}</loc>`;
      if (doc.lastEdit) {
        content += `<lastmod>${doc.lastEdit.toISOString()}</lastmod>`;
      }
      content += `<changefreq>weekly</changefreq>`;
      content += `</url>`;
    }
    content = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
    await fs.writeFile(path.join(base.getOutDir(), "sitemap.xml"), content);
  },
};
