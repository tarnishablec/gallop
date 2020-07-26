gallop 以 `es6` 的 [标签模板字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 作为模板编写的基础，并得以在运行时确定模板内部动态和静态的代码部分，从而以较小的成本确定 `在哪、何时、如何` 去更新 `dom`，这同样借鉴了`Lit-html`。另外，在`gallop`的模板中**没有根节点必须只有一个的限制**。

🔌 _幸运的是，你不必担心在模板字符串中书写`html`会很麻烦，`vscode`社区已经有很好的插件支持，我个人推荐的方法是在`vscode`中安装`lit-html`和`vscode-styled-components`插件，然后设置`vscode`的`.ts`文件解析规则为`typescript-react`，也许未来会开发自己的插件。_

<iframe height="265" style="width: 100%;" scrolling="no" title="template-start" src="https://codepen.io/tarnishablec/embed/KKVYaeN?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tarnishablec/pen/KKVYaeN'>template-start</a> by tarnishablec
  (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

与其他基于`虚拟dom`的框架不同，`gallop`提倡**所写即所得**，你在模板里写的每一个 `dom节点`都会被渲染出来，同时也**只会**渲染出你写出来的`dom结构`，这么做可以非常有效地让`dom层级`变得清晰。具体来说，`React`和`Vue`里的`抽象组件`在`gallop`里并**不提倡**，`gallop`提供了远比抽象组件更强大且更易扩展的方式 (详情请见 [函数指令](/#directives))。

`gallop` 只额外定义了三种简单的作用于 dom 标签上的模板语法

- `@` 表示 dom 元素绑定了一个事件，可以是原生的 dom 事件或者是 [自定义事件](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)。(详情请见 [事件](/#event))

  <iframe height="300" style="width: 100%;" scrolling="no" title="template-event" src="https://codepen.io/tarnishablec/embed/abdxpea?height=300&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/abdxpea'>template-event</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

- `:` 表示为 dom 元素绑定一个`prop`。这意味着这个 dom 元素一定是个调用`gallop`的`component`方法定义出的`ReactiveElement`。和`Vue`不一样的是，不管绑定对象的值是静态的或是动态的，都需要在`prop`名字之前指定`:`，因为`gallop`在模板解析时是以`dom attribute`前是否加`:`来判断这是否是一个`prop`。同时不能用`:`去绑定`attribute`、`class`、`style`、`value`，取而代之需要用到下面的`.`。

  <iframe height="320" style="width: 100%;" scrolling="no" title="template-prop" src="https://codepen.io/tarnishablec/embed/jOWRBOm?height=320&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tarnishablec/pen/jOWRBOm'>template-prop</a> by tarnishablec
  (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

- `.` 表示为 dom 元素绑定一个原生的`attribute`或`style`或`class`或`value`。当绑定的对象是`value`时，`gallop`会直接对这个 dom 原生的属性`value`设置值，这意味着可以通过此来实现数据的**双向绑定**。**另外值得一提的是，`gallop`支持动态绑定行内样式的做法，但是`gallop`也内置了更好的解决方案，通过`useStyle()`来更加高效的绑定动态样式，所以大部分情况下，我并不提倡使用`.style`动态绑定。**

  <iframe height="265" style="width: 100%;" scrolling="no" title="template-attr" src="https://codepen.io/tarnishablec/embed/QWyPpEg?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/QWyPpEg'>template-attr</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

❗❗❗ **需要注意的是，每次在 dom 标签里进行绑定时，都必须要在 `${}` 外面带上引号 `""`，否则会引发严重的编译错误，可能会让浏览器陷入死循环**

_从整体上来看，`gallop`的模板编写方式更加贴近`React`的`JSX`，同时`gallop`不希望引入过多的模板语法，不希望依靠 dom 标签做过多的逻辑处理。_

- 条件渲染

  <iframe height="265" style="width: 100%;" scrolling="no" title="template-if" src="https://codepen.io/tarnishablec/embed/WNrWjMP?height=265&theme-id=dark&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/WNrWjMP'>template-if</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>

- 列表渲染

  `gallop`中不支持像`React`中那样的通过`map`来进行列表渲染。取而代之，内置了一个[repeat](/#repeat)指令。和`vue`一样，`gallop`借鉴了[snabbdom](https://github.com/snabbdom/snabbdom)的`Array Diff算法`，使用`key`来优化列表变更时的 dom 更新。
