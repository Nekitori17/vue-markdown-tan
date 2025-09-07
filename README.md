# Vue Markdown Tan

A Vue 3 markdown component with syntax highlighting, theming support, and extensible plugin system.

## Features

- 🎨 **Dual Theme Support**: Light and dark themes with smooth transitions
- 🔧 **TypeScript Support**: Full TypeScript support with type inference
- 🎯 **Plugin System**: Extensible with markdown-it plugins
- 🔒 **Security**: Built-in HTML sanitization with DOMPurify
- 📋 **Copy to Clipboard**: Optional copy button for code blocks
- ✨ **Rich Formatting**: Support for emoji, math (KaTeX), task lists, and more

## Installation

```bash
npm install vue-markdown-tan
```

## Quick Start

### Global Registration

```typescript
import { createApp } from 'vue'
import VueMarkdownTan, { install } from 'vue-markdown-tan'
import App from './App.vue'

const app = createApp(App)
app.use(install)
app.mount('#app')
```

### Local Registration

```vue
<template>
  <VueMarkdownTan 
    :content="markdown" 
    theme="dark"
    :copy-btn="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueMarkdownTan } from 'vue-markdown-tan'

const markdown = ref(`
# Hello World

This is a **markdown** component with \`syntax highlighting\`.

\`\`\`javascript
console.log('Hello, Vue Markdown Tan!')
\`\`\`
`)
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | The markdown content to render |
| `theme` | `"light" \| "dark"` | `"light"` | Theme for rendering |
| `options` | `Options` | - | markdown-it configuration options |
| `plugins` | `readonly AnyPlugin[]` | - | Array of markdown-it plugins |
| `pluginOptions` | `PluginOption<P>` | - | Options for the plugins (type-safe) |
| `copyBtn` | `boolean` | `false` | Show copy button in code blocks |

## Built-in Plugins

The component comes with several pre-installed plugins:

- **Syntax Highlighting**: `markdown-it-highlightjs`
- **Emoji Support**: `markdown-it-emoji`
- **Definition Lists**: `@mdit/plugin-dl`
- **Mark/Highlight**: `@mdit/plugin-mark`
- **Math (KaTeX)**: `@mdit/plugin-katex`
- **Subscript**: `@mdit/plugin-sub`
- **Superscript**: `@mdit/plugin-sup`
- **Task Lists**: `@mdit/plugin-tasklist`

## Examples

### Basic Usage

```vue
<template>
  <VueMarkdownTan :content="content" />
</template>

<script setup lang="ts">
import { VueMarkdownTan } from 'vue-markdown-tan'

const content = `
# Welcome to Vue Markdown Tan

## Features
- [x] Syntax highlighting
- [x] Emoji support :rocket:
- [x] Math equations: $E = mc^2$
- [ ] More features coming

## Code Example
\`\`\`typescript
interface User {
  name: string
  age: number
}

const user: User = { name: 'John', age: 25 }
\`\`\`
`
</script>
```

### Dark Theme with Copy Button

```vue
<template>
  <VueMarkdownTan 
    :content="content"
    theme="dark"
    :copy-btn="true"
  />
</template>

<script setup lang="ts">
import { VueMarkdownTan } from 'vue-markdown-tan'

const content = `
\`\`\`python
def hello_world():
    print("Hello from Vue Markdown Tan!")
    return "success"

hello_world()
\`\`\`
`
</script>
```

### Custom markdown-it Options

```vue
<template>
  <VueMarkdownTan 
    :content="content"
    :options="markdownOptions"
  />
</template>

<script setup lang="ts">
import { VueMarkdownTan, createSafeMarkdownConfig } from 'vue-markdown-tan'

const content = `
# Safe Markdown

This configuration disables HTML and uses safe defaults.
`

const markdownOptions = createSafeMarkdownConfig()
</script>
```

### Using Additional Plugins

```vue
<template>
  <VueMarkdownTan 
    :content="content"
    :plugins="plugins"
    :plugin-options="pluginOptions"
  />
</template>

<script setup lang="ts">
import { VueMarkdownTan } from 'vue-markdown-tan'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItToc from 'markdown-it-toc-done-right'

const content = `
# Table of Contents

\${toc}

## Section 1
Content here...

## Section 2
More content...
`

const plugins = [markdownItAnchor, markdownItToc] as const

const pluginOptions = {
  0: { // Options for markdownItAnchor
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: '#'
  },
  1: { // Options for markdownItToc
    containerId: 'toc',
    containerClass: 'table-of-contents'
  }
}
</script>
```

### Event Handling

```vue
<template>
  <VueMarkdownTan 
    :content="content"
    @rendered="onRendered"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { VueMarkdownTan } from 'vue-markdown-tan'

const content = '# Hello World'

const onRendered = (html: string) => {
  console.log('Markdown rendered:', html)
}

const onError = (error: Error) => {
  console.error('Markdown error:', error.message)
}
</script>
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `rendered` | `html: string` | Emitted when markdown is successfully rendered |
| `error` | `error: Error` | Emitted when an error occurs during rendering |

## Styling

The component supports two themes out of the box:

- `light`: Default light theme
- `dark`: Dark theme with appropriate contrast

You can also customize the styles by targeting the CSS classes:

```css
.vue-markdown-tan {
  /* Base styles */
}

.vue-markdown-tan--light {
  /* Light theme specific styles */
}

.vue-markdown-tan--dark {
  /* Dark theme specific styles */
}
```

## TypeScript Support

The component provides full TypeScript support with automatic type inference for plugin options:

```typescript
import type { VueMarkdownTanProps } from 'vue-markdown-tan'
import markdownItAnchor from 'markdown-it-anchor'

// Type-safe plugin configuration
const plugins = [markdownItAnchor] as const

// pluginOptions will be properly typed based on the plugins array
const pluginOptions: PluginOption<typeof plugins> = {
  0: {
    permalink: true, // ✅ Type-safe
    invalidOption: true // ❌ TypeScript error
  }
}
```

## Safe Configuration

Use the `createSafeMarkdownConfig()` helper for secure markdown rendering:

```typescript
import { createSafeMarkdownConfig } from 'vue-markdown-tan'

const safeConfig = createSafeMarkdownConfig()
// Returns: {
//   html: false,
//   xhtmlOut: true,
//   breaks: false,
//   langPrefix: "language-",
//   linkify: true,
//   typographer: true,
//   quotes: '""\'\'',
// }
```

## Security

The component uses DOMPurify to sanitize HTML output, ensuring safe rendering of user-generated content. The sanitization allows common markdown elements while blocking potentially dangerous tags and attributes.

## Browser Support

- Vue 3.0+
- Modern browsers that support ES2015+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Nekitori17** - [GitHub](https://github.com/Nekitori17)

## Repository

[https://github.com/Nekitori17/vue-markdown-tan](https://github.com/Nekitori17/vue-markdown-tan)