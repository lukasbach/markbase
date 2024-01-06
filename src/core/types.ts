import { DocumentFile } from "./document-file";
import { Plugin } from "./plugin";

export type DocumentBaseConfiguration = {
  title?: string;
  description?: string;
  documents?: string[];
  assets?: string[];
  out?: string;
  relativeUrl?: string;
  rootDocument?: string;
  hoistHeadings?: boolean;
  hoistMarkdownTitles?: boolean;
  headerButtons?: {
    title?: string;
    icon?: string;
    link?: string;
    target?: string;
  }[];
  styles: Record<string, string>;
  lightStyles: Record<string, string>;
  noSidebar?: boolean;
  syntaxTheme?: { light?: string; dark?: string };
  plugins?: Plugin[];

  // any config from https://www.npmjs.com/package/favicons
  favicon?: { source?: string; configuration?: any };

  seo?: { twitterHandle?: string };

  /** @internal */
  basePath: string;
  /** @internal */
  hotreload?: boolean;
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
