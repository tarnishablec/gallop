`gallop`并没有像`React`那样使用[合成事件](https://react.docschina.org/docs/events.html)。在[模板](/#Template)中绑定的所有事件都是原生的事件或者是[自定义事件](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)。

稍微要注意的点是，在 dom 中添加太多[EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventListener)会导致页面的性能下降。特别是在进行[列表渲染](/#repeat)时，在渲染的每一项上绑定事件是及其不推荐的，尽管这很方便，但是会极大的降低性能，这一点和在`Vue`里一样。一般在这种情况下，更好的实践是使用[事件委托](https://javascript.info/event-delegation)。
