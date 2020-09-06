在`gallop`中可以高效地书写安全、干净的样式。

你可以直接在[模板](/#Template)的`<style>`标签里书写**静态内联样式**。

```ts
const template = html`
  <div class="test">text content</div>
  <style>
    .test {
      color: red;
    }
  </style>
`
```

❗❗❗`gallop`并**不支持**在[模板](/#Template)的`<style>`标签里书写**动态样式**，也**不支持**将`<style>`标签写在模板的**中间**。例如下面的模板会在运行时报错。

```ts
const color = 'red'
const template1 = html`
  <div class="test">text content</div>
  <style>
    .test {
      color: ${color}; /** 编译错误 */
    }
  </style>
`
///
const template2 = html`
  <div class="test">text content</div>
  <style>
    .test {
      color: red; /** 编译错误 */
    }
  </style>
  <div>${color}</div>
`
```

依托于`Shadowdom`，在开启了`shadowroot`的**复杂组件**里生效的样式会自带**样式隔离**。

在**复杂组件**中，`gallop`提供了一个[useStyle()](/#useStyle)`Hook`。通过`useStyle`，你可以避免使用丑陋的行内样式来实现动态样式，也可以和社区的样式预编译库配合，为组件注入`sass`或`less`，同时不破坏样式的隔离性。

```ts
// TestStyle.ts
import { component, html, useStyle, css, useState } from '@gallop/gallop'
import style from '!!css-loader!sass-loader!./index.scss'

component(`test-style`, () => {
  const [{ size }] = useState({ size: 2 })

  useStyle(
    () => css`
      font-size: ${size}rem;
      ${style.toString()}
    `,
    [size]
  )

  return html` <div class="test">Hello Style!</div> ` // render `2rem` and red text
})
```

```scss
// index.scss
.test {
  color: red;
}
```

上面的代码用到了两个常用的用于`sass`处理的`webpack loader`，如果你不太了解`webpack`的`loader`，请阅读[sass-loader](https://webpack.js.org/loaders/sass-loader/)/[css-loader](https://webpack.js.org/loaders/css-loader/)。

但是上述的方法并非所有情况下的最佳实践，如果你想进一步了解具体如何处理，也可以阅读此文档的[源码](https://github.com/tarnishablec/gallop/blob/master/packages/doc/src/components/MarkDown/index.ts)。
