import { html } from '@jumoku/jumoku'

const age = 30
const person = {
  age,
  children: ['allen', 'bob', 'cyla']
}
const logg = () => console.log('hello template')

const props = {
  age,
  person,
  logg
}

type Props = {
  age: number
  person: {
    age: number
    children: any[]
  }
  logg: Function
}

const component = ({ age, person, logg }: Props) => html`
  <div age="${age}" @click="${logg}">
    <span>a test template ${person}</span>
    <slot></slot>
    <pre>
$$    $$            $$  $$          
$$    $$            $$  $$            
$$    $$   $$$$$$   $$  $$   $$$$$$   
$$$$$$$$  $$    $$  $$  $$  $$    $$  
$$    $$  $$$$$$$$  $$  $$  $$    $$ 
$$    $$  $$        $$  $$  $$    $$ 
$$    $$   $$$$$$$  $$  $$   $$$$$$</pre
    >
    ${person.children.map(
      c => html`
        <div>
          ${html`
            <div>${c}</div>
          `}
        </div>
      `
    )}
    ${person.children.map(
      c => html`
        <div>${c}</div>
      `
    )}
    <div>ooooooooooooooooooo</div>
  </div>
`
document.querySelector('#app')?.appendChild(component({ ...props }).fragment)
