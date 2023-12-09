import React, { FC } from "react";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";

export const DocumentComponent: FC<{
  base: DocumentBase;
  doc: DocumentFile;
}> = ({ base, doc }) => {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: base.renderer.renderDocument(doc) }}
      />
    </div>
  );
};
