<template>
  <div :class="['vue-markdown-tan', themeClass]" v-html="sanitizedMarkdown" />
</template>

<script setup lang="ts">
import DOMPurify from "dompurify";
import type {
  Options,
  PluginSimple,
  PluginWithOptions,
  PluginWithParams,
} from "markdown-it";
import MarkdownIt from "markdown-it";
import { computed } from "vue";

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

export interface Props<P extends readonly AnyPlugin[] = readonly AnyPlugin[]> {
  content: string;
  theme?: "light" | "dark";
  options?: Options;
  plugins?: readonly [...P];
  pluginOptions?: PluginOption<P>;
}

const props = withDefaults(defineProps<Props>(), {
  theme: "light",
  options: () => ({}),
  plugins: () => [],
  pluginOptions: () => [],
});

const emit = defineEmits<{
  error: [error: Error];
  rendered: [html: string];
}>();

const themeClass = computed(() => `vue-markdown-tan--${props.theme}`);

const md = computed(() => {
  const markdownIt = new MarkdownIt(
    props.options
      ? props.options
      : {
          html: true,
          linkify: true,
          typographer: true,
          breaks: false,
        }
  );

  if (props.plugins && props.plugins.length > 0) {
    props.plugins.forEach((plugin, index) => {
      const pluginOptions = props.pluginOptions?.[index];

      try {
        if (pluginOptions !== undefined && pluginOptions !== null) {
          markdownIt.use(plugin, pluginOptions);
        } else {
          markdownIt.use(plugin);
        }
      } catch (error) {
        console.error(`Error loading plugin at index ${index}:`, error);
        emit("error", error as Error);
      }
    });
  }

  return markdownIt;
});

const renderedMarkdown = computed(() => {
  if (!props.content) {
    return "";
  }

  try {
    const html = md.value.render(props.content);

    emit("rendered", html);
    return html;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown markdown rendering error";

    console.error("Markdown rendering error:", error);
    emit("error", error as Error);

    return `<div class="markdown-error">
      <p><strong>Markdown rendering error:</strong></p>
      <pre>${errorMessage}</pre>
    </div>`;
  }
});

const sanitizedMarkdown = computed(() => {
  if (!renderedMarkdown.value) {
    return "";
  }

  try {
    return DOMPurify.sanitize(renderedMarkdown.value, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "hr",
        "strong",
        "em",
        "u",
        "s",
        "sup",
        "sub",
        "mark",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
        "code",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "a",
        "img",
        "div",
        "span",
      ],
      ALLOWED_ATTR: [ 
        "href",
        "src",
        "alt",
        "title",
        "class",
        "id",
        "target",
        "rel",
      ],
      ADD_TAGS: ["mark"],
      FORBID_TAGS: ["script", "object", "embed", "base"],
    });
  } catch (error) {
    console.error("HTML sanitization error:", error);
    emit("error", error as Error);
    return '<div class="sanitization-error">Content could not be safely rendered</div>';
  }
});
</script>

<style>
@import "./light.css";
@import "./dark.css";
</style>

<style scoped>
.vue-markdown-tan {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.markdown-error {
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  color: #c33;
}

.markdown-error strong {
  color: #a00;
}

.markdown-error pre {
  background-color: #fdd;
  border: 1px solid #fcc;
  border-radius: 3px;
  padding: 0.5rem;
  margin: 0.5rem 0 0 0;
  font-size: 0.875em;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.sanitization-error {
  background-color: #ffebee;
  border: 1px solid #f44336;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  color: #c62828;
  font-weight: 500;
}

.vue-markdown-next--dark .markdown-error {
  background-color: #2d1b1b;
  border-color: #4a2c2c;
  color: #ff6b6b;
}

.vue-markdown-next--dark .markdown-error strong {
  color: #ff5252;
}

.vue-markdown-next--dark .markdown-error pre {
  background-color: #1f1515;
  border-color: #4a2c2c;
}

.vue-markdown-next--dark .sanitization-error {
  background-color: #2d1515;
  border-color: #f44336;
  color: #ff5252;
}
</style>