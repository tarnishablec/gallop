在[模板](/#Template)中，每一个动态的部分都被称之为`部件`或`Part`。

在一些依赖`虚拟dom`的框架中，为了准确地找出需要更新的节点需要对`虚拟dom`树进行`diff`运算，这在一定程度上浪费了计算资源。

在`gallop`中没有`虚拟dom`的包袱，在模板被第一次渲染时，`gallop`会高效地收集所有的`Part`，在每次视图需要更新时，会根据这些`Part`准确地找出需要改变的`dom`结构。

在`gallop`中定义了的几种基本的`Part`类，它们分别对应了几种不同的模板语法，同时它们都接收不同类型的内容。

| Part      | Syntax | Accept Type | Example                                                                                                                      |
| --------- | :----: | :---------: | ---------------------------------------------------------------------------------------------------------------------------- |
| NodePart  | `节点` |  `unknown`  | <pre lang="ts" style="margin-bottom:0">html`<div>${...}</div>`</pre>                                                         |
| AttrPart  |  `.`   |  `string`   | <pre lang="ts" style="margin-bottom:0;background:rgba(27, 31, 35, 0.05)">html`<div .class="${...}"></div>`</pre>             |
| BoolPart  |  `?`   |  `boolean`  | <pre lang="ts" style="margin-bottom:0;background:rgba(27, 31, 35, 0.05)">html`<input ?required="${...}"></div>`</pre>        |
| PropPart  |  `:`   |  `unknown`  | <pre lang="ts" style="margin-bottom:0">html`<some-component :prop="${...}"></some-component>`</pre>                          |
| EventPart |  `@`   | `function`  | <pre lang="ts" style="margin-bottom:0;background:rgba(27, 31, 35, 0.05)">html`<button @click="${...}">button</button>`</pre> |

另外，所有的`Part`都可以接收一个`directive`，详情请见[函数指令](/#Directives)。

同时，你还可以通过`继承`来对基本`Part`进行增强，这一技巧一般会在[函数指令](/#Directives)里使用，例如在`列表渲染`的实现中，继承了`NodePart`的`ArrayPart`。
