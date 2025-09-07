import type {
  Options,
  PluginSimple,
  PluginWithOptions,
  PluginWithParams,
} from "markdown-it"

/**
 * Union of all plugin types supported by markdown-it.
 *
 * - PluginSimple: simple plugin without options
 * - PluginWithOptions<O>: plugin that requires options (generic type O)
 * - PluginWithParams: plugin that receives options as function parameters
 *
 * Keep the generic type instead of forcing to `any`,
 * otherwise TypeScript loses inference.
 */
export type AnyPlugin<O = any> =
  | PluginSimple
  | PluginWithOptions<O>
  | PluginWithParams

/**
 * Extract the options type from a given plugin:
 *
 * - If PluginWithOptions<O>, infer O
 * - If PluginWithParams, take the 2nd parameter of the function
 * - Otherwise, never
 */
export type ExtractPluginOptions<T> =
  T extends PluginWithOptions<infer O>
    ? O
    : T extends PluginWithParams
    ? Parameters<T>[1]
    : never

/**
 * Check if a plugin requires options:
 *
 * - true if PluginWithOptions or PluginWithParams
 * - false otherwise
 */
export type RequiresOption<T> =
  T extends PluginWithOptions<any>
    ? true
    : T extends PluginWithParams
    ? true
    : false

/**
 * Build the pluginOptions type from the provided plugins list.
 *
 * - If a plugin requires options → Extract its option type
 * - If not → `never`
 */
export type PluginOption<P extends readonly AnyPlugin[]> = {
  [K in keyof P]?: RequiresOption<P[K]> extends true
    ? ExtractPluginOptions<P[K]>
    : never
}

/**
 * Props of the VueMarkdownTan component.
 *
 * @typeParam P - List of plugins passed into the component
 */
export interface VueMarkdownTanProps<
  P extends readonly AnyPlugin[] = readonly AnyPlugin[]
> {
  /**
   * The markdown content to render
   */
  content: string

  /**
   * Theme for rendering: "light" or "dark"
   */
  theme?: "light" | "dark"

  /**
   * Default markdown-it options
   */
  options?: Options

  /**
   * List of markdown-it plugins
   */
  plugins?: readonly [...P]

  /**
   * Options for the given plugins.
   * Types are automatically inferred from plugins.
   */
  pluginOptions?: PluginOption<P>

  /**
   * Whether to show the copy button in code blocks
   */
  copyBtn?: boolean
}

/**
 * Available themes for markdown rendering
 */
export type VueMarkdownTheme = "light" | "dark"

/**
 * Infer pluginOptions type from VueMarkdownTanProps.
 */
export type InferPluginOptions<T> = T extends VueMarkdownTanProps<infer P>
  ? PluginOption<P>
  : never