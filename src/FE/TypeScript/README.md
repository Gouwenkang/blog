---
title: TypeScript
date: 2020-12-09
tags:
 - ts
categories: 
 - FE
---

## 目录

### 接口基础

1. 对象形状的描述
2. 对类的一部分的抽象

```ts
interface Person{
  readonly id:number; //只读属性
  name:string;
  age:number;
	email?:string; //可选属性
  [propName:string]:any //任意属性
}

let person:Person = {
  id:2020,
  name:'kweku',
  age:21,
  email:'631199793@qq.com',
  city:'北京'
}
```

### 数组注解

**普通方式**

`元素类型[]`

```ts
let arr:number[] = [1,2,3]
```

**泛型方式**

`Array<元素类型>`

```ts
let arr:Array<number> = [1,2,3]
```

**interface**

```ts
interface List{
  [index:number]:number
}
let list:List = [1,2,3,4]
```

### 函数注解

**函数声明**

```ts
function test1(a: number, b: number): number {
    return a + b
}
//可选参数 必须放在参数之后
function test1(a: number, b?: number): number {
    return a + b
}
//默认值 
function test1(a: number, b: number = 123): number {
    return a + b
}
//剩余参数
function test1(a: number, ...restOfName: string[]): number {
    return a
}
```

**函数表达式**

```ts
let test2: (a: number, b: number) => number = function (a, b) {
    return a + b
}
```

### 函数重载

方法是为同一个函数提供多个函数类型定义来进行函数重载。 编译器会根据这个列表去处理函数的调用。

```ts
function reverse(x: string): string;
function reverse(x: number): number;
function reverse(x: string | number) {
    if (typeof x === 'string') {
        return x.split('').reverse().join("")
    } else if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(""))
    }
}
```

### 接口&函数类型注解

因为函数实际上也是对象，所以也可以使用接口来注解函数

```ts
interface Func {
    (a: number, b: number): number
}
//or
type Func = (a:number,b:number)=>number
let func: Func = function (a: number, b: number): number {
    return a + b
}

```

### 接口&类类型注解

接口也可以对类的一部分的抽象

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void
}

interface WatchDateInterface {
    watchTime(): void
}

class clock implements ClockInterface, WatchDateInterface {
    currentTime = new Date()
    setTime() {

    }
    watchTime() {

    }
}
```

### 类静态部分&实例部分

constructor存在于类的静态部分，所以不在检查范围内

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void
}

interface ClockConstroctor {
    new(n: number, m: number): any
}

class Clock implements ClockInterface {
    currentTime = new Date()
    constructor(n: number, m: number) {
        console.log(m + n);
    }
    setTime() {

    }
}

function ClockConstroctor(c: ClockConstroctor, n: number, m: number) {
    return new c(n, m)
}

ClockConstroctor(Clock, 12, 12)
```

### 继承接口

```ts
interface Shape {
    color: string;
}
interface Square extends Shape {
    slideLength: number
}

let square = { } as Square

square.color = 'red'
square.slideLength = 12
```

### 接口混合类型

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void
}

function getCounter(): Counter {
    let couter = function(start:number){ } as Counter
    couter.interval = 10
    couter.reset = function(){}
    return couter
}
```

### 接口继承类

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}
interface PointInterface {
    x: number;
    y: number;
}
//一般不这样使用接口继承类
interface Point3D extends Point{
    z:number
}
//or
interface Point3D extends PointInterface{
    z: number;
}

```

### 泛型

```ts
function identity<T>(number:T):T{
    return number
}

console.log(identity('1'));

```

### 泛型类型

```ts

function identity<T>(number: T): T {
    return number
}

let a: <T>(a: T) => T = identity
```

对象字面量定义泛型

```ts

function identity<T>(number: T): T {
    return number
}

let a: <T>(a: T) => T = identity
//对象字面量定义泛型
let b: { <T>(a: T): T } = identity
```

### 泛型接口

因为对象可以用接口来修饰，所以也可以通过接口来定义泛型

```ts

function identity<T>(number: T): T {
    return number
}

let a: <T>(a: T) => T = identity
//对象字面量定义泛型
let b: { <T>(a: T): T } = identity

interface IdentityInterface {
    <T>(a: T): T
}

let c:IdentityInterface = identity

```

or

```ts

function identity<T>(number: T): T {
    return number
}

let a: <T>(a: T) => T = identity
//对象字面量定义泛型
let b: { <T>(a: T): T } = identity

interface IdentityInterface<T> {
    (a: T): T
}

let c: IdentityInterface<number> = identity
```

### 泛型类

```ts
class TestClass<T>{
    value: T;
    add: (x: T, y: T) => T
}

let test = new TestClass<number>()
test.value = 1
test.add = function (x, y) {
    return x + y
}
```

### 约束泛型

约束x中必须含有length属性

```ts
interface LengthInterface {
    length: number
}
function getWidth<T extends LengthInterface>(x: T): number {
    return x.length
}
```