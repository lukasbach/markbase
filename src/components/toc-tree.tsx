import React, { FC } from "react";
import { TocEntry } from "../core/types";

export const TocSubTree: FC<{ items: TocEntry[] }> = ({ items }) => {
  return items.map((item) => (
    <li key={item.id}>
      <a href={`#${item.id}`}>
        <span>{item.text}</span>
      </a>
      {item.children?.length && (
        <ul>
          <TocSubTree items={item.children} />
        </ul>
      )}
    </li>
  ));
};
export const TocTree: FC<{ items: TocEntry[] }> = ({ items }) => {
  return (
    <ul className="tree">
      <TocSubTree items={items} />
    </ul>
  );
};
