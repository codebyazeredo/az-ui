import "../../src/styles/styles.css";
import "./docs.css";
import { initComponents } from "../../src/auto";
import { initCodeBlocks } from "./code";
import { mountShell } from "./shell";
import { initThemeToggle } from "./theme";

const content = document.getElementById("docs-content");

if (content) mountShell(content);
initCodeBlocks();
initThemeToggle();
initComponents();
