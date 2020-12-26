const themeReco = require('./themeReco.js')
const nav = require('../nav')
const sidebar = require('../sidebar')

module.exports = Object.assign({}, themeReco, {
  nav,
  sidebar,
  sidebar: 'auto',
  sidebarDepth:2,
  subSidebar: "auto",
  displayAllHeaders: false,
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  friendLink: [
    {
      title: '午后南杂',
      desc: 'Enjoy when you can, and endure when you must.',
      link: 'https://www.recoluan.com/'
    },
    {
      title: '粥里有勺糖',
      desc: '你的指尖,拥有改变世界的力量',
      link: 'https://sugarat.top/'
    },
  ]
})