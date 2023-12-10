import React, { FC, PropsWithChildren } from "react";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { Tree } from "./tree";

export const PageContainer: FC<
  PropsWithChildren<{
    base: DocumentBase;
    doc: DocumentFile;
  }>
> = ({ children, doc, base }) => {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href={`${base.config.relativeUrl ?? ""}/style.css`}
        />
        <title>{doc.getDisplayName()}</title>
      </head>
      <body>
        <div id="main">
          <div className="left">
            <Tree base={base} doc={doc} />
          </div>
          <div className="content">
            <div className="content-inner">{children}</div>{" "}
          </div>
          <div className="right">Right</div>
        </div>
        <script src={`${base.config.relativeUrl ?? ""}/client.js`} />
      </body>
    </html>
  );
};
