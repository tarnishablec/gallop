尝试 gallop 最简单的方法就是使用`npm/yarn`安装`@gallop/gallop`。

```shell
yarn add @gallop/gallop
```

```ts
import { html, render } from '@gallop/gallop' // 仅引入所需要的api以充分利用打包工具的 treeshaking 特性

render(html` <div>Hello Gallop!</div> `)
```

它就像是一个普通的`npm`库一样，甚至更小，在开启`gzip`的情况全部引入下只有`5KB`大小。

或者通过`cdn`直接引入

```html
<!-- umd -->
<script src="https://unpkg.com/@gallop/gallop"></script>

或者

<!-- esm -->
<script
  type="module"
  src="https://unpkg.com/@gallop/gallop@latest/dist/index.esm.js"
></script>
<script
  type="module"
  src="https://unpkg.com/@gallop/gallop@latest/dist/index.esm.min.js"
></script>
```
