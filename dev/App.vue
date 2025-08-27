<template>
  <div :class="[themeValue]">
    <p>
      {{ themeLabel }}
      <input type="checkbox" v-model="isDark" />
    </p>
    <textarea v-model="content" />
    <VueMarkdownTan :content="content" :theme="themeValue" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { VueMarkdownTheme } from "../src/types";
import VueMarkdownTan from "../src/VueMarkdownTan.vue";

const content = ref<string>("");

const isDark = ref(false);

const themeValue = computed<VueMarkdownTheme>(() =>
  isDark.value ? "dark" : "light"
);
const themeLabel = computed(() => (isDark.value ? "dark" : "light"));
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