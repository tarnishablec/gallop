在`vue`或者`react`中获取真实 dom 需要通过`ref`，然而在`gallop`中，因为模板中所有的节点包括组件的实例都是真实 dom 元素，所以完全不需要`ref`。

为了获取组件内部的元素，首先你需要获取组件的实例，还记得在[组件注册](/#Component-Registration)中所需要传入的渲染函数吗，我们可以在这传入一个**非箭头函数**，在这个渲染函数的作用域里，[this](/#)就指向了**组件实例**本身，就像在`class`里一样。关于箭头函数和非箭头函数内`this`的指向问题，请自行查阅[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

另外在`typescript`里，你还可以通过指定`this`的类型，来获取类型检查和代码提示，详情请查看[this parameters](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)。

<iframe height="465" style="width: 100%;" scrolling="no" title="Access-Dom" src="https://codepen.io/tarnishablec/embed/preview/ZEWaRNd?height=265&theme-id=dark&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tarnishablec/pen/ZEWaRNd'>Access-Dom</a> by tarnishablec
  (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

上面的例子中，`ReactiveElement`是`gallop`暴露出的`响应式组件`的`接口类型`，你可以用其作为`this`的类型定义。在`ReactiveElement`接口中定义了一些函数，`queryRoot`是其中的一个，用于在组件内部检索 dom 节点，实际上是原生 DOM api[querySelector](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/querySelector)的一层封装，你可以用它来获取组件内任何的节点。

或许细心的你已经发现了，在上面的例子中，第二个 ✌`console.log`里并没有检索出`<div>`元素，而在第三个 👌 里却检索到了，这是由于在这个函数体中，模板还并没有被渲染，只有在渲染函数`return`出去后，dom 节点才会被渲染至组件内部中。而[useEffect](/#useEffect)有一个特性，它是**相对异步**的，就是**其内部的回调函数永远都在模板被渲染之后执行**。所以一般的最佳实践是在`useEffect`里去获取组件内部的 dom 元素。
