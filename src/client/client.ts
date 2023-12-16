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

const searchDialog = document.getElementById("search-dialog") as HTMLDialogElement;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
let allDocs: any[] = [];
let focusedIndex = 0;
fetch((window as any).relativeUrl + "/search.json")
    .then(async (res) => res.json())
    .then((docs) => {
        allDocs = docs;
    });

const openSearch = () => {
    searchDialog?.showModal();
}
const typeIntoSearch = (e: KeyboardEvent) => {
    setTimeout(() => {
        const searchResults = document.getElementsByClassName("search-result");
        if (e.key === "Escape") {
            searchDialog?.close();
            if (searchInput) {
                searchInput.blur();
                searchInput.value = "";
            }
        }
        if (e.key === "Enter") {
            const el = searchResults?.[focusedIndex];
            if (el) {
                el.dispatchEvent(new MouseEvent("click"));
            }
            return;
        }
        if (e.key === "ArrowDown") {
            focusedIndex = Math.min(focusedIndex + 1, searchResults.length - 1);
            Array.prototype.forEach.call(document.getElementsByClassName("search-result"), el => {
                el.classList.remove("focused");
            });
            const el = searchResults?.[focusedIndex];
            if (el) {
                el.classList.add("focused");
                el.scrollIntoView({ block: "nearest" });
            }
            return;
        }
        if (e.key === "ArrowUp") {
            focusedIndex = Math.max(focusedIndex - 1, 0);
            Array.prototype.forEach.call(searchResults, el => {
                el.classList.remove("focused");
            });
            const el = searchResults?.[focusedIndex];
            if (el) {
                el.classList.add("focused");
                el.scrollIntoView({ block: "nearest" });
            }
            return;
        }

        const value = (e.target as HTMLInputElement).value;
        const matches = allDocs.filter((doc) => doc.title.toLowerCase().includes(value.toLowerCase()));
        document.getElementById("search-results")?.replaceChildren(...matches.map((match, i) => {
            const comp = document.createElement("button");
            comp.innerText = match.title;
            comp.classList.add("search-result");
            comp.classList.toggle("focused", i === focusedIndex);
            comp.addEventListener("click", () => {
                window.location.replace(match.path)
            });
            return comp;
        }));
        focusedIndex = 0;
    });
}
document.getElementsByClassName("search-button")[0]?.addEventListener("click", openSearch);
searchInput?.addEventListener("keydown", typeIntoSearch);
document.querySelector("#search-dialog > *")?.addEventListener("click", e => e.stopPropagation());
searchDialog?.addEventListener("click", e => searchDialog.close());
document.addEventListener("keydown", e => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        openSearch();
        searchInput?.focus();
    }
})