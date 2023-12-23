import path from "path";
import * as fs from "fs-extra";
import { renderToString } from "react-dom/server";
import React from "react";
import { DocumentFile } from "./document-file";
import {
  BaseStats,
  DocumentBaseConfiguration,
  FolderConfig,
  FolderItem,
} from "./types";
import { getConfigFileAt, globAll } from "./utils";
import { DocumentComponent } from "../components/document-component";
import { Plugin } from "./plugin";
import { admonitionsPlugin } from "../plugins/admonitions";
import { sitemapPlugin } from "../plugins/sitemap";
import { searchIndexPlugin } from "../plugins/search-index";
import { patchHrefsPlugin } from "../plugins/patch-hrefs";
import { indexFilesPlugin } from "../plugins/index-files";
import { styleCustomizationPlugin } from "../plugins/style-customization";

export const DEFAULT_OUT_DIR = "out";

export class DocumentBase {
  public plugins: Plugin[] = [
    admonitionsPlugin,
    sitemapPlugin,
    searchIndexPlugin,
    patchHrefsPlugin,
    indexFilesPlugin,
    styleCustomizationPlugin,
  ];

  public stats: BaseStats = {
    documents: 0,
    assets: 0,
    characters: 0,
    size: 0,
    words: 0,
  };

  private constructor(
    public readonly documents: DocumentFile[],
    public readonly config: DocumentBaseConfiguration,
    public readonly folderConfigs: Record<string, FolderConfig>
  ) {
    this.calculateStats();
  }

  static async fromPath(basePath: string) {
    const config = await DocumentBase.loadConfig(basePath);
    const folderConfigs: Record<string, FolderConfig> = {};
    const files: DocumentFile[] = [];

    for (const folderConfig of await globAll(
      [
        "**/folder.json",
        "**/folder.yml",
        "**/folder.yaml",
        "**/folder.js",
        "**/folder.mjs",
      ],
      {
        cwd: basePath,
      }
    )) {
      const folder = path.dirname(folderConfig);
      const config = await getConfigFileAt(path.join(basePath, folderConfig));
      folderConfigs[path.sep + folder] = config;
    }

    for (const file of await globAll(config?.documents ?? ["**/*.md"], {
      cwd: basePath,
    })) {
      files.push(
        await DocumentFile.fromPath(path.join(basePath, file), basePath)
      );
    }

    return new DocumentBase(files, config, folderConfigs);
  }

  setOutDir(outDir?: string) {
    this.config.out = outDir ?? this.config.out;
  }

  isDocumentRoot(doc: DocumentFile) {
    return (this.config.rootDocument ?? "/index") === doc.getSlug();
  }

  static async loadConfig(
    basePath: string
  ): Promise<DocumentBaseConfiguration> {
    return getConfigFileAt(path.join(basePath, "config"));
  }

  getFolderConfig(folder: string) {
    return this.folderConfigs[folder];
  }

  getFolderFiles(folder: string) {
    return this.documents
      .filter((d) => d.getFolder() === path.normalize(`${folder}/`))
      .sort((a, b) => {
        if (
          a.frontmatter?.order !== undefined ||
          b.frontmatter?.order !== undefined
        ) {
          return (a.frontmatter?.order ?? 0) - (b.frontmatter?.order ?? 0);
        }

        return a.relativePath.localeCompare(b.relativePath);
      });
  }

  getFolderSubfolders(folder: string) {
    while (folder.endsWith(path.sep)) {
      // eslint-disable-next-line no-param-reassign
      folder = folder.substr(0, folder.length - 1);
    }
    const subfolders = new Set(
      this.documents
        .map((d) => d.getFolder())
        .filter((d) => d.startsWith(folder))
        .map((d) => d.substring(folder.length))
        .filter((d) => d !== "")
        .map((d) => d.split(path.sep)[1])
        .filter((d) => d !== "")
    );
    return [...subfolders];
  }

