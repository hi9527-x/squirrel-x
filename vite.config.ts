import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
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
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'squirrel-x': fileURLToPath(new URL('./src/components/index.ts', import.meta.url)),
    },
  }
  if (mode === 'lib') {
    plugins.push(dts({
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: 'tsconfig.app.json',
    }))
    return {
      plugins,
      resolve,
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/components/index.ts'),
          name: 'squirrel-x',
          fileName: format => `squirrel-x.${format}.js`,
          formats: ['es'],
        },
        // cssCodeSplit: true,
        rollupOptions: {
          external: ['vue'],
          output: {
            // manualChunks: (id) => {},
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }
  }

  return {
    base: './',
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
