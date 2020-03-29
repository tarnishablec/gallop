# gallop

still working...

        yarn add @gallop/gallop

//Feature

        use template literals to auto detect dynamic & static code

        register component in functional way

```ts
     import { createContext, useState, useEffect, html, UpdatableElement } from '@gallop/gallop'

     export let [data,context] = createContext({initContext})
     component('name-name',
     (...props)=>{
        let [state] = useState({initState})

        useEffect((this:UpdatableElement)=>{
            console.dir(this)   //access dom directly
            return ()=>{
                console.log(`disconnected callback`)
            }
        },[depends])

        return html`
            <div>${state}</div>
            <div>${props}</div>
            <div>${data}</div>
        `.useContext([someContext]))
     }
```

        common feature in react

        : to bind props of component
        . to bind attributes
        @ to bind events, support @click.once.capture.passive like vue

        auto minimize update

        support web components and normal component

        built-in state management solution by createContext()

        naturally support async component by import()

        dont need useRef() because you can directly access dom in useEffect() by dom api

        for more detail, check packages/test-example
//TODO

<p>
<pre>
        hooks                           useState()               ✔
                                        useContext()             ✔
                                        useEffect()              ✔
                                        <span style="TEXT-DECORATION: line-through">useRef()</span>
                                        <span style="TEXT-DECORATION: line-through">useMemo()</span>

        context                                                  ✔

        async update queue                                       ✔

        dynamic scoped css by shadowdom

        scoped scss inject

        router
</pre>
</p>