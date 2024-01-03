import React, { FC } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { IconByString } from "./icon-by-string";

export const SubTree: FC<{
  base: DocumentBase;
  doc: DocumentFile;
  treePath: string;
  hoist: boolean;
}> = ({ base, doc, treePath, hoist }) => {
  return (
    <>
      {base
        .getFolderItems(treePath)
        .filter((item) => item.slug !== "/" && item.slug !== "/index")
        .map((item) => {
          if (item.type === "folder") {
            const Comp = hoist ? "div" : "button";
            return (
              <li data-folder-item={item.slug} key={item.slug}>
                <Comp className={hoist ? "hoisted-heading" : ""}>
                  {item.frontmatter?.icon ? (
                    <IconByString iconKey={item.frontmatter?.icon} />
                  ) : null}
                  <span>{item.title}</span>
                  {!hoist && <HiOutlineChevronRight />}
                </Comp>
                <ul>
                  <SubTree
                    base={base}
                    doc={doc}
                    treePath={item.slug}
                    hoist={false}
                  />
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
                <span>{item.doc.getSidebarDisplayName()}</span>
              </a>
            </li>
          );
        })}
    </>
  );
};
