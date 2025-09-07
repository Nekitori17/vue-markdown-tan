import type {
  Options,
  PluginSimple,
  PluginWithOptions,
  PluginWithParams,
} from "markdown-it";

type AnyPlugin = PluginSimple | PluginWithOptions<any> | PluginWithParams;

type ExtractPluginOptions<T> = T extends PluginWithOptions<infer O>
  ? O
  : T extends PluginWithParams
  ? Parameters<T>[1]
  : never;

type RequiresOption<T> = T extends PluginWithOptions<any>
  ? true
  : T extends PluginWithParams
  ? true
  : false;

export type PluginOption<P extends readonly AnyPlugin[]> = {
  [K in keyof P]?: RequiresOption<P[K]> extends true
    ? ExtractPluginOptions<P[K]>
    : never;
};

export interface VueMarkdownTanProps<
  P extends readonly AnyPlugin[] = readonly AnyPlugin[]
> {
  /**
   * The markdown content to render.
   */
  content: string;

  /**
   * The theme of the markdown content.
   */
  theme?: "light" | "dark";

  /**
   * The markdown-it options.
   */
  options?: Options;

  /**
   * The markdown-it plugins.
   */
  plugins?: readonly [...P];

  /**
   * The markdown-it plugin options.
   */
  pluginOptions?: PluginOption<P>;

  /**
   * Whether to display the copy button for codeblock.
   */
  copyBtn: boolean
}

/**
 * The theme of the markdown content.
 */
export type VueMarkdownTheme = "light" | "dark";

/**
 * The markdown-it plugin options.
 */
export type InferPluginOptions<T> = T extends VueMarkdownTanProps<
  infer P
>
  ? PluginOption<P>
  : never;
