`gallop`中的组件大致分为两种：`无状态组件`和`有状态组件`

- `无状态组件`或者称为`PureComponent`说白了就是一个返回`模板(HTMLClip)`的**函数**。

  这个函数等待被调用，然后被渲染到指定的地方。**没有任何的生命周期，也不能使用`Hooks`，但是依然可以使用`directives`**

  ```ts
  export const pure1 = (name: string) => html`<div>${name}</div>`
  export const pure2 = () => html`<div>${pure1('hello')}</div>`
  export const pure3 = () => html`<div>${pure2()}</div>`
  ```

- `有状态组件`或者称为`复杂组件`是由`component()`函数定义的组件，通常是一个带有[ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)的[自定义组件](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)。当然，`gallop`也暴露出了选项让组件不带`ShadowRoot`，但是这会让组件**失去**`样式隔离`和`插槽`等特性，一般来说是不建议的。当调用`component()`定义一个组件后，相当于在浏览器的[CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry)中定义了一个自定义组件，所以在调用这个组件的时候，只需要像原生 dom 元素那样在模板中写出 dom 标签即可。另外，你也可以在`无状态组件`中使用`复杂组件`。

  ```ts
  import { component, html } from '@gallop/gallop'

  /**
   * 这个组件有一个 name prop和一个 age prop, age prop的默认值是10
   */
  component(`test-a`, ({ name, age = 10 }: { name: string; age?: number }) => {
    return html` <div>${name}</div> `
  })

  export const pure = () =>
    html`<test-a :name="${'evan' + 'you'}"></test-a>
      <div>great</div>`
  ```

  ❗❗❗ **需要注意的是，在复杂组件中定义函数时，函数的第一个参数必须是一个对象或者不定义，这个参数对应了这个组件所接收的`props`，这一点和`React`一样。**
