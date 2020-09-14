`React Hooks`在一定程度上解决了组件之间逻辑的复用问题，但实际上还远远不够。

在`vue`中，有一种作用于标签上的指令，我们暂且叫它[标签指令](https://v3.vuejs.org/guide/custom-directive.html)，它允许你在一些钩子函数上对模板局部的渲染做某些单独的处理。

`函数指令`不仅如此，它更加强大，它允许你对[Part](/#Part)的内容做进行像`webpack loader`那样的流水线处理，也可以对`gallop`本身的渲染流程进行覆盖，定义局部的自定义渲染器。

定义一个`函数指令`非常简单,通常是在`directive`api 中传入一个返回函数的函数，这个返回的函数可以通过参数获取当前的[Part](/#Part)的一切信息，以此来对局部的渲染实现各种定制化的需求。

```ts
import {
  directive,
  html,
  NodePart,
  ensurePartType,
  render
} from '@gallop/gallop'

const countPlusOne = directive((count: number) => (part) => {
  // to ensure this part is a NodePart, otherwise, gallop will prompt an error
  if (!ensurePartType(part, NodePart)) return

  console.log(part) // get current Part information
  /**
   * do something to part or view
   */
  part.setValue(count + 1) // use `setValue` api to call next execution
})

render(html`<div>${countPlusOne(1)}</div>`) // call countPlusOne ===> render 2
```
