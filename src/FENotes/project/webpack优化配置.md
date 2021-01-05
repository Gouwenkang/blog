---
title: webpack优化配置
date: 2021-01-04
tags:
- webpack
categories: 
 - FENotes
---

## 文件压缩

+ Js压缩

  webpack内置了压缩插件uglifyjs-webpack-plugin，无需其他额外操作

+ css压缩

  使用optimize-css-assets-webpack-plugin进行压缩

+ html压缩

  使用html-webpack-plugin进行压缩

## 自动清除构建目录

在每次重新构建时需要将上次打包过后生成的文件删除。

+ 方法一、在scripts内使用 `rm -rf ./dist && webpack`
+ 方法二、使用clean-webpack-plugin插件

## 自动添加css浏览器厂商前缀

使用 postcss-loader和autoprefixer

## 将px转化为rem&自动计算根元素font-size

+ px->rem使用px2rem
+ lib-flexible 自动计算根元素font-size



