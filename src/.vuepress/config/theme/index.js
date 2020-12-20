const themeReco = require('./themeReco.js')
const nav = require('../nav')
const sidebar = require('../sidebar')

module.exports = Object.assign({}, themeReco, {
  nav,
  sidebar,
  sidebar: 'auto',
  sidebarDepth: 2,
  subSidebar: "auto",
  displayAllHeaders: false,
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  // 自动形成侧边导航
  friendLink: [
    {
      title: 'vuepress-theme-reco',
      desc: 'A simple and beautiful vuepress Blog & Doc theme.',
      logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
      link: 'https://vuepress-theme-reco.recoluan.com'
    },
    {
      title: '午后南杂',
      desc: 'Enjoy when you can, and endure when you must.',
      email: 'recoluan@qq.com',
      link: 'https://www.recoluan.com'
    },
    {
      title: '粥里有勺糖',
      desc: '你的指尖,拥有改变世界的力量',
      email: '',
      link: ' https://sugarat.top'
    },
  ]
})