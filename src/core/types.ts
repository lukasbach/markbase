import { DocumentFile } from "./document-file";

export type DocumentBaseConfiguration = {
  title?: string;
  documents?: string[];
  assets?: string[];
  out?: string;
  relativeUrl?: string;
  theme?: string;
  rootDocument?: string;
  hoistHeadings?: boolean;
  headerButtons?: {
    title?: string;
    icon?: string;
    link?: string;
    target?: string;
  }[];
  styles: Record<string, string>;
  lightStyles: Record<string, string>;
};

export type TocEntry = {
  text: string;
  level: number;
  id: string;
  children?: TocEntry[];
};

export type BaseStats = {
  documents: number;
  assets: number;
  size: number;
  words: number;
  characters: number;
};

export type FolderConfig = {
  title?: string;
  itemOrder?: string[];
  order?: number;
  frontmatter?: any;
};

export type FolderItem = {
  title: string;
  slug: string;
  frontmatter?: any;
  fileName: string;
} & (
  | {
      type: "folder";
      folderConfig?: FolderConfig;
    }
  | {
      type: "document";
      doc: DocumentFile;
    }
);
