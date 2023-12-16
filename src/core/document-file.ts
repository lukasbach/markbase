import * as fs from "fs-extra";
import grayMatter from "gray-matter";
import path from "path";
import { tryToGetLastEditDate } from "./utils";

export class DocumentFile {
  public readonly rawMarkdown: string;

  public readonly frontmatter: any;

  public readonly excerp: string;

  constructor(
    public readonly fullPath: string,
    public readonly relativePath: string,
    public readonly contents: string,
    public readonly fileSize: number,
    public readonly lastEdit?: Date
  ) {
    const { data, excerpt, content } = grayMatter(contents, { excerpt: true });
    this.frontmatter = data;
    this.excerp = excerpt!;
    this.rawMarkdown = content;
  }

  static async fromPath(filePath: string, rootPath: string) {
    return new DocumentFile(
      filePath,
      `${path.sep}${path.relative(rootPath, filePath)}`,
      await fs.readFile(filePath, "utf-8"),
      await fs.stat(filePath).then((stats) => stats.size),
      await tryToGetLastEditDate(filePath)
    );
  }

  getFolder() {
    if (path.dirname(this.relativePath) === `.`) {
      return "";
    }
    return path.normalize(`${path.dirname(this.relativePath)}/`);
  }

  getDisplayName() {
    return (
      this.frontmatter.title ??
      path.basename(this.relativePath, path.extname(this.relativePath))
    );
  }

  getSlug() {
    return this.relativePath
      .replaceAll("\\", "/")
      .slice(0, -path.extname(this.relativePath).length);
  }
}
