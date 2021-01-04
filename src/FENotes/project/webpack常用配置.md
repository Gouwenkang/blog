---
title: webpack常用配置
date: 2021-01-02
tags:
- webpack
categories: 
 - FENotes
---

## 初始化项目

```js
yarn init -y
```

## 安装 `webpack webpack-cli webpack-dev-server`

```js
yarn add webpack webpack-cli webpack-dev-server -D
```

当前版本

```json
"webpack": "^4.17.1",
"webpack-cli": "^3.3.9",
"webpack-dev-server": "^3.8.2"
```

## 在webpack.config.js中通过commonJs导出一个对象

```js
moudule.exports = {
  
}
```

## 配置打包环境

```js
mode:'development'
mode:'production'
```

## 配置入口

```js
// 普通路径
entry:'./src/index.js',
// Array 一个chunk
entry:['./src/index1.js','./src/index2.js']
//对象 在运行时会有多个chunk 输出多个bundle
entry:{
  index1:'./src/index1.js',
  index2:'./src/index2.js'
}
```

## 配置出口

基本配置

```js
output:{
  path:path.resolve(__dirname,'dist'),
  filename:'bundle.js'
}
```

其他属性

+ filename

  如果只输出一个文件，只需像上面一样写成静态即可

  如果输出多个文件，可以通过chunk来区分：

  ```js
  filename:'[name].js'
  ```

  内置变量除了name，还包括：

  | **变量名** | 含义                       |
  | ---------- | -------------------------- |
  | id         | Chunk 的唯一标识，从0开始  |
  | name       | Chunk 的名称               |
  | hash       | Chunk 的唯一标识的 Hash 值 |
  | chunkhash  | Chunk 内容的 Hash 值       |

  其中 `hash` 和 `chunkhash` 的长度是可指定的，`[hash:8]` 代表取8位 Hash 值，默认是20位。

  `hash` 、`chunkhash`、`contenthash` 区别：

  哈希一般是结合 CDN 缓存来使用的。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的 HTML 引用的 URL 地址也会改变，触发 CDN 服务器从源服务器上拉取对应数据，进而更新本地缓存。

  + `hash` 计算是跟整个项目的构建相关，所有的模块都共用一个hash，每次文件重新打包后都会变化。因为 hash 是项目构建的哈希值，项目中如果有些变动，hash 一定会变，比如说我改动了 utils.js 的代码，index.js 里的代码虽然没有改变，但是大家都是用的同一份 hash。hash 一变，缓存一定失效了，这样子是没办法实现 CDN 和浏览器缓存的。
  + `chunkhash`根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。
  + `contenthash` 根据资源内容创建出唯一 hash，也就是说文件内容不变，hash 就不变。

  总结：

  hash 计算与整个项目的构建相关；

  chunkhash 计算与同一 chunk 内容相关；

  contenthash 计算与文件内容本身相关。

+ publicPath

  在复杂的项目里可能会有一些构建出的资源需要异步加载，加载这些异步资源需要对应的 URL 地址。

  `output.publicPath` 配置发布到线上资源的 URL 前缀，为string 类型。 默认值是空字符串 `''`，即使用相对路径。

  这样说可能有点抽象，举个例子，需要把构建出的资源文件上传到 CDN 服务上，以利于加快页面的打开速度。配置代码如下：

  ```js
  filename:'[name]_[chunkhash:8].js'
  publicPath: 'https://cdn.example.com/assets/'
  ```

  这时发布到线上的 HTML 在引入 JavaScript 文件时就需要：

  ```html
  <script src='https://cdn.example.com/assets/a_12345678.js'></script>
  ```

  使用该配置项时要小心，稍有不慎将导致资源加载404错误。

  `output.path` 和 `output.publicPath` 都支持字符串模版，内置变量只有一个：`hash` 代表一次编译操作的 Hash 值。

