import type { App } from "vue";
import type { Options } from "markdown-it";
import VueMarkdownTan from "./VueMarkdownTan.vue";

export { VueMarkdownTan };
export type { VueMarkdownTanProps } from "./types";

export const install = (app: App) => {
  app.component("VueMarkdownTan", VueMarkdownTan);
};

export const createSafeMarkdownConfig = (): Options => ({
  html: false,
  xhtmlOut: true,
  breaks: false,
  langPrefix: "language-",
  linkify: true,
  typographer: true,
  quotes: `""''`,
});

export const SUPPORTED_THEMES = ["light", "dark"] as const;
export const DEFAULT_THEME = "light";

