---
title: 装饰器模式
date: 2021-01-02
tags:
 - 设计模式
categories: 
 - computer
---

JavaScript的装饰器（Decorator）是ES7提案的，到目前为止，还属于提案阶段，所以你要在项目中使用Decorator，需要借助babel来进行编译。

在项目的.babelrc中添加：

```javascript
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
```

如果你是vscode编辑器的话，为了不出现红色的波浪线警告⚠️，你或许可以在`jsconfig.json` 或者 `tsconfig,json`中添加以下配置：

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

首先讲讲装饰器的概念，装饰器是在不影响类本身的情况下对类或者类方法进行补充。例如：

+ 为类添加静态属性和实例属性
+ 为类方法或属性添加修饰符
+ 。。。

总而言之，装饰器的主要作用就是为了在不修改类本身的情况下，给类增加或者修改新的功能。

## 类的装饰

给类添加静态属性

```js
function dec(target) {
  //此target代表被装饰的类
    target.myName = 'kweku'
}

@dec
class MyClass {
    constructor() {
        console.log(`hello ${this.name}`)
    }
}

console.log(MyClass.myName); // kweku
```

上面这段代码等同于

```js
function dec(target) {
    target.myName = 'kweku'
}

class MyClass {
    constructor() {
        console.log(`hello ${this.name}`)
    }
}
MyClass = dec(MyClass) || MyClass
```



给类添加实例属性

```js
function dec(name) {
  //如果需要添加参数，直接包一层函数即可，内层返回一个function
    return function (target) {
        target.prototype.name = name
    }
}

@dec('kweku')
class MyClass {
    constructor() {
        console.log(`hello ${this.name}`)
    }
}

const cls = new MyClass() // hello kweku 
```

## 方法的装饰

```js
function dec(target, name, descriptor) {
    //被装饰的类
    //被装饰的类方法名
    //修饰符 默认为
    // {
    //   value: specifiedFunction,
    //   enumerable: false,
    //   configurable: true,
    //   writable: true
    // };
    descriptor.writable = false
    return descriptor
}

class MyClass {
    constructor() {
        console.log(`hello decorator`)
    }
    @dec
    printCity(city) {
        console.log(city);
    }
}

let cls = new MyClass()
cls.printCity('chengdu')

```

等同于

```js
Object.defineProperty(MyClass.prototype, 'printCity', dec);
```

## 为什么不能用于装饰函数

因为函数存在变量提升

```js
var counter = 0;

var add = function () {
  counter++;
};

@add
function foo() {
}
```

实际上

```js
var counter;
var add;

@add
function foo() {
}

counter = 0;

add = function () {
  counter++;
};
```

总之，由于存在函数提升，使得装饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。