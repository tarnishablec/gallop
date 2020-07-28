`gallop`中的组件大致分为两种：`无状态组件`和`有状态组件`

- `无状态组件`或者称为`函数组件`说白了就是一个返回[模板](/#Template)的**函数**。

  这个函数等待被调用，然后被渲染到指定的地方。**没有任何的生命周期，也不能使用`Hooks`，但是依然可以使用[函数指令](/#Directives)**

  <iframe height="265" style="width: 100%;" scrolling="no" title="template-pure" src="https://codepen.io/tarnishablec/embed/preview/KKVYmXY?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/KKVYmXY'>template-pure</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

- `有状态组件`或者称为`复杂组件`是由[component()](/#defineComponent)函数定义的组件，通常是一个带有[ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot)的[自定义组件](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)。当然，`gallop`也暴露出了选项让组件不带`ShadowRoot`，但是这会让组件**失去**`样式隔离`和`插槽`等特性，一般来说是不建议的。当调用`component()`定义一个组件后，相当于在浏览器的[CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry)中定义了一个自定义组件，所以在调用这个组件的时候，只需要像原生 dom 元素那样在模板中写出 dom 标签即可。另外，你也可以在`无状态组件`中使用`复杂组件`。

  <iframe height="265" style="width: 100%;" scrolling="no" title="component-complex" src="https://codepen.io/tarnishablec/embed/preview/mdVgmxX?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/mdVgmxX'>component-complex</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

  ❗❗❗ **需要注意的是，在复杂组件中定义函数时，函数的第一个参数必须是一个对象或者不定义，这个参数对应了这个组件所接收的`props`，这一点和`React`一样。**
