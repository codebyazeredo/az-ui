import "../../src/styles/styles.css";
import "./docs.css";
import "./landing.css";
import { initComponents } from "../../src/auto";
import { initCodeBlocks } from "./code";
import { mountHeader } from "./shell";
import { initThemeToggle } from "./theme";

mountHeader();
initCodeBlocks();
initThemeToggle();
initComponents();
