在`gallop`中没有`虚拟dom(vdom)`，所有的 dom 更新都是精准、直接且高效的，但这也带来了`gallop`的局限性。

在跨平台方面，`gallop`并不能像其他基于`vdom`的框架那样可以利用`vdom`进行跨平台渲染。
但是你仍然可以利用例如`PWA`、`WebView`等技术进行跨平台。

另外在服务器端渲染`Shadowdom`上，社区目前还没有一个非常完美的解决方案，但或许你可以参考一下[my-stab-at-rendering-shadow-dom-server-side](https://www.petergoes.nl/blog/my-stab-at-rendering-shadow-dom-server-side/)。
