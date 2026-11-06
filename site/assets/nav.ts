const page = (title: string, path: string) => ({ title, href: `docs/${path}.html` });
const screen = (title: string, name: string) => ({ title, href: `examples/${name}.html` });

export const NAV = [
  {
    title: "Get started",
    items: [
      page("Installation", "getting-started/installation"),
      page("Quick start", "getting-started/quick-start"),
      page("JavaScript API", "javascript/overview"),
      page("Declarative forms", "forms/declarative-api"),
    ],
  },
  {
    title: "Foundations",
    items: [
      page("Colors", "foundations/colors"),
      page("Typography", "foundations/typography"),
      page("Spacing and tokens", "foundations/spacing-and-tokens"),
      page("Themes", "foundations/themes"),
      page("Utilities", "foundations/utilities"),
    ],
  },
  {
    title: "Basic components",
    items: [
      page("Button", "components/button"),
      page("Badge", "components/badge"),
      page("Alert", "components/alert"),
      page("Avatar", "components/avatar"),
      page("Card", "components/card"),
      page("Divider", "components/divider"),
      page("Icon", "components/icon"),
      { title: "Icon catalog", href: "icons.html" },
      page("Skeleton", "components/skeleton"),
      page("Spinner", "components/spinner"),
    ],
  },
  {
    title: "Forms",
    items: [
      page("Form fields", "components/form-fields"),
      page("Select", "components/select"),
      page("File upload", "components/file-upload"),
      page("Datepicker", "components/datepicker"),
      page("Toolbar, search and filter", "components/toolbar-search-filter"),
    ],
  },
  {
    title: "Overlays and navigation",
    items: [
      page("Modal", "components/modal"),
      page("Offcanvas", "components/offcanvas"),
      page("Dropdown", "components/dropdown"),
      page("Tooltip", "components/tooltip"),
      page("Popover", "components/popover"),
      page("Tabs", "components/tabs"),
      page("Accordion", "components/accordion"),
      page("Toast", "components/toast"),
      page("Notification", "components/notification"),
      page("Command menu", "components/command-menu"),
      page("Context menu", "components/context-menu"),
    ],
  },
  {
    title: "Data",
    items: [
      page("Table and DataTable", "components/table"),
      page("Pagination", "components/pagination"),
      page("Data display", "components/data-display"),
    ],
  },
  {
    title: "Layouts",
    items: [page("Layout components", "components/layouts")],
  },
  {
    title: "Example screens",
    items: [
      screen("Operations dashboard", "dashboard"),
      screen("Orders list", "orders"),
      screen("Order form", "order-form"),
      screen("Sign in", "sign-in"),
    ],
  },
  {
    title: "Guides",
    items: [
      page("Accessibility", "guides/accessibility"),
      page("Customization", "guides/customization"),
      page("PHP and server-side", "guides/php"),
      page("Frameworks", "guides/frameworks"),
      page("Versioning and roadmap", "guides/versioning"),
    ],
  },
];

export const NAV_ITEMS = NAV.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.title })),
);
