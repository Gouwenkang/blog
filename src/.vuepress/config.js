const themeConfig = require('./config/theme')

module.exports = {
  title: "Kweku",
  description: "kweku's blog",
  dest: 'public',
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