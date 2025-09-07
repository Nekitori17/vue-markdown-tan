import type { App } from "vue";
import type { Options } from "markdown-it";
import VueMarkdownTan from "./VueMarkdownTan.vue";

export { VueMarkdownTan };

/**
 * Props for the VueMarkdownTan component.
 */
export type { VueMarkdownTanProps } from "./types";

export const install = (app: App) => {
  app.component("VueMarkdownTan", VueMarkdownTan);
};

/**
 *  * Create a safe markdown-it configuration.
 *
 * This configuration disables HTML, enables XHTML output, disables breaks,
 * sets the language prefix to "language-", enables linkification,
 * enables typographer, and sets quotes to `""''`.
 *
 * @returns The markdown-it options.
 */
export const createSafeMarkdownConfig = (): Options => ({
  html: false,
  xhtmlOut: true,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: `""''`,
});

/**
 *  * Supported themes for the markdown component.
 *
 * @type {("light" | "dark")[]}
 */
export const SUPPORTED_THEMES = ["light", "dark"] as const;

/**
 *  * The default theme for the markdown component.
 *
 * @type {("light" | "dark")}
 */
export const DEFAULT_THEME = "light";
