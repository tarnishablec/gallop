在`gallop`中，所有的视图更新都是由一个个[响应式组件](/#ReactiveElement)自己来管理。为了方便起见，以下的`响应式组件`我们统称为`组件`。

- 更新请求

  在一般的常规组件中，每次组件的更新都由一次`state`或者`props`的变更所触发，如果组件关联了`context`，一样也会触发更新。实质上，这三种情况都只是对组件实例发起了一次`更新请求`[requestUpdate](/#requestUpdate)，这个请求并不会马上被执行，只是提醒这个组件实例，`“你需要被更新了！”`，然后组件实例会把自己丢进一个**异步更新队列**里等待真正的更新执行[dispatchUpdate](/#dispatchUpdate)。

  另外，并不只有上述的三种情况可以对组件实例发起`更新请求`，你可以手动地去发起`更新请求`，甚至在你的业务代码里，你只需要调用组件实例上的[requestUpdate()](/#requestUpdate)方法，轻松加愉快，实际在`gallop`内部`更新请求`的发起，也只是简单地调用了这个方法，这在你对`gallop`进行扩展时非常有用。

- 更新执行

  我们再说说更新执行，这非常地简单，还记得在[组件基础](/#Component)里，我们调用一个[component](/#defineComponent)方法注册一个组件，这个方法地第二个入参是一个返回[模板](/#Template)的函数，所以在我们真正执行更新时实际上就是对这个函数传入一个参数`props`并调用一遍，计算出我们想要的结果，然后依靠[模板](/#Template)的`动静分离`特性，去准确地更新视图。

- 异步更新队列

  假设我们有这么一个组件，他有一个`state`，我们在一个循环里`同步地`对状态改变了 10000 次，这是否意味着我们要对这个组件做`更新执行`10000 次呢，显然这是不需要的，我们只需要看到最后那一次更新的视图结果就够了。`异步更新队列`就是为了**去除不必要的计算**而存在的，这个队列听上去非常的棒，实际上它在`gallop`里的实现也是**非常非常的简单**，如果有兴趣可以阅读下[源码](https://github.com/tarnishablec/gallop/blob/master/packages/gallop/src/loop.ts)，在这里不做赘述。在下面的例子里，你可以看到在每一次对`state`进行 10000 遍更新时，实际只执行了一次模板的计算。

  <iframe height="465" style="width: 100%;" scrolling="no" title="Component-Update" src="https://codepen.io/tarnishablec/embed/preview/qBZVbzz?height=265&theme-id=dark&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/tarnishablec/pen/qBZVbzz'>Component-Update</a> by tarnishablec
    (<a href='https://codepen.io/tarnishablec'>@tarnishablec</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
