import { html } from '@jumoku/jumoku'

type Props = {
  person: {
    age: number
    children: any[]
  }
  logg: Function
}

export const TestComponent = ({ person, logg }: Props) => html`
  <div age="${person.age}" @click="${logg}">
    <span>a test template ${person}</span>
    <slot name="qwe">
      <p>this is default</p>
    </slot>
    <div>
      <slot name="asd">
        <p>this is default</p>
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
