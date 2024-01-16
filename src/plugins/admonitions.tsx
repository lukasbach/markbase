import {
  HiOutlineBars3BottomLeft,
  HiOutlineBolt,
  HiOutlineBugAnt,
  HiOutlineCheckCircle,
  HiOutlineCubeTransparent,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineFire,
  HiOutlineInformationCircle,
  HiOutlineLightBulb,
  HiOutlineMegaphone,
  HiOutlinePencil,
  HiOutlineQuestionMarkCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import { renderToString } from "react-dom/server";
import React from "react";
import { Plugin } from "../core/plugin";

export const admonitionsPlugin: Plugin = {
  patchCss: async ({ css }) => {
    const map = {
      abstract: [<HiOutlineDocumentText />, "indigo"],
      attention: [<HiOutlineExclamationCircle />, "orange"],
      bug: [<HiOutlineBugAnt />, "red"],
      caution: [<HiOutlineFire />, "red"],
      danger: [<HiOutlineBolt />, "vermilion"],
      error: [<HiOutlineExclamationCircle />, "red"],
      example: [<HiOutlineCubeTransparent />, "indigo"],
      failure: [<HiOutlineXMark />, "red"],
      hint: [<HiOutlineLightBulb />, "lime"],
      info: [<HiOutlineInformationCircle />, "blue"],
      important: [<HiOutlineInformationCircle />, "blue"],
      note: [<HiOutlinePencil />, "indigo"],
      question: [<HiOutlineQuestionMarkCircle />, "blue"],
      quote: [<HiOutlineBars3BottomLeft />, "blue"],
      success: [<HiOutlineCheckCircle />, "green"],
      tip: [<HiOutlineMegaphone />, "turquoise"],
      warning: [<HiOutlineExclamationTriangle />, "orange"],
    } as const;
    let styles = "";
    for (const [key, value] of Object.entries(map)) {
      const icon = renderToString(value[0]);
      styles += `.admonition-${key},.markdown-alert-${key}{--icon:url('data:image/svg+xml;charset=utf-8,${icon}');`;
      styles += `--_fg:var(--${value[1]}-fg);--_bg:var(--${value[1]}-bg);--_border:var(--${value[1]}-border);}`;
    }
    return css + styles;
  },

  prepareMarked: async ({ marked }) => {
    marked.use(
      (await import("marked-admonition-extension")).default as any,
      (await import("marked-alert")).default() as any,
    );
  },
};
