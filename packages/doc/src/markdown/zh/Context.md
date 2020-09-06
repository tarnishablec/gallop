一直以来，在写`vue`或者`react`的项目时，我都为组件之间的通信所困惑，困惑之处在于，为什么**一个看上去如此简单的事情被设计得如此复杂**。

我们不妨从零开始思考，什么是**应用的状态管理**？

在最符合人的直觉的情况里，**一个共享的状态**无非是一块内存里的数据，当这个内存被改变时，会通知所有和这块内存关联的视图进行更新。是的，就是如此简单，本质上和组件内部的状态更新没有太大的区别，而且这看上去好像就是一个**观察者模式**就能搞定的事，事实就是如此，根据这种思想，`gallop`内置了一个状态管理的方案：[Context](/#)，并且通过一个内置的`Hook`[useContext](/#useContext)来让`context`与组件建立关联，每当`context`的数据发生变更时，`context`会自动触发所关联的组件的更新。

<iframe height="474" style="width: 100%;" scrolling="no" title="Context" src="https://codepen.io/tarnishablec/embed/preview/PoNjyVV?height=474&theme-id=dark&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/tarnishablec/pen/PoNjyVV'>Context</a> by tarnishablec
  (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
