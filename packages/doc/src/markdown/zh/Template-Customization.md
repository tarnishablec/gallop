在`gallop`的[模板](/#template)中可以动态的渲染其他模板，就像在`JSX`中传入另一个`JSX`一样。但是不同于`JSX`这种预编译的模板语言，`gallop`的模板编译是运行时的，并且开销极小，从而具备了相当高的灵活性和性能。

简单来说，`gallop`会解析所有类型为[HTMLClip](/#HTMLClip)的对象，并会把它渲染出来。`HTMLClip`就像是`gallop`中的一个约定，一个规范，你可以为一个[HTMLClip](/#HTMLClip)对象实例添加额外的字段信息，或者您可以继承[HTMLClip](/#HTMLClip)类，并传入这个子类的实例。

`gallop`中内置了一个[html](/#html)模板字符串标签，而且就像在上文[模板](/#template)中所说，[html](/#html)并不是必须的，你可以自己扩展额外的标签，只要它返回的是一个符合规范的`HTMlClip`，`gallop`就能进行渲染。

似乎有点绕，但是没关系，在内置的[keepalive](/#keepalive)实现中，就很好的利用了上述的几个特性，不妨直接看下源码。

```ts
const __key__ = Symbol('alive')

export const alive =
  (key: Key) =>
  (strs: TemplateStringsArray, ...vals: unknown[]) => {
    const clip = html(strs, ...vals) // html标签也可以像函数一样直接调用
    Reflect.set(clip, __key__, key)
    return clip
  }
```

在上面的 🍉 代码中，我们定义了一个`alive`模板字符串标签工厂，这个工厂函数传入一个参数可以返回一个模板字符串的标签函数，这个返回的函数我们暂且叫他**标签函数**，实际上**标签函数**就和我们的[html](/#html)标签差不多了，但是这里，在这个**标签函数**中，我们为将要返回的`clip`，也就是`HTMLClip`的实例，添加一个`__key__`的字段，这就为我们的函数指令打开了一个**“后门”**，所以在我们的函数指令中，只要鉴别出当前传入的模板中是否带有这个`__key__`，如果是，那么我们的函数指令就可以对其进行特殊处理。

然后当我们使用这个`alive`时，我们只需要像这样：

```ts
const template = alive('hello')`<div>alive!<div>`
```

这个`template`将会是一个带有`__key__ = "hello"`元信息的[HTMLClip](/#HTMLClip)模板。
