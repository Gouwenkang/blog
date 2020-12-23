const themeConfig = require('./config/theme')

module.exports = {
  title: "Kweku",
  description: "所有的出乎预料都是努力的结果",
  dest: 'dist',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'vuepress-theme-reco',
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  plugins: {
    '@vuepress/medium-zoom': {},
    'flowchart': {},
    "vuepress-plugin-auto-sidebar": {
      collapsable: false,
      sidebarDepth:2
    },
  },
}  