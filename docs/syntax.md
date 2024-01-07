---
icon: VscCode
---

# Supported Syntax

Markbase supports the official Markdown syntax, alongside GFM (GitHub Flavored Markdown) and some extended syntax.

## Admonitions

You can use admonitions to highlight text. Admonitions are blocks of text that are rendered with a special style. 
They are useful to highlight important information or warnings.

```md
!!! note Heading
This is a note
!!!

!!! warning Heading
This is a warning
!!!
```

!!! note Heading
This is a note
!!!

!!! warning Heading
This is a warning
!!!

The following admonition types are supported:

- `abstract`
- `attention`
- `bug`
- `caution`
- `danger`
- `error`
- `example`
- `failure`
- `hint`
- `info`
- `important`
- `note`
- `question`
- `quote`
- `success`
- `tip`
- `warning`

## Alerts

Alerts are essentially the same as admonitions, but with a different syntax.

```md
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.


## Obsidian Links

Obsidian-style hyperlinks are supported. Put the file name without extension into double square brackets to
link them. If they have a different name than their file name, its display text will be replaced.

```md
[[Note Filename]]
```