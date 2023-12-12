export type DocumentBaseConfiguration = {
  title?: string;
  documents?: string[];
  assets?: string[];
  out?: string;
  relativeUrl?: string;
  theme?: string;
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
