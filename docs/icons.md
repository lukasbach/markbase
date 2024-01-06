# Using Icons

Various parts of markbase allow you to use icons. You can either use icons in the sidebar for files and folders,
as favicon for your website, or as button icon for a linked button in the sidebar header.

All icons provided by the [React Icons](https://react-icons.github.io/react-icons/) Library are available, and can be
used by specifying the full icon name.

## Use an icon in the sidebar for a markdown file

Add the icon name to the document frontmatter:

```md
---
icon: HiFilm
---

# Document with HiFilm icon
```

## Use an icon in the sidebar for a folder

Add the icon name to the folder frontmatter, in the `path/to/folder/folder.yml` file:

```yaml
icon: HiFilm
```

## Use an icon as favicon

Add the icon name to the website config, prefixed with `icon:`:

```yaml
favicon: icon:HiFilm
```

## Use an icon as button icon

Add the icon name to the button config, prefixed with `icon:`:

```yaml
headerButtons:
  - title: Sponsor
    icon: SiGithubsponsors
    link: https://github.com
    target: _blank
```