  getFolderItems(folder: string) {
    const folderConfig = this.getFolderConfig(folder);
    const files = this.getFolderFiles(folder).map((doc) => doc.asFolderItem());
    const subfolders = this.getFolderSubfolders(folder).map<FolderItem>(
      (subFolder) => {
        const subfolderConfig = this.getFolderConfig(
          path.join(folder, subFolder)
        );
        return {
          type: "folder",
          title:
            subfolderConfig?.title ??
            subfolderConfig?.frontmatter?.title ??
            subFolder,
          slug: path.join(folder, subFolder),
          frontmatter: subfolderConfig?.frontmatter,
          folderConfig: subfolderConfig,
          fileName: subFolder,
        };
      }
    );

    return [...subfolders, ...files].sort((a, b) => {
      if (folderConfig?.itemOrder) {
        const itemOrder = folderConfig.itemOrder.map((i) => `${i}`);
        return (
          itemOrder.indexOf(`${a.fileName}`) -
          itemOrder.indexOf(`${b.fileName}`)
        );
      }

      if (
        a.frontmatter?.order !== undefined ||
        b.frontmatter?.order !== undefined
      ) {
        return (a.frontmatter?.order ?? 0) - (b.frontmatter?.order ?? 0);
      }

      if (a.type === "folder" && b.type !== "folder") {
        return -1;
      }
      if (a.type !== "folder" && b.type === "folder") {
        return 1;
      }

      return a.title.localeCompare(b.title);
    });
  }

  getAllFolders() {
    const recurse = (folder: string): string[] => {
      const items = this.getFolderSubfolders(folder);
      return [
        folder,
        ...items.flatMap((item) => recurse(path.join(folder, item))),
      ];
    };

    return recurse(path.sep);
  }

  getOutDir() {
    return this.config.out ?? DEFAULT_OUT_DIR;
  }

  async build() {
    await this.reducePlugins(undefined, (_, plugin) => plugin.prebuild?.(this));

    for (const doc of this.documents) {
      await this.reducePlugins(undefined, (_, plugin) =>
        plugin.prepareMarked?.({
          base: this,
          doc,
          marked: doc.renderer.getMarked(),
        })
      );
    }

    const outPath = this.getOutDir();
    await fs.ensureDir(outPath);

    for (const file of this.documents) {
      const content = renderToString(
        <DocumentComponent base={this} doc={file} />
      );

      let out = path.join(outPath, file.relativePath);
      out = `${out.substr(
        0,
        out.length - path.extname(out).length
      )}/index.html`;

      await fs.ensureDir(path.dirname(out));
      await fs.writeFile(out, content);
    }

    await fs.copy(path.join(__dirname, "../dist-client"), outPath);

    let styles = await fs.readFile(
      path.join(
        __dirname,
        "../themes",
        `${this.config.theme ?? "default"}.css`
      ),
      "utf-8"
    );
    styles = await this.reducePlugins(styles, async (acc, plugin) =>
      plugin.patchCss?.({ base: this, css: acc })
    );
    await fs.writeFile(path.join(outPath, "style.css"), styles);

    await fs.copy(
      path.join(__dirname, "../themes/content.css"),
      path.join(outPath, "content.css")
    );

    await this.reducePlugins(undefined, (_, plugin) =>
      plugin.postbuild?.(this)
    );
  }

  public logStats() {
    // eslint-disable-next-line no-console
    console.log(
      `Found ${this.stats.documents} documents with ${
        this.stats.words
      } words, ${this.stats.characters} characters, ${Math.floor(
        this.stats.size / 1024
      )}KB`
    );
  }

  public async reducePlugins<T>(
    initial: T,
    reducer: (
      acc: T,
      plugin: Plugin
    ) => Promise<T | undefined | void> | undefined | void
  ) {
    let acc = initial;
    for (const plugin of this.plugins) {
      acc = (await reducer(acc, plugin)) ?? acc;
    }
    return acc;
  }

  private calculateStats() {
    this.stats = {
      documents: this.documents.length,
      assets: 0,
      characters: 0,
      size: 0,
      words: 0,
    };
    for (const doc of this.documents) {
      this.stats.characters += doc.rawMarkdown.length;
      this.stats.size += doc.fileSize;
      this.stats.words += doc.rawMarkdown.split(/\s+/).length;
    }
  }
}
