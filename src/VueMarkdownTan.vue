<template>
  <div
    ref="html-markdown"
    :class="['vue-markdown-tan', themeClass]"
    v-html="sanitizedMarkdown"
  />
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
import { computed, useTemplateRef, watch, nextTick } from "vue";
import { htmlToText } from "html-to-text";

import MarkdownItHighlightJS from "markdown-it-highlightjs";
import { full as MarkdownItEmoji } from "markdown-it-emoji"
import { dl as MarkdownItDL } from "@mdit/plugin-dl";
import { mark as MarkdownItMark } from "@mdit/plugin-mark";
import { katex as MarkdownItKatex } from "@mdit/plugin-katex";
import { sub as MarkdownItSub } from "@mdit/plugin-sub";
import { sup as MarkdownItSup } from "@mdit/plugin-sup";
import { tasklist as MarkdownItTaskLis } from "@mdit/plugin-tasklist";

import "highlight.js/styles/atom-one-dark.css";

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
  copyBtn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: "light",
  copyBtn: false,
});

const emit = defineEmits<{
  error: [error: Error];
  rendered: [html: string];
}>();

const themeClass = computed(() => `vue-markdown-tan--${props.theme}`);

// Create markdown instance with plugins and options (if provided)
const md = computed(() => {
  const markdownIt = new MarkdownIt(
    props.options ?? {
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    }
  );

  // Install default plugin
  markdownIt.use(MarkdownItHighlightJS);
  markdownIt.use(MarkdownItEmoji);
  markdownIt.use(MarkdownItDL);
  markdownIt.use(MarkdownItMark);
  markdownIt.use(MarkdownItKatex);
  markdownIt.use(MarkdownItSub);
  markdownIt.use(MarkdownItSup);
  markdownIt.use(MarkdownItTaskLis);
  

  if (props.plugins && props.plugins.length > 0) {
    props.plugins.forEach((plugin, index) => {
      try {
        const pluginOptions = props.pluginOptions?.[index];

        if (pluginOptions !== undefined && pluginOptions !== null) {
          markdownIt.use(plugin as any, pluginOptions);
        } else {
          markdownIt.use(plugin as any);
        }
      } catch (error) {
        console.error(`Error loading plugin at index ${index}:`, error);
        emit("error", new Error(`Plugin loading failed: ${error}`));
      }
    });
  }

  return markdownIt;
});

// Render markdown content to HTML
const renderedMarkdown = computed(() => {
  if (!props.content || typeof props.content !== "string") {
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
    emit("error", new Error(errorMessage));

    return `<div class="markdown-error">
      <p><strong>Markdown rendering error:</strong></p>
      <pre>${errorMessage}</pre>
    </div>`;
  }
});

// Sanitize HTML content
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
      KEEP_CONTENT: true,
    });
  } catch (error) {
    console.error("HTML sanitization error:", error);
    emit("error", new Error(`Sanitization failed: ${error}`));
    return '<div class="sanitization-error">Content could not be safely rendered</div>';
  }
});

const htmlMarkdown = useTemplateRef("html-markdown");

// Watch for copy button changes
watch(
  [() => props.copyBtn, sanitizedMarkdown],
  async ([copyBtn]) => {
    await nextTick();

    const element = htmlMarkdown.value;
    if (!element) return;

    const codeblocks = element.querySelectorAll("pre");

    if (copyBtn) {
      codeblocks?.forEach((code) => {
        if (!code.querySelector(".copyBtn")) {
          const button = document.createElement("button");
          button.classList.add("copyBtn");
          button.textContent = "Copy";
          button.type = "button";

          code.style.position = "relative";
          code.appendChild(button);

          const handleCopy = async () => {
            try {
              const codeContent =
                code.querySelector("code")?.textContent ||
                code.querySelector("code")?.innerHTML;

              if (codeContent) {
                const plainText =
                  typeof codeContent === "string"
                    ? codeContent
                    : htmlToText(codeContent);

                await navigator.clipboard.writeText(plainText);
                button.textContent = "Copied!";
                setTimeout(() => (button.textContent = "Copy"), 2000);
              }
            } catch (error) {
              console.error("Copy failed:", error);
              button.textContent = "Copy failed";
              setTimeout(() => (button.textContent = "Copy"), 2000);
            }
          };

          button.addEventListener("click", handleCopy);
        }
      });
    } else {
      codeblocks?.forEach((code) => {
        const button = code.querySelector(".copyBtn");
        button?.remove();
      });
    }
  },
  { immediate: true }
);
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

.vue-markdown-tan--dark .markdown-error {
  background-color: #2d1b1b;
  border-color: #4a2c2c;
  color: #ff6b6b;
}

.vue-markdown-tan--dark .markdown-error strong {
  color: #ff5252;
}

.vue-markdown-tan--dark .markdown-error pre {
  background-color: #1f1515;
  border-color: #4a2c2c;
}

.vue-markdown-tan--dark .sanitization-error {
  background-color: #2d1515;
  border-color: #f44336;
  color: #ff5252;
}

:deep(.copyBtn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.copyBtn:hover) {
  background: rgba(0, 0, 0, 0.9);
}

.vue-markdown-tan--dark :deep(.copyBtn) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.vue-markdown-tan--dark :deep(.copyBtn:hover) {
  background: rgba(255, 255, 255, 0.3);
}
</style>
