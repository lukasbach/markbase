# Customizing item orders

You can customize the order of items in the sidebar by using a `folder.yml` file.

```yaml
itemOrder:
  - folder1
  - folder2
  - document1
  - document2
```

The order of items in the sidebar is determined by the order of the items in the `order` array. Use the simple file 
name of each item, excluding the file extension, in the list.

You can also customize the order by using an `order` property in the frontmatter of each file:

```md
---
order: 1
---

File Content
```
