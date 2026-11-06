const THEME_STORAGE_KEY = "az-docs-theme";
const THEME_TOGGLE_SELECTOR = "[data-docs-theme-toggle]";

function toggleTheme(): void {
  const root = document.documentElement;
  const nextTheme = root.dataset.azTheme === "dark" ? "light" : "dark";

  root.dataset.azTheme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

export function initThemeToggle(): void {
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(THEME_TOGGLE_SELECTOR)) {
      toggleTheme();
    }
  });
}
