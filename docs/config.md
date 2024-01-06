# Configurability

You can configure how markbase generates your site by creating a configuration file `config.yml` at the root of your
document folder:

```yaml
title: My Website
description: This is my website
documents: ["**/*.md"]
assets: ["**/*.png", "**/*.jpg"]
out: ./dist
relativeUrl: /my-website
```

You can generally leave out most of these options, as they have sensible defaults. If you just want to use defaults,
you can also leave out the entire config file.

## Using a different configuration file

You can also use a different configuration file by passing the `--config` option to markbase:

```bash
markbase build folder/to/my/markdown/files --config ./my-config.yml
```


## Using other config formats

You can use any of the following file extensions for your config file:

- `.yml`
- `.yaml`
- `.json`
- `.js`
- `.mjs`

Js and Mjs extensions are useful if you want to use custom plugins, in which case specifying the config as a js file
is necessary.

# Options

## `title`

The title of your website. This will be used in the `<title>` tag of your website and in the navigation bar.

## `description`

The description of your website. This will be used in SEO data.

## `documents`

A list of glob patterns that match all documents that should be included in your website. The default is `["**/*.md"]`.

## `assets`

A list of glob patterns that match all assets that should be copied along into your target.

## `out`

The output directory for your website. The default is `./out`.

## `relativeUrl`

The relative url of your website. The default is `/`.

## `rootDocument`

The document that should be used as the root document. The index route will redirect to this document, and all links
pointing to `/` will be rewritten to point to this document. The default is `root.md`.

## `hoistHeadings`

In the sidebar, the top-level headings will be shown as expanded sections. As example, you can see this documentation
generated with this setting set to true here TODO

## `hoistMarkdownTitles`

If enabled, the top-most first-level markdown title will be used as the title of the document, if not explicitly set
in the document frontmatter otherwise. The default is `true`.

## `headerButtons`

A list of buttons that should be shown in the header. Example:

```yaml
headerButtons:
  - title: "GitHub"
    link: "https://github.com/lukasbach/markbase"
    icon: "github"
```

See [this page on icons](./icons.md) for details on how icons work.

## `styles`

A list of style variables that can be used to overwrite theme information.

Example:

```yaml
styles:
    bg: "#0a0a0a"
    bg-dim: "#0f0f10"
    bg-highlighted: "#171717"
    fg-highlighted: "#ffffff"
    fg: "#adadad"
    fg-muted: "#919191"
    primary: "#307ee5"
    fg-on-primary: "#ffffff"
    sidebar-margin: "1rem"
    border: "rgba(255, 255, 255, 0.1)"
    mobile-header-height: 0
    left-width: 320px
    right-width: 240px
    font: Inter
    red-bg: "#AC2F3322"
    red-border: "#AC2F33"
    red-fg: "#FA999C"
```

## `lightStyles`

Similar to `styles`, but for light mode. If not set, the light mode will use the same styles as the dark mode.

Example:

```yaml
styles:
  primary: steelblue
lightStyles:
  primary: blue
```

## `noSidebar`

Hide the sidebar. The default is `false`. Hyperlinks between documents will still work as the primary
means of navigating the page. As example, you can see this documentation generated with this setting set to true here TODO.

## `syntaxTheme`

The syntax highlighting theme to use. The default is `atom-one-dark` for dark mode, and `atom-one-light` for light mode. 
Can be any of the themes included in the NPM package highlight.js.

Example:

```yaml
syntaxTheme:
  light: atom-one-light
  dark: atom-one-dark
```

## `favicon`

The favicon to use. Its value is an record of a source and a configuration object. The configuration object is
a config supported by the NPM package `favicons`. The source can be one of the following:

- A path to an image file

```yaml
favicon:
  source: ./favicon.png
```

- An icon name, see [this page on icons](./icons.md) for details on how icons work.

```yaml
favicon:
  source: icon:HiOutlineDocumentText
```

## `seo`

SEO information. Currently, only supports a `twitterHandle` field, the remaining SEO data is inferred from the
other properties.

```yaml
seo:
  twitterHandle: myTwitterHandle
```