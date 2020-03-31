# gallop

still working on it...

        yarn add @gallop/gallop

//Feature

        use template literals to auto detect dynamic & static code

        register reactive component in functional way

        support <slot> by web components

        : to bind props of component
        . to bind attributes / value / style
        @ to bind events, support @click.once.capture.passive like vue

        auto minimize update

        support web components and normal component

        built-in state management solution by createContext()

        naturally support async component by import()

        dont need useRef() because you can directly access dom by 'this'

        for more detail, check packages/test-example or email me

```ts
import {
  createContext,
  useState,
  useEffect,
  html,
  UpdatableElement
} from '@gallop/gallop'

export let [data, context] = createContext({ initContext })

component('name-name', function (this: UpdatableElement, ...props: any) {
  let [state] = useState({ initState }) //dont need setX(), useState() return a proxy, and auto trigger rerender
  console.dir(this) //access dom directly by this

  useEffect(() => {
    console.dir(this) //this context can be pass by arrow function
    return () => {
      console.log(`disconnected callback`)
    }
  }, [depends]) //trigger effect when depends changed, completely same as react useEffect()

  return html`
    <div>${state}</div>
    <div>${props}</div>
    <div>${data}</div>
    <button
      @click="${(e: Event) => {
        console.log(this)          /*you can still access this by arrow function in event*/
      }}"
    >
      click
    </button>
  `.useContext([someContext]) //you need to hook Context to this component by useContext(), different from react useContext()
})
```

//TODO

        hooks                           useState()               ✅
                                        useContext()             ✅
                                        useEffect()              ✅
                                        useMemo()                ❓

        context                                                  ✅

        async update queue                                       ✅

        dynamic scoped css by shadowdom

        scoped scss inject

        router                                                   DOING
