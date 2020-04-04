# gallop

[![Coverage Status](https://coveralls.io/repos/github/tarnishablec/gallop/badge.svg?branch=master)](https://coveralls.io/github/tarnishablec/gallop?branch=master)

        yarn add @gallop/gallop

        https://unpkg.com/@gallop/gallop

## Features

- use template literals to auto detect dynamic & static code

- register reactive component in functional way

- support ```<slot>``` by web components, also named slot

- ```:``` to bind props of component<br>
  ```.``` to bind attributes / value / style<br>
  ```@``` to bind events, support ```@click.once.capture.passive``` like vue

- auto minimize update

- support web components and pure component

- built-in state management solution by ```createContext()```

- naturally support async component by ```import()```

- DONT need ```useRef()``` because you can directly access dom by ```this```

- for more detail, check packages/test-example or email me

## simple use case

```ts
import {
  createContext,
  useState,
  useEffect,
  render,
  html,
  UpdatableElement
} from '@gallop/gallop'

export let [data, context] = createContext({ initContext }) //context can be exported to another component

export const PureComponent = (prop: string) => html`<div>pure ${prop}</div>` //pure component with no any lifecycle

component('test-name', function (this: UpdatableElement, ...props: any[]) {
  let [state] = useState({ initState }) //dont need setX(), useState() return a proxy, and auto trigger rerender
  console.dir(this) //access dom directly by this

  useEffect(() => {
    console.dir(this) //this context can be pass by arrow function
    return () => {
      console.log(`disconnected callback`)
    }
  }, [state.a]) //trigger effect when depends changed, completely same as react useEffect()

  return html`
    <div>${state}</div>
    <div>${props}</div>
    <div>${data}</div>
    ${[1, 2, 3].map(
      (n) =>
        n % 2
          ? html`<div>${n}</div>`
          : PureComponent(
              'purename'
            ) /*use pure component by just simply calling function*/
    )}
    <slot>
      default slot context
    </slot>
    <button
      @click="${(e: Event) => {
        console.log(
          this
        ) /*you can still access this by arrow function in event*/
      }}"
    >
      click
    </button>
  `.useContext([context]) //you need to hook Context to this component by useContext(), different from react useContext()
})

render(html`
  <test-name :props="${someprop}">
    slot content
  </test-name>
`)
```

## TODO

- hooks  
  | | |
  |-|-|
  |useState() | ✅
  |useContext() | ✅
  |useEffect() | ✅
  |useMemo() | ❓

- router ⌛

- vscode syntax highlighting and intelliSense plugin

- dynamic scoped css by shadowdom

- scoped scss inject

- ui library ([zeit-design](https://zeit-style.now.sh/))

- time travel
