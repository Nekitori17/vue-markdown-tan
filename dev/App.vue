<template>
  <div :class="[themeValue]">
    <p>
      {{ themeLabel }}
      <input type="checkbox" v-model="isDark" />
    </p>
    <textarea v-model="content" />
    <VueMarkdownTan v-bind="VueMarkdownTanProps" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { VueMarkdownTanProps, VueMarkdownTheme } from "../src/types";
import VueMarkdownTan from "../src/VueMarkdownTan.vue";
import MarkdownItHighlightJS from "markdown-it-highlightjs"

const content = ref<string>("");
const isDark = ref(false);

const themeValue = computed<VueMarkdownTheme>(() =>
  isDark.value ? "dark" : "light"
);
const themeLabel = computed(() => (isDark.value ? "dark" : "light"));
const VueMarkdownTanProps = computed<VueMarkdownTanProps<[typeof MarkdownItHighlightJS]>>(() => ({
  content: content.value,
  theme: themeValue.value,
}));
</script>

<style scoped>
.light {
  background-color: #fff;
  color: #333;
}

.dark {
  background-color: #333;
  color: #fff;
}

.light textarea {
  background-color: #eee;
  color: #333;
}

.dark textarea {
  background-color: #666;
  color: #fff;
}

textarea {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
}
</style>
