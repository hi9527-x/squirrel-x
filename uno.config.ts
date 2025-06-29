// import presetWind4 from '@unocss/preset-wind4'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  presetWind3,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: {},
  rules: [],
  theme: {
    colors: {
      primary: '#1677ff',
    },
  },
  presets: [
    presetMini({
      preflight: 'on-demand',
    }),
    // presetWind3({
    //   // preflight: false,
    // }),
    presetAttributify({
      preflights: {

      },
    }),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        luc: () => import('@iconify-json/lucide/icons.json').then(i => i.default),
      },
    }),
  ],
  transformers: [
    /**
     * https://unocss.dev/transformers/directives
     * 使其在css里面使用
     */
    transformerDirectives(),
  ],
})
