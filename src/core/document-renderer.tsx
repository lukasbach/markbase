import { Marked } from "marked";
import { DocumentFile } from "./document-file";

export class DocumentRenderer {
  constructor(private marked: Marked) {}

  static async create() {
    const marked = new Marked({
      extensions: [],
    });

    marked.use(
      (await import("marked-admonition-extension")).default as any,
      (await import("marked-alert")).default() as any,
      (await import("marked-base-url")).baseUrl as any,
      (await import("marked-code-format")).default as any,
      (await import("marked-custom-heading-id")).default as any,
      (await import("marked-footnote")).default as any,
      (await import("marked-linkify-it")).default as any
    );

    return new DocumentRenderer(marked);
  }

  renderDocument(doc: DocumentFile) {
    return this.marked.parse(doc.rawMarkdown) as string;
  }
}
