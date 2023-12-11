import React, { FC, PropsWithChildren, ReactNode } from "react";
import { HiSearch } from "react-icons/hi";
import { HiLightBulb, HiMoon, HiSun } from "react-icons/hi2";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { Tree } from "./tree";

export const PageContainer: FC<
  PropsWithChildren<{
    base: DocumentBase;
    doc: DocumentFile;
    right?: ReactNode;
  }>
> = ({ children, doc, base, right }) => {
  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href={`${base.config.relativeUrl ?? ""}/style.css`}
        />
        <link
          rel="stylesheet"
          href={`${base.config.relativeUrl ?? ""}/content.css`}
        />
        <title>{doc.getDisplayName()}</title>
      </head>
      <body>
        <div id="main">
          <div className="left">
            <header className="page-header">
              <a href={`${base.config.relativeUrl ?? ""}/`}>
                {base.config.title ?? "Home"}
              </a>
              <button className="color-mode-switch">
                <span className="sun">
                  <HiSun />
                </span>
                <span className="moon">
                  <HiMoon />
                </span>
              </button>
            </header>
            <div className="search-container">
              <button className="search">
                <HiSearch />
                <span className="text">Search...</span>
                <span className="kbd">Ctrl + K</span>
              </button>
            </div>
            <Tree base={base} doc={doc} />
          </div>
          <div className="content">
            <div className="content-inner">{children}</div>{" "}
          </div>
          <div className="right">{right}</div>
        </div>
        <script src={`${base.config.relativeUrl ?? ""}/client.js`} />
      </body>
    </html>
  );
};
