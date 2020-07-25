gallop 以 `es6` 的 [标签模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 作为模板编写的基础，并得以在运行时确定模板内部动态和静态的代码部分，从而以较小的成本确定 `在哪、何时、如何` 去更新 `dom`。

```ts
import { html } from '@gallop/gallop'
const name = 'alex'
const template = html` <div>${name}</div> `
```

与其他基于 `虚拟dom` 的框架不同，`gallop`提倡 `所写即所得`，你在模板里写的每一个 `dom节点` 都会被渲染出来，同时也 `只会` 渲染出你写出来的 `dom结构`，这么做可以非常有效地让 `dom层级` 变得清晰。具体来说，在 `React` 和 `Vue` 里的 `抽象组件` 在 `gallop` 里并不提倡，`gallop` 提供了远比抽象组件更强大且更易扩展的方式 (详情请见 [函数指令](/#))。

`gallop` 只额外定义了三种简单的作用于 dom 标签上的模板语法

- `@` 表示 dom 元素绑定了一个事件，可以是原生的 dom 事件或者是 [自定义事件](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)。(详情请见 [事件](/#event))

```ts
const template = html` <button
  @click="${(e: Event) => {
    // 在typescript中需要指定Event类型
    console.log(e.target)
    console.log('clicked!')
  }}"
  @some-custom-event="${(e: CustomEventInit) => {
    // 自定义事件类型
    console.log(e.target)
  }}"
>
  click me!
</button>`
```

- `:` 表示为 dom 元素绑定一个`prop`。这意味着这个 dom 元素一定是个调用`gallop`的`component`方法定义出的`ReactiveElement`。和`Vue`不一样的是，不管绑定对象的值是静态的或是动态的，都需要在`prop`名字之前指定`:`，因为`gallop`在模板解析时是以`dom attribute`前是否加`:`来判断这是否是一个`prop`。同时不能用`:`去绑定`attribute`、`class`、`style`、`value`，取而代之需要用到下面的`.`。

```ts
/**
 * 定义函数，类似于 Vue 中的 defineComponent
 */
component(
  'component-a', // 组件的名称
  (
    { name, age }: { name?: string; age?: number } = {} // 渲染函数的props
  ) =>
    html`<div>${name}</div>
      <div>${age}</div>`
)

const template = html` <component-a :name="hello" :age="${25}"></component-a>`
```

- `.` 表示为 dom 元素绑定一个原生的`attribute`或`style`或`class`或`value`。当绑定的对象是`value`时，`gallop`会直接对这个 dom 原生的属性`value`设置值，这意味着可以通过此来实现数据的**双向绑定**。**另外值得一提的是，`gallop`支持动态绑定行内样式的做法，但是`gallop`也内置了更好的解决方案，通过`useStyle()`来更加高效的绑定动态样式，所以大部分情况下，我并不提倡使用`.style`动态绑定。**

```ts
const value = 1
const color = 'red'
const disable = true
const active = true
const template = html` <input
  .value="${value}"
  .disabled="${disable}"
  .class="${active ? 'active' : ''}"
  .style="${`backgroud: ${color}`}"
/>` // ❗ 请注意 .style="background: ${color}" 这样的写法是不允许的
```

> ❗❗❗ **需要注意的是，每次在 dom 标签里进行绑定时，都要在 `${}` 外面带上引号 `""`，否则会引发严重的编译错误，可能会让浏览器陷入死循环**

从整体上来看，`gallop`的模板编写方式更加贴近`React`的`JSX`，`gallop`不希望引入过多的语法，不希望依靠 dom 标签做过多的逻辑处理。
