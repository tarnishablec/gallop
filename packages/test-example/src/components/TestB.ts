import {
  createContext,
  component,
  useState,
  html,
  useEffect
} from '@gallop/gallop'
import './TestC'

export let [data, context] = createContext({
  tok: 1,
  children: [2, 4, 6, 8, 7, 10, 0, 22]
})

component('test-b', (name: string, age: number = 25) => {
  let [state] = useState({ tick: 1 })

  useEffect(() => {
    console.log(state.tick)
    return () => console.log(`end with ${state.tick}`)
  }, [state.tick])

  return html`
    <h3>name is ${name}; age is ${age}</h3>
    <div>${state.tick}</div>
    <button @click="${() => (state.tick += 1)}">state tick +1</button>
    <hr />
    <button @click="${() => data.children.push(Math.random())}">
      children add random
    </button>
    ${data.children.map(
      (c, index) => html`
        <div>
          <test-c :age="${c}"></test-c>
          <button @click="${() => data.children.splice(index, 1)}">
            delete
          </button>
        </div>
      `
    )}
    <div>${data.tok}</div>
    <button @click="${() => (data.tok += 1)}">context tok +1</button>
  `.useContext([context])
})
