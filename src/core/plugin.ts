import { Marked } from "marked";
import { DocumentBase } from "./document-base";
import { DocumentFile } from "./document-file";

export interface Plugin {
  prebuild?: (base: DocumentBase) => Promise<void>;
  postbuild?: (base: DocumentBase) => Promise<void>;
  patchRenderedDocument?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
    content: string;
  }) => Promise<string>;
  patchCss?: (p: { base: DocumentBase; css: string }) => Promise<string>;
  patchFrontmatter?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
  }) => Promise<any>;
  patchDocumentMarkdown?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
  }) => Promise<string>;
  prepareMarked?: (p: { base: DocumentBase; marked: Marked }) => Promise<void>;
}
