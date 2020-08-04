在`gallop`中`Hooks`的设计大部分借鉴了`React Hooks`。但是与`React`不同，`gallop`的整个运行时机制都是根据`Hooks`的设计量身定制的，也就是说没有`class api`之类的写法，但是`gallop`任然暴露了很多底层的`api`以供扩展。

关于`Hooks`的优势在这里不再赘述，如果想了解`Hooks`的设计动机，请阅读[React Hooks](https://react.docschina.org/docs/hooks-intro.html#motivation)。

`gallop`内置了一些`Hooks`，它们大致延用了`React`中同名 Api 的设计，例如`useEffect`、`useMemo`，有的做了一些修改。

- [useState](/#useState)
- [useEffect](/#useEffect)
- [useMemo](/#useMemo)
- [useContext](/#useContext)
- [useStyle](/#useStyle)
- [useCache](/#useCache)
- [useDepends](/#useDepends)
