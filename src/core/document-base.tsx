import path from "path";
import * as fs from "fs-extra";
import { renderToString } from "react-dom/server";
import React from "react";
import { DocumentFile } from "./document-file";
import { BaseStats, DocumentBaseConfiguration } from "./types";
import { globAll } from "./utils";
import { DocumentRenderer } from "./document-renderer";
import { DocumentComponent } from "../components/document-component";

export const DEFAULT_OUT_DIR = "out";

export class DocumentBase {
  public stats: BaseStats = {
    documents: 0,
    assets: 0,
    characters: 0,
    size: 0,
    words: 0,
  };

  constructor(
    public readonly documents: DocumentFile[],
    public readonly config: DocumentBaseConfiguration,
    public readonly renderer: DocumentRenderer
  ) {
    this.calculateStats();
  }

  static async fromPath(basePath: string) {
    const config = await DocumentBase.loadConfig(basePath);
    const files: DocumentFile[] = [];
    for (const file of await globAll(config?.documents ?? ["**/*.md"], {
      cwd: basePath,
    })) {
      files.push(
        await DocumentFile.fromPath(path.join(basePath, file), basePath)
      );
    }
    return new DocumentBase(files, config, await DocumentRenderer.create());
  }

  static async loadConfig(
    basePath: string
  ): Promise<DocumentBaseConfiguration> {
    if (await fs.pathExists(path.join(basePath, "config.json"))) {
      return import(`file://${path.join(basePath, "config.json")}`);
    }
    if (await fs.pathExists(path.join(basePath, "config.js"))) {
      return (await import(`file://${path.resolve(basePath, "config.js")}`))
        .default.default;
    }
    if (await fs.pathExists(path.join(basePath, "config.mjs"))) {
      return (await import(`file://${path.resolve(basePath, "config.mjs")}`))
        .default.default;
    }
    return {};
  }

  getFolderItems(folder: string) {
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

  async build(outPath: string = this.config.out ?? DEFAULT_OUT_DIR) {
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
    await fs.copy(
      path.join(
        __dirname,
        "../themes",
        `${this.config.theme ?? "default"}.css`
      ),
      path.join(outPath, "style.css")
    );
    await fs.copy(
      path.join(__dirname, "../themes/content.css"),
      path.join(outPath, "content.css")
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
