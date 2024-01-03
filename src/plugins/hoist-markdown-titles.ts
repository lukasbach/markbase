/* eslint-disable no-param-reassign */
import { Plugin } from "../core/plugin";

export const hoistMarkdownTitlesPlugin: Plugin = {
  prepareMarked: async ({ marked, base, doc }) => {
    if (base.config.hoistMarkdownTitles === false) {
      return;
    }
    if (doc.frontmatter.title) {
      return;
    }

    let hasMatched = false;

    marked.use({
      hooks: {
        postprocess: (md) => md,
        preprocess: (md) => {
          hasMatched = false;
          return md;
        },
      },
      walkTokens: (token) => {
        if (token.type !== "heading") {
          return;
        }
        if (token.depth !== 1) {
          return;
        }
        if (hasMatched) {
          return;
        }
        doc.frontmatter.title = token.text;
        token.raw = "";
        token.text = "";
        token.tokens = [];
        hasMatched = true;
      },
    });
  },
};
