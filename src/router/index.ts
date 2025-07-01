import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// import Home from '@/views/Home/index.vue'

// interface MenuDataItem {
// hideLayout
//   /** @name 在菜单中隐藏子节点 */
//   hideChildrenInMenu?: boolean
//   /** @name 在菜单中隐藏自己和子节点 */
//   hideInMenu?: boolean
//   /** @name 在面包屑中隐藏 */
//   hideInBreadcrumb?: boolean
//   /** @name 菜单的icon */
//   icon?: VNode
//   /** @name 菜单的名字 */
//   title?: string
//   /** @name 用于标定选中的值，默认是 path */
//   key?: string
//   /** @name disable 菜单选项 */
//   disabled?: boolean
//   /** @name 路径,可以设定为网页链接 */
//   path?: string
//   /** @name 隐藏自己，并且将子节点提升到与自己平级 */
//   flatMenu?: boolean
//   /** @name 指定外链打开形式，同a标签 */
//   target?: string
// }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/guide',
    },
    {
      path: '/guide',
      name: 'guide',
      meta: {
        title: '快速开始',

      },
      component: () => import('@/views/guide'),
    },
    {
      path: '/markdown',
      name: 'markdown',
      meta: {
        title: 'markdown',

      },
      redirect: '/markdown/vue-markdown',
      children: [
        {
          path: 'vue-markdown',
          name: 'vue-markdown',
          meta: { title: 'vue-markdown' },
          component: () => import('@/views/vue-markdown/index.vue'),
        },
        {
          path: 'vue-markdown-pro',
          name: 'vue-markdown-pro',
          meta: { title: 'vue-markdown-pro' },
          component: () => import('@/views/markdown'),
        },
      ],
    },
    {
      path: '/mermaid',
      name: 'mermaid',
      meta: {
        title: 'mermaid图表',

      },
      component: () => import('@/views/mermaid'),
    },
    {
      path: '/math',
      name: 'math',
      meta: {
        title: 'katex公式',
      },
      component: () => import('@/views/math'),
    },
    {
      path: '/codeHljs',
      name: 'codeHljs',
      meta: {
        title: '代码高亮',
      },
      component: () => import('@/views/codeHljs/index.vue'),
    },
    {
      path: '/codeEdit',
      name: 'codeEdit',
      meta: {
        title: '代码编辑',
      },
      component: () => import('@/views/codeEdit'),
    },
    {
      path: '/changelog',
      name: 'changelog',
      meta: {
        title: '更新日志',
      },
      component: () => import('@/views/changelog'),
    },
    {
      path: '/ui',
      name: 'ui',
      meta: {
        title: 'ui',
      },
      redirect: '/ui/button',
      children: [
        {
          path: 'button',
          name: 'button',
          meta: {
            title: 'button',

          },
          component: () => import('@/views/button'),
        },
        {
          path: 'alert',
          name: 'alert',
          meta: {
            title: 'alert',

          },
          component: () => import('@/views/alert'),
        },
        {
          path: 'select',
          name: 'select',
          meta: {
            title: 'select',

          },
          component: () => import('@/views/select'),
        },
        {
          path: 'empty',
          name: 'empty',
          meta: {
            title: 'empty',

          },
          component: () => import('@/views/empty'),
        },
        {
          path: 'popover',
          name: 'popover',
          meta: {
            title: 'popover',

          },
          component: () => import('@/views/popover'),
        },
        {
          path: 'tabs',
          name: 'tabs',
          meta: {
            title: 'tabs',

          },
          component: () => import('@/views/tabs'),
        },
        ...import.meta.env.DEV
          ? [{
              path: 'test',
              name: 'test',
              meta: {
                title: 'test',
                hideMenu: true,

              },
              component: () => import('@/views/test/index.vue'),
            }]
          : [],
      ],
    },

  ],
})

export default router
