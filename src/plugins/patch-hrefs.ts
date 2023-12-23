/* eslint-disable no-param-reassign */
import { Plugin } from "../core/plugin";

/*
function baseUrl(base: any) {
  // extension code here

  base = base.trim().replace(/\/+$/, "/"); // if multiple '/' at the end, just keep one
  const reIsAbsolute = /^[\w+]+:\/\//;
  const isBaseAbsolute = reIsAbsolute.test(base);
  const dummyUrl = "http://__dummy__";
  const dummyBaseUrl = new URL(base, dummyUrl);
  const dummyUrlLength = dummyUrl.length + (base.startsWith("/") ? 0 : 1);

  return {
    walkTokens(token: any) {
      if (!["link", "image"].includes(token.type)) {
        return;
      }

      if (reIsAbsolute.test(token.href)) {
        // the URL is absolute, do not touch it
        return;
      }

      if (token.href.startsWith("#")) {
        // the URL is a local reference
        return;
      }

      if (isBaseAbsolute) {
        try {
          token.href = new URL(token.href, base).href;
        } catch (e) {
          // ignore
        }
      } else {
        // // base is not absolute
        // if (token.href.startsWith("/")) {
        //   // the URL is from root
        //   return;
        // }
        try {
          const temp = new URL(token.href, dummyBaseUrl).href;
          token.href = temp.slice(dummyUrlLength);
        } catch (e) {
          // ignore
        }
      }
    },
  };
} */

export const patchHrefsPlugin: Plugin = {
  prepareMarked: async ({ marked, base }) => {
    marked.use({
      walkTokens: (token) => {
        if (token.type !== "link" && token.type !== "image") {
          return;
        }

        if (token.href === "/") {
          token.href = base.config.rootDocument
            ? `/${base.config.rootDocument}`
            : "/";
          return;
        }
        // TODO maybe just traverse all local references and match them with actual documents/assets
        // TODO and verify that they exist

        if (token.href.endsWith(".md")) {
          token.href = token.href.slice(0, -3);
        }

        if (token.href.startsWith("..")) {
          token.href = `../${token.href}`;
        }

        if (token.href.startsWith("./")) {
          token.href = `../${token.href.slice(2)}`;
        }
      },
    });

    if (base.config.relativeUrl) {
      marked.use(
        (await import("marked-base-url")).baseUrl(
          base.config.relativeUrl
        ) as any
        // TODO URLs from root ("/abc") are ignored, might want to patch as well
        // baseUrl(path.posix.join(base.config.relativeUrl, doc.getSlug()))
      );
    }
  },
};
