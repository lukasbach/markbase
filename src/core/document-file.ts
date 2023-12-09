import * as fs from "fs-extra";
import grayMatter from "gray-matter";
import path from "path";

export class DocumentFile {
  public readonly rawMarkdown: string;

  public readonly frontmatter: any;

  public readonly excerp: string;

  constructor(
    public readonly fullPath: string,
    public readonly relativePath: string,
    public readonly contents: string
  ) {
    const { data, excerpt, content } = grayMatter(contents, { excerpt: true });
    this.frontmatter = data;
    this.excerp = excerpt!;
    this.rawMarkdown = content;
  }

  static async fromPath(filePath: string, rootPath: string) {
    return new DocumentFile(
      filePath,
      path.relative(rootPath, filePath),
      await fs.readFile(filePath, "utf-8")
    );
  }

  getFolder() {
    return path.normalize(`${path.dirname(this.relativePath)}/`);
  }
}
