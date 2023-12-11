enum LsKeys {
    OpenFolders = "open-folders",
    ColorMode = "color-mode",
}
let openFolders: string[] = [];

const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const value = window.localStorage.getItem(key);
        if (value) {
        return JSON.parse(value);
        }
    } catch {
        /* empty */
    }
    return defaultValue;
}

const writeToLocalStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* empty */
  }
}

const isNotNull = <T>(value: T | null): value is T => value !== null;

try {
  openFolders = getFromLocalStorage(LsKeys.OpenFolders, []);
} catch (e) {
  console.log("Failed to parse open folders from local storage", e);
  /* empty */
}

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
    writeToLocalStorage(LsKeys.OpenFolders, openFolders);
  });
});


let colorMode = getFromLocalStorage(LsKeys.ColorMode, window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light");
const setColorModeFlag = () => {
    document.documentElement.classList.toggle("dark", colorMode === "dark");
    document.documentElement.classList.toggle("light", colorMode !== "dark");
}
setColorModeFlag();
document.getElementsByClassName("color-mode-switch")[0]?.addEventListener("click", () => {
    colorMode = colorMode === "dark" ? "light" : "dark";
    setColorModeFlag();
    writeToLocalStorage(LsKeys.ColorMode, colorMode);
});
