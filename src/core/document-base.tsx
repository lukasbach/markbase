import path from "path";
import { parse as parseYaml } from "yaml";
import * as fs from "fs-extra";
import { renderToString } from "react-dom/server";
import React from "react";
import {
  HiOutlineBars3BottomLeft,
  HiOutlineBolt,
  HiOutlineBugAnt,
  HiOutlineCheckCircle,
  HiOutlineCubeTransparent,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFire,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineMegaphone,
  HiOutlinePencil,
  HiOutlineQuestionMarkCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
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
      return fs.readJson(path.join(basePath, "config.json"));
    }
    if (await fs.pathExists(path.join(basePath, "config.js"))) {
      return (await import(`file://${path.resolve(basePath, "config.js")}`))
        .default.default;
    }
    if (await fs.pathExists(path.join(basePath, "config.mjs"))) {
      return (await import(`file://${path.resolve(basePath, "config.mjs")}`))
        .default.default;
    }
    if (await fs.pathExists(path.join(basePath, "config.yml"))) {
      return parseYaml(
        fs.readFileSync(path.join(basePath, "config.yml"), "utf-8")
      );
    }
    if (await fs.pathExists(path.join(basePath, "config.yaml"))) {
      return parseYaml(
        fs.readFileSync(path.join(basePath, "config.yaml"), "utf-8")
      );
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

    await this.buildSearchIndex(outPath);
    await this.buildSitemap(outPath);
    await this.buildAdmonitionsIcons(outPath);
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

  private async buildSearchIndex(outPath: string) {
    const items = this.documents.map((doc) => ({
      title: doc.getDisplayName(),
      path: doc.getSlug(),
    }));
    await fs.writeJson(path.join(outPath, "search.json"), items);
  }

  private async buildSitemap(outPath: string) {
    let content = "";
    for (const doc of this.documents) {
      content += `<url>`;
      content += `<loc>${doc.getSlug()}</loc>`;
      if (doc.lastEdit) {
        content += `<lastmod>${doc.lastEdit.toISOString()}</lastmod>`;
      }
      content += `<changefreq>weekly</changefreq>`;
      content += `</url>`;
    }
    content = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${content}</urlset>`;
    await fs.writeFile(path.join(outPath, "sitemap.xml"), content);
  }

  private async buildAdmonitionsIcons(outPath: string) {
    const map = {
      abstract: [<HiOutlineDocumentText />, "indigo"],
      attention: [<HiOutlineExclamationCircle />, "orange"],
      bug: [<HiOutlineBugAnt />, "red"],
      caution: [<HiOutlineFire />, "red"],
      danger: [<HiOutlineBolt />, "vermilion"],
      error: [<HiOutlineExclamationCircle />, "red"],
      example: [<HiOutlineCubeTransparent />, "indigo"],
      failure: [<HiOutlineXMark />, "red"],
      hint: [<HiOutlineLightBulb />, "lime"],
      info: [<HiOutlineInformationCircle />, "blue"],
      important: [<HiOutlineInformationCircle />, "blue"],
      note: [<HiOutlinePencil />, "indigo"],
      question: [<HiOutlineQuestionMarkCircle />, "blue"],
      quote: [<HiOutlineBars3BottomLeft />, "blue"],
      success: [<HiOutlineCheckCircle />, "green"],
      tip: [<HiOutlineMegaphone />, "turquoise"],
      warning: [<HiOutlineExclamationTriangle />, "orange"],
    } as const;
    let styles = "";
    for (const [key, value] of Object.entries(map)) {
      const icon = renderToString(value[0]);
      styles += `.admonition-${key},.markdown-alert-${key}{--icon:url('data:image/svg+xml;charset=utf-8,${icon}');`;
      styles += `--_fg:var(--${value[1]}-fg);--_bg:var(--${value[1]}-bg);--_border:var(--${value[1]}-border);}`;
    }
    await fs.writeFile(path.join(outPath, "admonition-icons.css"), styles);
  }
}
