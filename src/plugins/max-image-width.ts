import { Plugin } from "../core/plugin";

export const maxImageWidthPlugin: Plugin = {
  prepareMarked: async ({ marked }) => {
    marked.use({
      renderer: {
        image: (href, title, text) => {
          return `<img src="${href}" alt="${
            title ?? text
          }" style="max-width: 100%; height: auto;" />`;
        },
      },
    });
  },
};
