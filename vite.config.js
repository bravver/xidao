import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function removeModuleType() {
  return {
    name: 'remove-module-type',
    enforce: 'post',
    transformIndexHtml(html) {
      // strip the file:// redirect script from build output
      html = html.replace(/\s*<script>\s*if\s*\(window\.location\.protocol\s*===\s*'file:'[\s\S]*?<\/script>/, '')
      return html.replace(/<script type="module" crossorigin/g, '<script defer')
    },
  }
}

export default defineConfig({
  plugins: [react(), removeModuleType()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
})
