---


title: 面试官：你写过webpack loader吗？
date: 2020-12-05
tags:
 - loader
 - webpack
categories: 
 - project
---



## 前言

我经常使用webpack的loader，但是它的原理之前却没有了解过，在之前的秋招也被问到过，趁着这个周末，自己手写了一个loader，来彻底了解loader的写法，夯实基础。

## 开始

### 创建一个项目

通过`npm init` 创建一个新的项目，做好webpack的基本配置， `webpack.config.js` 的配置如下：

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    // 打包模式
    mode: 'development',
    //入口
    entry: path.resolve(__dirname, 'src/index.js'),
    //输出
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    //调试
    devtool: 'source-map',
    //从左到右依次在下面这些文件夹内寻找loader
    resolveLoader: {
        modules: ['node_modules', './loaders/'],
    },
    //loader配置
    module: {
        rules: [
            {
                test: /\.tpl$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'tpl-loader',
                        options: {
                            log: true
                        }
                    }
                ]
            }
        ]
    },
    //插件
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        })
    ],
    //devServer
    devServer: {
        port: 8080,
        // open: true
    }
}
```

然后创建我们需要的文件，目录结构如下：

```
.
//HtmlWebpackPlugin使用的index.html文件
├── index.html
//自己的loader
├── loaders
│   └── tpl-loader
│       ├── index.js
│       └── utils.js
├── package.json
├── src
//入口文件
│   ├── index.js
//将要使用loader 编译的文件
│   └── info.tpl
// webpack配置文件
├── webpack.config.js
└── yarn.lock
```

### loader的原理

在开始我们的loader编写之前，我们先要了解一下loader的原理，例如本文将要编写的loader，实际上是一个模版解析的loader，类似于vue的template，不过要简易很多。我们的loader的本质上是一个函数，这个函数用于处理我们的模板内容，获取到模板内容后，通过处理，将其转化为字符串，然后通过处理字符串的内容，用我们自定义的数据将其替换，最后返回一串可以显示在页面上的标签。

现在我们知道了loader运行原理后，就来开始编写我们自己的loder

### loader的用法

上面我们介绍了本文将会写一个模板处理的loader，在正式编写loader之前，先来看看如何使用loder

使用时，我们会定义一个将会渲染的数据，也就是下面的info

```js
import tpl from './info.tpl'

let App = document.querySelector('#app')

let info = {
    name:'kweku',
    age:'21',
    career:'前端工程师',
    city:'北京'
}

App.innerHTML = tpl(info)
```

然后将上面定义的info传入到写好的模版，从上面webpack的配置文件也能看出，loader的主要目的也就是用于处理这个.tpl的文件，来看看`info.tpl`

```html
<div>
    <div>{{name}}</div>
    <div>{{age}}</div>
    <div>{{city}}</div>
    <div>{{career}}</div>
</div>
```

这样看起来是不是还是挺简单的，所以针对于这个文件，我们开始编写我们的loader来，从上面的目录可以知道，我们在根目录创建了一个 `loaders`的文件夹，用于存放我们自己的loader，在webpack中有详细的配置，首先寻找根目录的loaders，如果没找到再去 node_modules内找。

这就是我们的loader的使用方法，现在我们带着使用方法去看看具体的loader实现方法。

### 开始写loader

`index.js`

```js
const { tplReplace } = require('./utils')
//用于获取配置中的options
const { getOptions } = require('loader-utils')

function tplLoader(source) {
    source = source.replace(/\s+/g, "")
    
    //通过loader-utils提供的getOptions方法可以针对于loader配置的options来做一些额外的操作
    let { log } = getOptions(this)
    //最后其实返回的是一个函数，作用于tpl的文件，然后通过babel-loader处理字符串，用于执行js
    return `
        export default (options) => {
            ${tplReplace.toString()}
            return tplReplace('${source}',options)
        }
    `
}


module.exports = tplLoader
```

公共的工具函数:`utils.js`

```js
function tplReplace(template, replaceObj) {
  //将tpl内的{{}}中的数据替换成我们定义的info
    return template.replace(/\{\{(.*?)\}\}/g, (node, key) => {
        return replaceObj[key]
    })
}
module.exports = {
    tplReplace
}
```

现在，我们的基本的loader就编写好了，你看到这里，可能会冒出一个疑问，就这？？？？哈哈哈，确实，无论一个多么复杂的loader，它的基本架构都是这样，如果你对于一些复杂的loader比较感兴趣，可以去看看它的源码是怎么写的，这里就不做过多的解释了。

## 优化

但是对于一个真正的loader来说，仅仅实现它却还是差点意思，因为现在都提倡性能优化，无论是什么程度上的优化，还是比较有实在意义的，下面就介绍几种常见的优化技巧。

### 缓存优化

在有些情况下，有些转换操作需要大量计算非常耗时，如果每次构建都重新执行重复的转换操作，构建将会变得非常缓慢。 为此，Webpack 会默认缓存所有 Loader 的处理结果，也就是说在需要被处理的文件或者其依赖的文件没有发生变化时， 是不会重新调用对应的 Loader 去执行转换操作的。

如果你想让 Webpack 不缓存该 Loader 的处理结果，可以这样：

```js
module.exports = function(source) {
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  return source;
};
```

### 处理二进制数据

在默认的情况下，Webpack 传给 Loader 的原内容都是 UTF-8 格式编码的字符串。 但有些场景下 Loader 不是处理文本文件，而是处理二进制文件，例如 file-loader，就需要 Webpack 给 Loader 传入二进制格式的数据。 为此，你需要这样编写 Loader：

```js
module.exports = function(source) {
    // 在 exports.raw === true 时，Webpack 传给 Loader 的 source 是 Buffer 类型的
    source instanceof Buffer === true;
    // Loader 返回的类型也可以是 Buffer 类型的
    // 在 exports.raw !== true 时，Loader 也可以返回 Buffer 类型的结果
    return source;
};
// 通过 exports.raw 属性告诉 Webpack 该 Loader 是否需要二进制数据 
module.exports.raw = true;
```

### 同步和异步

Loader 有同步和异步之分，上面介绍的 Loader 都是同步的 Loader，因为它们的转换流程都是同步的，转换完成后再返回结果。 但在有些场景下转换的步骤只能是异步完成的，例如你需要通过网络请求才能得出结果，如果采用同步的方式网络请求就会阻塞整个构建，导致构建非常缓慢。

在转换步骤是异步时，你可以这样：

```js
module.exports = function(source) {
    // 告诉 Webpack 本次转换是异步的，Loader 会在 callback 中回调结果
    var callback = this.async();
    someAsyncOperation(source, function(err, result, sourceMaps, ast) {
        // 通过 callback 返回异步执行后的结果
        callback(err, result, sourceMaps, ast);
    });
};
```

## 结束

现在一个完全的loader编写，就差不多了，如果你还想进一步学习的话，可以去看看官网的介绍，这里就不做多余的赘述了。