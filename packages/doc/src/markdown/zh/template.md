gallop 以 `es6` 的 [标签模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 作为模板编写的基础，并得以在运行时确定模板内部动态和静态的代码部分，从而以较小的成本确定 `在哪、何时、如何` 去更新 `dom`。

```ts
import { html } from '@gallop/gallop'
const name = 'alex'
const template = html` <div>${name}</div> `
```

与其他基于 `虚拟dom` 的框架不同，`gallop`提倡 `所写即所得`，你在模板里写的每一个 `dom节点` 都会被渲染出来，同时也 `只会` 渲染出你写出来的 `dom结构`，这么做可以非常有效地让 `dom层级` 变得清晰。具体来说，在 `React` 和 `Vue` 里的 `抽象组件` 在 `gallop` 里并不提倡，`gallop` 提供了远比抽象组件更强大且更易扩展的方式 (详情请查看 [函数指令](/#))。
