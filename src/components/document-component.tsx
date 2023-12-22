import React, { FC } from "react";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { PageContainer } from "./page-container";
import { nestifyTocs } from "../core/utils";
import { TocTree } from "./toc-tree";

export const DocumentComponent: FC<{
  base: DocumentBase;
  doc: DocumentFile;
}> = ({ base, doc }) => {
  return (
    <div>
      <PageContainer
        base={base}
        doc={doc}
        right={
          <>
            <div className="sidebar-header">On this Page</div>
            <TocTree items={nestifyTocs(doc.renderer.generateToc())} />
          </>
        }
      >
        <div
          dangerouslySetInnerHTML={{
            __html: doc.renderer.renderDocument(),
          }}
        />
      </PageContainer>
    </div>
  );
};
