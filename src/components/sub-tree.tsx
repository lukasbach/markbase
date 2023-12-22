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
      {base.getFolderSubfolders(treePath).map((item) => {
        const itemSlug = path.join(treePath, item);
        return (
          <li data-folder-item={itemSlug} key={itemSlug}>
            <button>
              <span>{item}</span>
              <HiOutlineChevronRight />
            </button>
            <ul>
              <SubTree base={base} doc={doc} treePath={itemSlug} />
            </ul>
          </li>
        );
      })}
      {base
        .getFolderItems(treePath)
        .filter((item) => item.getSlug() !== "/" && item.getSlug() !== "/index")
        .map((item) => (
          <li
            data-file-item={item.getSlug()}
            className={item.getSlug() === doc.getSlug() ? "active" : ""}
            key={item.getSlug()}
          >
            <a href={item.getSlug()}>
              {item.frontmatter?.icon ? (
                <IconByString iconKey={item.frontmatter?.icon} />
              ) : null}
              <span>{item.getDisplayName()}</span>
            </a>
          </li>
        ))}
    </>
  );
};
