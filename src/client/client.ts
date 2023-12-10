const lsKey = "open-folders";
let openFolders: string[] = [];

const isNotNull = <T>(value: T | null): value is T => value !== null;

try {
  openFolders = JSON.parse(window.localStorage.getItem(lsKey) || "[]") || [];
} catch (e) {
  console.log("Failed to parse open folders from local storage", e);
  /* empty */
}

// const patchAllItemHeights = () => {
//   document.querySelectorAll("[data-folder-item].open").forEach((item) => {
//     const ul = item.querySelector("ul");
//     if (ul) {
//       (ul as HTMLElement).style.height = `${ul.scrollHeight}px`;
//     }
//   });
// }

document.querySelectorAll("[data-folder-item]").forEach((item) => {
  const folder = item.getAttribute("data-folder-item");
  const isOpen = folder && openFolders.includes(folder);
  item.classList.toggle("open", !!isOpen);

  const ul = item.querySelector("ul");
  if (ul) {
    (ul as HTMLElement).style.height = isOpen ? `auto` : "0px";
  }

  item.querySelector("button")?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    openFolders = Array.from(
      document.querySelectorAll("[data-folder-item].open")
    )
      .map((item) => item?.getAttribute("data-folder-item"))
      .filter(isNotNull);
    // if (isOpen) {
      const ul = item.querySelector("ul");
      if (ul) {
        if (isOpen) {
          (ul as HTMLElement).style.height = `${ul.scrollHeight}px`;
          setTimeout(() => {
            (ul as HTMLElement).style.height = "auto";
          }, 200);
        } else {
          (ul as HTMLElement).style.height = `${ul.scrollHeight}px`;
          setTimeout(() => {
            (ul as HTMLElement).style.height = "0px";
          });
        }
      }
    // }
    try {
      window.localStorage.setItem(lsKey, JSON.stringify(openFolders));
    } catch {
      /* empty */
    }
  });
});

