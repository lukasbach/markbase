---
icon: VscCaseSensitive
---

# Customizing a document title

There are several ways to customize which title a document has.

## Using a markdown title

If the configuration option `hoistMarkdownTitles` is set to `true`, the first markdown heading will be used as the 
document title.

```md
# This title will be used as document title

Content

# This title will be displayed normally
```

## Using a frontmatter title

You can also set the title in the document frontmatter:

```md
---
title: This title will be used as document title
---

Content
```

## Customizing what is shown in the sidebar

You can use frontmatter to display a different title in the sidebar than in the document itself:

```md
---
title: This title will be used as document title
sidebarTitle: This title will be displayed in the sidebar
---

Content
```

## Customizing the title of a folder

You can use a `folder.yml` file to customize the title of a folder:

```yaml
title: This title will be used as folder title
```