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
  // 自动形成侧边导航
})