import hljs from "highlight.js";
import * as fs from "fs-extra";
import path from "path";
import { Plugin } from "../core/plugin";

const prefixCssRules = (css: string, prefix: string) => {
  // no clue what this regex does, but thanks copilot
  return css.replaceAll(
    /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
    (match) => `${prefix} ${match}`
  );
};

export const markedHighlightPlugin: Plugin = {
  prepareMarked: async ({ marked }) => {
    marked.use(
      (await import("marked-highlight")).markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      }) as any
    );
  },

  patchCss: async ({ css, base }) => {
    let styles = css;
    const dark = await fs.readFile(
      path.join(
        __dirname,
        "../../highlight-styles",
        `${base.config.syntaxTheme?.dark ?? "atom-one-dark"}.css`
      ),
      "utf-8"
    );
    const light = await fs.readFile(
      path.join(
        __dirname,
        "../../highlight-styles",
        `${base.config.syntaxTheme?.light ?? "atom-one-light"}.css`
      ),
      "utf-8"
    );

    styles += prefixCssRules(dark, ".dark ");
    styles += prefixCssRules(light, ".light ");

    return styles;
  },
};
