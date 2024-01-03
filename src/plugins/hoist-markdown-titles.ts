/* eslint-disable no-param-reassign */
import { Plugin } from "../core/plugin";

export const hoistMarkdownTitlesPlugin: Plugin = {
  prepareMarked: async ({ marked, base, doc }) => {
    if (!base.config.hoistMarkdownTitles) {
      return;
    }
    if (doc.frontmatter.title) {
      return;
    }

    marked.use({
      walkTokens: (token) => {
        if (token.type !== "heading") {
          return;
        }
        if (token.depth !== 1) {
          return;
        }
        doc.frontmatter.title = token.text;
        token.raw = "";
        token.text = "";
        token.tokens = [];
      },
    });
  },
};
