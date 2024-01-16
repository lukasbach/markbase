import { Marked } from "marked";
import { renderToString } from "react-dom/server";
import React from "react";
import { HiLink } from "react-icons/hi2";
import { DocumentFile } from "./document-file";
import { TocEntry } from "./types";

export class DocumentRenderer {
  private toc: TocEntry[] = [];

  private doc!: DocumentFile;

  constructor(private marked: Marked) {
    this.setupCustomExtensions();
  }

  static async create() {
    const marked = new Marked({ gfm: true, extensions: [] });

    marked.use(
      (await import("marked-code-format")).default as any,
      // @ts-ignore
      (await import("marked-custom-heading-id")).default as any,
      (await import("marked-footnote")).default as any,
      (await import("marked-linkify-it")).default as any,
    );

    return new DocumentRenderer(marked);
  }

  private setupCustomExtensions() {
    this.marked.use({
      renderer: {
        heading: (text, level) => {
          if (text === "") {
            return "";
          }

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

  /** @internal */
  setDocument(doc: DocumentFile) {
    this.doc = doc;
  }

  renderDocument() {
    return this.marked.parse(this.doc.rawMarkdown) as string;
  }

  generateToc() {
    this.toc = [];
    this.marked.parse(this.marked.parse(this.doc.rawMarkdown) as string);
    return this.toc;
  }

  getMarked() {
    return this.marked;
  }
}
