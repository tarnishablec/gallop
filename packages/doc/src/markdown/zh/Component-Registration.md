在`gallop`中，注册组件只需要调用一个[component](/#)方法。这个方法接受三个参数。它们分别是 `组件名`，`渲染函数`，`注册选项`。

```ts
import { component, html } from '@gallop/gallop'

component(
  'hello-world', // component name
  ({ name, age }: { name: string; age: number } /* props */) => {
    /* render function */
    return html`...`
  },
  {
    shadow: true
    /* component options */
  }
)
```

- 组件名

  在注册一个组件的时候，我们始终需要给它一个名字。这个名字必须遵循[W3C 规范](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)中的自定义组件名（字母全小写且必须包含一个连字符）。

- 渲染函数

  渲染函数必须返回一个[HTMLClip](/#HTMLClip)，这个函数的第一个参数可以传入一个对象，这个对象就对应了组件的`props`，这和`react`里的函数式组件大概一致。

- 注册选项(可选)

  这个参数暴露了一些选项，假如你想要注册不附带`shadowroot`的组件，可以将`shadow`设置为`false`，默认为`true`。
