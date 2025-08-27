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
  content: string;
  theme?: "light" | "dark";
  options?: Options;
  plugins?: readonly [...P];
  pluginOptions?: PluginOption<P>;
}

export type VueMarkdownTheme = "light" | "dark";

export type InferPluginOptions<T> = T extends VueMarkdownTanProps<
  infer P
>
  ? PluginOption<P>
  : never;
