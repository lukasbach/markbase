import React, { FC } from "react";
import path from "path";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { SubTree } from "./sub-tree";

export const Tree: FC<{
  base: DocumentBase;
  doc: DocumentFile;
}> = ({ base, doc }) => {
  return (
    <ul className="tree">
      <SubTree doc={doc} base={base} treePath={path.sep} />
    </ul>
  );
};