+ 其他属性

  其他更多关于output的属性可以查看 [官网](https://webpack.docschina.org/configuration/output/) 

## webpack自动打包 --watch

原理：webpack记录文件最后一次修改时间，通过轮询的方式，来判断是否需要打包。可以通过配置来设置轮询的次数和排除node_modules文件夹

## devServer

通过 DevServer 启动的 Webpack 会开启监听模式，当发生变化时重新执行完构建后通知 DevServer。 DevServer 会让 Webpack 在构建出的 JavaScript 代码里注入一个代理客户端用于控制网页，网页和 DevServer 之间通过 WebSocket 协议通信， 以方便 DevServer 主动向客户端发送命令。 DevServer 在收到来自 Webpack 的文件变化通知时通过注入的客户端控制网页刷新。

常用配置项，更多配置项请移步至官网

+ hot

  `devServer.hot` 配置是否启用模块热替换功能。 DevServer 默认的行为是在发现源代码被更新后会通过自动刷新整个页面来做到实时预览，开启模块热替换功能后将在不刷新整个页面的情况下通过用新模块替换老模块来做到实时预览。

+ port

  `devServer.port` 配置项用于配置 DevServer 服务监听的端口，默认使用 8080 端口。 如果 8080 端口已经被其它程序占有就使用 8081，如果 8081 还是被占用就使用 8082，以此类推。

+ open

  `devServer.open` 用于在 DevServer 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。 同时还提供 `devServer.openPage` 配置项用于打开指定 URL 的网页。

+ proxy

  当拥有单独的API后端开发服务器并且希望在同一域上发送API请求时，代理某些URL可能会很有用。

  ```js
  devServer: {
      proxy: {
        '/api': 'http://localhost:3000'
      }
    }
  ```

## Devtool

如果运行打包后的文件，某个地方有错误，控制台会显示打包后的文件的某个位置有错误，如果我们想知道错误来自于源文件的所在位置，那么就需要借助 sourceMap 了。所以 sourceMap 其实就是一种映射，它知道 dist 目录 main.js 文件的某个错误，实际对应的是 src 目录下 index.js 文件的第一行。

sourceMap 通过配置中的 devtool 去配置，参数的含义大概有以下几种情况：

| devtool                 | 作用                                                         |
| ----------------------- | ------------------------------------------------------------ |
| source-map              | 生成 map 文件，错误精确到行和列                              |
| inline-source-map       | inline，不生成 map 文件，以 base64 形式嵌入js中，错误精确到行和列 |
| cheap-source-map        | cheap，错误只精确到行，且只针对业务代码，不包括第三方模块    |
| cheap-module-source-map | cheap-module，错误只精确到行，且只针对业务代码，包括第三方模块 |
| eval-source-map         | eval，不生成 map 文件，在 js 中以 eval 方法的形式出现，但是复杂项目的提示是不全的 |

**最佳实践**

1. develop：cheap-module-eval-source-map，提示比较全，打包速度快
2. production：cheap-module-source-map，提示更全面，打包稍微慢

使用

```js
devtool:'cheap-module-eval-source-map'
```

## resolve

Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件。 Webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你也可以根据自己的需要修改默认的规则。[更多配置](https://webpack.docschina.org/configuration/resolve/)

+ `resolve.alias` 

  配置项通过别名来把原导入路径映射成一个新的导入路径。例如使用以下配置：

  ```js
  resolve:{
    alias:{
      @: './src'
    }
  }
  ```

+ Extensions

  在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。 `resolve.extensions` 用于配置在尝试过程中用到的后缀列表，默认是：

  ```js
  extensions: ['.js', '.json']
  ```

+ Modules

  告诉 webpack 解析模块时应该搜索的目录。

  ```js
  modules:['my_modules','node_modules']
  ```

## 配置babel

+ 安装：

  ```js
  yarn add babel-loader @babel/core
  ```

  ```js
  modules: {
    rules: [
      {
        test: /.js$/,
        use: ['babel-loder']
      }
    ]
  },
  ```

+ 语法转换

  ```js
  yarn add @babel/preset-env -D
  ```

  ```js
  modules: {
    rules: [
      {
        test: /.js$/,
        use: ['babel-loder'],
        options:{
          "presets": ["@babel/preset-env"]
        }
      }
    ]
  },
  ```

+ 变量对象转换

  这个时候也只能对一些语法进行转换，比如 “箭头函数”，如果想要对 `Promise` 这些新的对象进行转换（准确来说，浏览器可能不支持新规范的的一些对象，所以需要单独封装这些方法，然后在全局注入），还需要这样

  ```js
  yarn add @babel/polyfill -D
  ```

  ```js
  // 在入口文件
  require("@babel/polyfill");
  
  // or
  import "@babel/polyfill";
  ```

  这个时候会默认全部转换，这样会增加很多兼容性代码，如果我们想按需引入：

  ```js
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader",
        options: {
          "presets": [["@babel/preset-env", {
            useBuiltIns: 'usage'
          }]]
        }
      }
    ]
  }
  ```

+ .babelrc（也可以通过下面这种方式使用babel）

  ```js
  {
      "presets": [
          "@babel/preset-env"
      ],
      "plugins": [
          [
              "@babel/plugin-proposal-decorators",
              {
                  "legacy": true
              }
          ],
          [
              "@babel/plugin-proposal-class-properties",
              {
                  "loose": true
              }
          ]
      ]
  }
  ```

  

## 安装 `html-webpack-plugin`

通过使用html模版来进行构建，更多属性请参考 [官方文档](https://github.com/jantimon/html-webpack-plugin)

```js
yarn add html-webpack-plugin -D
```

使用：

```js
plugins: [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html')
  })
],
```

## 安装 `clean-webpack-plugin`

清除上次打包的内容

```
yarn add clean-webpack-plugin -D
```

使用：

```js
plugins: [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html')
  }),
  new CleanWebpackPlugin()
],
```



