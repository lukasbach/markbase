import path from "path";
import * as fs from "fs-extra";
import { renderToString } from "react-dom/server";
import React from "react";
import { DocumentFile } from "./document-file";
import { DocumentBaseConfiguration } from "./types";
import { globAll } from "./utils";
import { DocumentRenderer } from "./document-renderer";
import { DocumentComponent } from "../components/document-component";

export class DocumentBase {
  constructor(
    private documents: DocumentFile[],
    public readonly config: DocumentBaseConfiguration,
    public readonly renderer: DocumentRenderer
  ) {}

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
    const subfolders = new Set<string>(
      this.documents
        .filter((d) => d.getFolder().startsWith(path.normalize(`${folder}`)))
        .map((d) => d.getFolder().split(path.sep)[1])
    );
    return [...subfolders];
  }

  async build(outPath: string = this.config.out ?? "out") {
    await fs.ensureDir(outPath);

    for (const file of this.documents) {
      const content = renderToString(
        <DocumentComponent base={this} doc={file} />
      );

      let out = path.join(outPath, file.relativePath);
      out = `${out.substr(0, out.length - path.extname(out).length)}.html`;

      await fs.ensureDir(path.dirname(out));
      await fs.writeFile(out, content);
    }
  }
}