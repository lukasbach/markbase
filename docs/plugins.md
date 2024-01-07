---
icon: VscPackage 
---

# Plugins

You can write custom plugins to hook into the parsing- and generation process of Markbase.

As an example, see the implementation of the plugin that adds CSS variables based on the Markbase theme configuration:

```typescript
export const styleCustomizationPlugin: Plugin = {
    patchCss: async ({ css, base }) => {
        let patched = css;
        if (base.config.styles) {
            const styles = Object.entries(base.config.styles)
                .map(([key, value]) => `--${key}: ${value};`)
                .join("");
            patched += `:root { ${styles} }`;
        }
        if (base.config.lightStyles) {
            const styles = Object.entries(base.config.lightStyles)
                .map(([key, value]) => `--${key}: ${value};`)
                .join("");
            patched += `.light { ${styles} }`;
        }
        return patched;
    },
};
```

In general, a plugin can use the following hooks to customize the output:

```typescript
export interface Plugin {
  prebuild?: (base: DocumentBase) => Promise<void>;
  postbuild?: (base: DocumentBase) => Promise<void>;
  patchRenderedDocument?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
    content: string;
  }) => Promise<string>;
  patchCss?: (p: { base: DocumentBase; css: string }) => Promise<string>;
  patchFrontmatter?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
  }) => Promise<any>;
  patchDocumentMarkdown?: (p: {
    base: DocumentBase;
    doc: DocumentFile;
  }) => Promise<string>;
  prepareMarked?: (p: {
    base: DocumentBase;
    marked: Marked;
    doc: DocumentFile;
  }) => Promise<void>;
}
```

You can pass a plugin implementation to your markbase configuration, if it is defined as JavaScript file:

```javascript
module.exports = {
  plugins: [myPlugin]
}
```