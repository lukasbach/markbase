import { Marked } from "marked";
import { renderToString } from "react-dom/server";
import React from "react";
import { HiLink } from "react-icons/hi2";
import { DocumentFile } from "./document-file";
import { TocEntry } from "./types";

export class DocumentRenderer {
  private toc: TocEntry[] = [];

  constructor(private marked: Marked) {
    this.setupCustomExtensions();
  }

  static async create() {
    const marked = new Marked({
      extensions: [],
    });

    marked.use(
      (await import("marked-base-url")).baseUrl as any,
      (await import("marked-code-format")).default as any,
      // @ts-ignore
      (await import("marked-custom-heading-id")).default as any,
      (await import("marked-footnote")).default as any,
      (await import("marked-linkify-it")).default as any
    );

    return new DocumentRenderer(marked);
  }

  private setupCustomExtensions() {
    this.marked.use({
      renderer: {
        link(
          href: string,
          title: string | null | undefined,
          text: string
        ): string {
          const isLocal = href.startsWith("./") && href.endsWith(".md");
          const patchedHref = isLocal
            ? `../${href.replace(/\.md$/, "")}`
            : href;
          const targetData =
            isLocal || href.startsWith("#")
              ? ""
              : 'target="_blank" rel="noopener"';
          return `<a href="${patchedHref}" ${targetData} title="${title}">${text}</a>`;
        },

        heading: (text, level) => {
          const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
          this.toc.push({ text, level, id: escapedText });

          return `
            <h${level} id="${escapedText}">
              <a class="anchor" href="#${escapedText}">
                ${renderToString(<HiLink />)}
              </a>
              ${text}
            </h${level}>`;
        },
      },
    });
  }

  renderDocument(doc: DocumentFile) {
    return this.marked.parse(doc.rawMarkdown) as string;
  }

  generateToc(doc: DocumentFile) {
    this.toc = [];
    this.marked.parse(this.marked.parse(doc.rawMarkdown) as string);
    return this.toc;
  }

  getMarked() {
    return this.marked;
  }
}
