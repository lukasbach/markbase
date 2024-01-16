import path from "path";
import { Plugin } from "../core/plugin";

export const obsidianLinksPlugin: Plugin = {
  prepareMarked: async ({ marked, base }) => {
    marked.use({
      extensions: [
        {
          name: "obsidian-href",
          level: "inline",
          tokenizer: (src) => {
            if (!/\[\[[a-zA-Z0-9\s]+\]\]/.test(src)) {
              return undefined;
            }
            const match = src.match(/\[\[([a-zA-Z0-9\s]+)\]\]/);

            if (!match) {
              return undefined;
            }

            const matchedDocument = match[1];
            const document = base.documents.find(
              (doc) => doc.getFileName() === matchedDocument,
            );

            if (!document) {
              return undefined;
            }

            const linkToken = {
              type: "link",
              raw: src,
              text: document.getDisplayName(),
              href: path.posix.join(
                base.config.relativeUrl ?? "",
                document.getSlug(),
              ),
              tokens: [
                {
                  type: "text",
                  raw: document.getDisplayName(),
                  text: document.getDisplayName(),
                },
              ],
            };
            return linkToken;
          },
        },
      ],
    });
  },
};
