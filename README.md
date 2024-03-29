# gallop

[![Coverage Status](https://coveralls.io/repos/github/tarnishablec/gallop/badge.svg?branch=master)](https://coveralls.io/github/tarnishablec/gallop?branch=master)
[![Gitter](https://badges.gitter.im/gallopweb/community.svg)](https://gitter.im/gallopweb/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![npm version](https://badge.fury.io/js/%40gallop%2Fgallop.svg)](https://badge.fury.io/js/%40gallop%2Fgallop)

    yarn add @gallop/gallop

    https://unpkg.com/@gallop/gallop

    this framework is purely driven by personal interest

    you are extremely welcomed if you can help me to make gallop better

## Features

- gallop is `non-intrusive` so technically you can use it in any framework like Vue or react

- gallop is inspired by many frameworks such as `lit-html, Vue, react, cyclejs`

- use `template literals` to auto detect dynamic & static code

- register `reactive` component in functional way

- `react-hooks-like` development experience, even `much` better 🌝

- hooks

  |              |     |
  | ------------ | --- |
  | useState()   | ✅  |
  | useContext() | ✅  |
  | useEffect()  | ✅  |
  | useRef()     | ✅  |
  | useMemo()    | ✅  |
  | useStyle()   | ✅  |

- `directive function` design from `lit-html` give gallop super good extendiability

- directives

  |            |     |
  | ---------- | --- |
  | repeat()   | ✅  |
  | dynamic()  | ✅  |
  | suspense() | ✅  |
  | portal()   | ✅  |

- support `<slot>` by web components, also `named slot`

- `:` to bind props of component  
  `.` to bind attributes / value / style / class  
  `@` to bind events, support `@click.once.capture.passive` like Vue

- auto `minimize` update

- support `web components` and `pure component`

- built-in `state management` solution by `createContext()`

- naturally support async component by `import()`

- support `HOC`

- support `dynamic component` for complex component by built-in directive `dynamic()`

- ⚡⚡ enable `key diffing` in list rendering by built-in directive `repeat()`

- support `lazy load` and `fallback rendering` by built-in directive `suspense()`

- for more detail, check packages/sandbox or clone this project run `yarn run sand`

## Simple use case

```ts
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useStyle,
  render,
  repeat,
  suspense,
  html,
  css,
  ReactiveElement
} from '@gallop/gallop'

export const contenxt = createContext({ b: 2 }) //context can be exported to another component

export const PureComponent = (prop: string) => html`<div>pure ${prop}</div>` //pure component with no any lifecycle

component(
  'test-name',
  function (
    this: ReactiveElement, //this parameter: https://www.typescriptlang.org/docs/handbook/functions.html
    { name, age = 1 }: { name: string; age?: number }
  ) {
    let [state] = useState({ a: 1, color: 'red' }) //dont need setX(), useState() return a proxy, and auto trigger rerender, ⚠ you can only use useState() once in a component declaration
    console.dir(this) //access dom directly by this

    const memo = useMemo(() => state.a * 2, [state.a]) //just like react useMemo()

    useStyle(
      () =>
        css`
          div {
            background: ${state.color};
          }
        `,
      [state.color]
    )

    const [{ b }] = useContext(context) //you need to hook Context to this component by useContext()

    useEffect(() => {
      console.dir(this) //this context can be pass by arrow function
      console.log(cache.val) //return 1

      return () => {
        console.log(`disconnected callback`)
      }
    }, [state.a]) //trigger effect when depends changed, completely same as react useEffect()

    return html`
      <div>${state.a}</div>
      <div>${name}</div>
      <div>${data.b}</div>
      <div>${age}</div>
      ${repeat(
        [1, 2, 3], //list need to be rendered
        (item) => item, //key diff callback to generate key
        (
          item //actually render
        ) =>
          html` <button @click="${() => console.log(item)}">${item}</button> `
      )}
      <slot> default slot context </slot>
      <div>${memo}</div>
      <button
        @click="${(e: Event) => {
          state.a += 1
          data.b += 2
          console.log(
            this
          ) /*you can still access this by arrow function in event*/
        }}"
      >
        click
      </button>
      <div>
        ${suspense(
          () =>
            import('./components/MyCount').then(
              () => html`<my-count></my-count>`
            ),
          { pending: html`<div>loading...</div>` }
        )}
      </div>
    `
  }
)

render(html` <test-name :name="haha" :age="${2}"> slot content </test-name> `)
```
