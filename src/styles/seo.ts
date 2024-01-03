import { Plugin } from "../core/plugin";

export const seoPlugin: Plugin = {
  patchRenderedDocument: async ({ base, content, doc }) => {
    const seo = [
      base.config.description &&
        `<meta name="description" content="${base.config.description}">`,
      `<meta name="robots" content="index, follow" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${doc.getDisplayName()}" />`,
      base.config.title &&
        `<meta property="og:site_name" content="${base.config.title}" />`,
      `<meta property="og:description" content="${doc.getSummary()}" />`,
      `<meta property="og:image" content="${base.config.relativeUrl}/android-chrome-512x512.png" />`,
      `<meta property="twitter:card" content="summary_large_image" />`,
      `<meta property="twitter:title" content="${doc.getDisplayName()}" />`,
      `<meta property="twitter:description" content="${doc.getSummary()}" />`,
      `<meta property="twitter:image" content="${base.config.relativeUrl}/android-chrome-512x512.png" />`,
      base.config.seo?.twitterHandle &&
        `<meta name="twitter:creator" content="${base.config.seo.twitterHandle}" />`,
    ]
      .filter((a) => !!a)
      .join("");
    return content.replace("</head>", `${seo}</head>`);
  },
};
