import { html, Component } from '@jumoku/jumoku'

type Prop = {
  person: {
    age: number
    children: any[]
  }
  logg: Function
  [key: string]: any
}

export const TestComponent: Component = ({ person, logg, color }: Prop) => html`
  <div @click="${logg}">
    <span>a test template ${person.age}</span>
    <slot :style="color: ${color}">
      <p>this is default</p>
    </slot>
    <div>
      <slot name="asd">
        <p>this is not default</p>
      </slot>
    </div>
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
          1
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
