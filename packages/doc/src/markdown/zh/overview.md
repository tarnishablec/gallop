与其说 `gallop` 是一个用于构建用户界面的框架，不如说它只是一个工具库。

`gallop` 充分利用 [web-components](https://developer.mozilla.org/docs/Web/Web_Components) 作为组件化基础，而后做了一点小小的工作，让所有的组件兼具了声明式和响应式的能力， 并借鉴了许多其他前端 `MVVM` 框架的设计理念之后把它们结合到一起(由衷地感谢 `React` , `Vue` , `Lit-html`)，让开发变得无比的便捷和直观。同时，利用浏览器的 `shadowdom` 标准，`gallop` 天然支持`样式隔离`，`插槽 <slot>` 等特性。

在 `gallop` 中高效地编写组件只需要原生的 `JavaScript/TypeScript`，无需 `JSX` 或者引入其他的预编译库，更不会污染全局，这让 `gallop` 能以最小的成本为任何框架的 web 项目提供出色的组件。当然，当你把 `gallop` 与现有的社区库和工具链组合起来时，`gallop` 也完全能够充分利用它们高效地驱动 web `单页应用(SPA)`，`多页应用(MPA)` 甚至是 `微前端应用`。

```html
此文档假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。
如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！
之前有其它框架的使用经验会有帮助，但这不是必需的
```
