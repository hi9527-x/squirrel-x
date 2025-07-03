import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import { defaultClientConditions, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    vueJsx(),
    UnoCSS({}),
    Icons({
      scale: 1,
      defaultStyle: 'display: inline-block; vertical-align: middle',
    }),
  ]

  const resolve = {
    conditions: ['worker', ...defaultClientConditions],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'squirrel-x': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  }
  if (mode === 'lib') {
    plugins.push(dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',

    }))
    return {
      plugins,
      resolve,
      build: {
        lib: {
          // entry: path.resolve(__dirname, 'src/components/index.ts'),
          entry: {
            'squirrel-x': path.resolve(__dirname, 'src/components/index.ts'),
            'squirrel-x.mermaid': path.resolve(__dirname, 'src/components/Mermaid/index.ts'),
          },
          name: 'squirrel-x',
          fileName: (format, entryName) => {
            return `${entryName}.js`
          },
          formats: ['es'],
        },
        // 拆分css
        // cssCodeSplit: true,
        rollupOptions: {
          external: ['vue', 'mermaid'],
          output: {
            // manualChunks: (id) => {

            //   return null
            // },
            globals: {
              vue: 'Vue',
              mermaid: 'mermaid',
            },
          },
        },
      },
    }
  }

  return {
    base: process.env?.VITE_APP_BASE || '/',
    plugins,
    resolve,
    build: {
      outDir: 'docs',
    },
    server: {
      host: '0.0.0.0',
    },
  }
})
