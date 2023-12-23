import React, { FC, PropsWithChildren, ReactNode } from "react";
import { HiMenu, HiSearch } from "react-icons/hi";
import { HiBars3CenterLeft, HiMoon, HiSun } from "react-icons/hi2";
import { DocumentBase } from "../core/document-base";
import { DocumentFile } from "../core/document-file";
import { Tree } from "./tree";
import { IconByString } from "./icon-by-string";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `window.relativeUrl = "${base.config.relativeUrl ?? ""}"`,
          }}
        />
      </head>
      <body>
        <div className="mobile-header">
          <button id="open-left-bar" aria-label="Open Menu">
            <HiMenu />
          </button>
          <div>
            <a href={`${base.config.relativeUrl ?? ""}/`}>
              {base.config.title ?? "Home"}
            </a>
          </div>
          <button id="open-right-bar" aria-label="Open Table of Contents">
            <HiBars3CenterLeft />
          </button>
        </div>
        <div id="main">
          <div className="left">
            <header className="page-header">
              <div className="page-header-title">
                <a href={`${base.config.relativeUrl ?? ""}/`}>
                  {base.config.title ?? "Home"}
                </a>
              </div>
              <button className="color-mode-switch header-btn">
                <span className="sun">
                  <HiSun />
                </span>
                <span className="moon">
                  <HiMoon />
                </span>
              </button>
              {base.config.headerButtons?.map((btn) => (
                <a
                  key={btn.link}
                  href={btn.link}
                  target={btn.target}
                  className="header-btn"
                  title={btn.title}
                >
                  {btn.icon && <IconByString iconKey={btn.icon} />}
                </a>
              ))}
            </header>
            <div className="search-container">
              <button className="search-button">
                <HiSearch />
                <span className="text">Search...</span>
                <span className="kbd">Ctrl + K</span>
              </button>
            </div>
            <Tree base={base} doc={doc} />
          </div>
          <div className="content">
            <div className="content-inner">{children}</div>
            <div className="right">
              <div className="right-inner">{right}</div>
            </div>
          </div>
        </div>
        <dialog id="search-dialog">
          <input id="search-input" type="text" placeholder="Search..." />
          <div id="search-results" />
        </dialog>
        <script src={`${base.config.relativeUrl ?? ""}/client.js`} />
      </body>
    </html>
  );
};
