import { Plugin } from "../core/plugin";

export const styleCustomizationPlugin: Plugin = {
  patchCss: async ({ css, base }) => {
    let patched = css;
    if (base.config.styles) {
      const styles = Object.entries(base.config.styles)
        .map(([key, value]) => `--${key}: ${value};`)
        .join("");
      patched += `:root { ${styles} }`;
    }
    if (base.config.lightStyles) {
      const styles = Object.entries(base.config.lightStyles)
        .map(([key, value]) => `--${key}: ${value};`)
        .join("");
      patched += `.light { ${styles} }`;
    }
    return patched;
  },
};
