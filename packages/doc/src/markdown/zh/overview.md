与其说`gallop`是一个用于构建用户界面的框架，不如说它只是一个工具库。

`gallop`利用[Web Components](https://developer.mozilla.org/docs/Web/Web_Components)作为组件化基础，并借鉴了`React Hooks`的设计思想，让编写**声明式**、**响应式**、**函数式**的组件变得非常简单。同时，托[shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)的福，`gallop`天然支持`样式隔离`，`插槽 <slot>`等特性。

`gallop`的高度可扩展性体现在它的大部分的特性都像插件一样，例如`列表渲染`，`动态组件`，`传送门`，`异步渲染`等，都遵循`单一职责原则`。当内置的这些特性没有被使用时，打包器的`tree-shaking`在打包时会将这些代码剔除，取而代之，你可以自己实现这些特性或者扩展新的特性然后在`gallop`中使用，这都归功于`Lit-html`[函数指令](/#)的设计思想。

`gallop`的响应式核心借鉴了`Vue3`，相比于`React`所提倡的`Immutable`，`Mutable Proxy`的设计不仅直接从根本上避免了`React Hooks`中臭名昭著的**闭包问题**，而且让数据的传递与组件的通信变得灵活而高效。

在`gallop`中高效地编写组件只需要原生的`JavaScript/TypeScript`，无需`JSX`或者引入其他的预编译库，更不会污染全局，这让`gallop`能以最小的成本为任何框架的 web 项目提供出色的组件。当然，当你把`gallop`与现有的社区库和工具链组合起来时，`gallop`也完全能够充分利用它们高效地驱动 web`单页应用(SPA)`、`多页应用(MPA)`甚至是`微前端应用`。

> `gallop`的原则只有一个，就是让一切变得**简单**。

```html
此文档假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。
如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！
之前有其它框架的使用经验会有帮助，但这不是必需的
```

🎮 _在文档的左上角提供了一个沙盒，你可以尽情在里面体验`gallop`的编程方式。_

👴 `gallop`不会考虑在过时浏览器上的兼容性，例如`ie`和`safari(新时代的ie)`，`safari`在 2020 年还不支持[正则的反向查找](https://stackoverflow.com/questions/58460501/js-regex-lookbehind-not-working-in-firefox-and-safari)，这导致`gallop`会在`safari`中模板解析失败。
