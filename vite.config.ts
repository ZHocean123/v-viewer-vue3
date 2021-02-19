import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      markdownItOptions: {
        html: false,
        linkify: true,
        typographer: true,
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'v-viewer-vue3'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
