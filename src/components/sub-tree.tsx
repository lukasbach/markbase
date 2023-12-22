import React, { FC } from "react";
import path from "path";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { IconByString } from "./icon-by-string";

export const SubTree: FC<{
  base: DocumentBase;
  doc: DocumentFile;
  treePath: string;
}> = ({ base, doc, treePath }) => {
  return (
    <>
      {base
        .getFolderItems(treePath)
        .filter((item) => item.slug !== "/" && item.slug !== "/index")
        .map((item) => {
          if (item.type === "folder") {
            return (
              <li data-folder-item={item.slug} key={item.slug}>
                <button>
                  {item.frontmatter?.icon ? (
                    <IconByString iconKey={item.frontmatter?.icon} />
                  ) : null}
                  <span>{item.title}</span>
                  <HiOutlineChevronRight />
                </button>
                <ul>
                  <SubTree base={base} doc={doc} treePath={item.slug} />
                </ul>
              </li>
            );
          }
          return (
            <li
              data-file-item={item.slug}
              className={item.slug === doc.getSlug() ? "active" : ""}
              key={item.slug}
            >
              <a href={item.slug}>
                {item.frontmatter?.icon ? (
                  <IconByString iconKey={item.frontmatter?.icon} />
                ) : null}
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
    </>
  );
};
