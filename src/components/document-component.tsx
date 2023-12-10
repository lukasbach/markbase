import React, { FC } from "react";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { Tree } from "./tree";
import { PageContainer } from "./page-container";

export const DocumentComponent: FC<{
  base: DocumentBase;
  doc: DocumentFile;
}> = ({ base, doc }) => {
  return (
    <div>
      <PageContainer base={base} doc={doc}>
        <p>Slug: {doc.getSlug()}</p>
        <p>Folder: {doc.getFolder()}</p>
        <p>relativePath: {doc.relativePath}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: base.renderer.renderDocument(doc),
          }}
        />
      </PageContainer>
    </div>
  );
};
