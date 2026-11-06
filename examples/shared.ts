import "../src/auto";

const THEME_STORAGE_KEY = "az-examples-theme";

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element) || !event.target.closest("[data-example-theme-toggle]"))
    return;

  const root = document.documentElement;
  const nextTheme = root.dataset.azTheme === "dark" ? "light" : "dark";

  root.dataset.azTheme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});
