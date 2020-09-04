在`gallop`中，注册组件只需要调用一个[component](/#)方法。这个方法接受三个参数。它们分别是 `组件名`，`渲染函数`，`注册选项`。

```ts
import { component, html } from '@gallop/gallop'

component(
  'component-name', // component-name
  () => {
    // render function
    return html`...`
  },
  {
    /* component options */
  }
)
```

- 组件名

  在注册一个组件的时候，我们始终需要给它一个名字。这个名字必须遵循[W3C 规范](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)中的自定义组件名（字母全小写且必须包含一个连字符）。

- 渲染函数

  这个函数必须返回一个[HTMLClip](/#HTMLClip)。
