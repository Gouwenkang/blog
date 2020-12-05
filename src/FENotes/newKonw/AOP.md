---
title: AOP-面向切面的编程
date: 2020-12-03
tags:
 - AOP
 - 编程思想
categories: 
 - newKnow
---



## AOP是什么？

AOP（Aspect Oriented Programming）面向切面的编程，在程序中时常用到的某些程序步骤、阶段、片段抽离出来，与本身的程序逻辑隔离。

例如：Node中读取文件、获取数据、处理数据、重新写入文件。

1. 读取文件获取数据
2. 处理加工数据
3. 重新写回文件

读取与写入这两个程序片段就可以被抽离出来。

## 使用AOP有什么好处？

解决程序中的耦合问题，抽离和隔离出两个程序片段。

## 小试牛刀

现在有一个这样的场景，我们的输入输出的是固定的，然后中间过程是变化的，就可以使用AOP的编程思想将两边的过程抽离出来，比如下面这个例子：

```js
function Func(v){
    console.log(v);
}


Function.prototype.before = function(cb){
    var self = this
    return function(){
        cb.apply(self,arguments)
        self.apply(self,arguments)
    }
}

Function.prototype.after = function(cb){
    let self = this
    return function(){
        const result = self.apply(self,arguments)
        cb.apply(self,arguments)
    }
}

Func.before(()=>{
    console.log('--------------------');
}).after(()=>{
    console.log('++++++++++++++++++++');
})(123)

```

## 大展身手

 回到本文开头的场景，对一个文件进行修改，首先我们需要读取文件，然后修改文件，然后将修改的内容保存至文件，我们就可以通过AOP的思想来将读取和保存文件抽离出来。

我们现在这么做，通过`express` 创建一个新的项目，目录结构如下：

```
.
├── Function.js
├── app.js
├── node_modules
├── package.json
├── todoList.json
├── util.js
└── yarn.lock
```

 现在，我们就通过上面的AOP思想去对文件进行一系列的操作。

`app.js`

```js
const e = require('express');
const express = require('express')
const { fileOperation } = require('./util')

const app = express()

app.get('/remove', (res, req) => {
    const result = fileOperation((todoList) => {
        return todoList.filter(item => item.id !== 3)
    },"todoList.json")
    console.log(result);
    req.send('删除啦～')
})

app.listen(8000, function () {
    console.log('ok');
})
```

`util.js`

```js
const { readFileSync, read, writeFileSync, fchown } = require('fs')
const { resolve } = require('path')
require('./Function')

function readFile(path) {
    return readFileSync(resolve(__dirname, path), 'utf8')
}

function writeFile(path, data) {
    writeFileSync(resolve(__dirname, path), JSON.stringify(data))
}


function fileOperation(fn, path) {
    return fn.before(() => {
        return JSON.parse(readFile(path))
    }).after((data) => {
            writeFile(path, data)
            return data
        })()
}

module.exports = {
    fileOperation
}
```

`Function.js`

```js
Function.prototype.before = function (cb) {
    const self = this
    return function () {
        const res = cb.apply(self, arguments)
        return self.call(self, res)
    }
}
Function.prototype.after = function(cb){
    const self = this
    return function(){
        const res = self.apply(self,arguments)
        cb.call(self,res)
        return res
    }
}
```

`todoList.json`

```js
[
    {
        "name": "kweku",
        "id": 1
    },
    {
        "name": "kweku",
        "id": 2
    },
    {
        "name": "kweku",
        "id": 3
    },
    {
        "name": "kweku",
        "id": 4
    }
]
```

现在运行项目，就可以发现`todoList.json` 的文件内容被修改成功啦。

可以观察上面的代码，我们将获取文件内容和保存文件通过 `fileOperation` 封装了一遍，细看里面的逻辑和 `Function.js` 里面的逻辑还是很巧妙的。

## 总结

在前端领域里面，AOP的应用主要还是在页面埋点的场景比较多，其他的地方可能用得不是很多，不过这种编程思想很值得我们学习。