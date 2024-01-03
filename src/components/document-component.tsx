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
  const toc = doc.renderer.generateToc();
  return (
    <PageContainer
      base={base}
      doc={doc}
      right={
        <>
          {toc.length > 0 && (
            <>
              <div className="sidebar-header">On this Page</div>
              <TocTree items={nestifyTocs(toc)} />
            </>
          )}
        </>
      }
    >
      <div className="document-header">
        <h1>{doc.getDisplayName()}</h1>
        {doc.frontmatter.description && (
          <p className="document-description">{doc.frontmatter.description}</p>
        )}
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: doc.renderer.renderDocument(),
        }}
      />
    </PageContainer>
  );
};
