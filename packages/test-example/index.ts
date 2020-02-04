import { html } from '@jumoku/jumoku'

const age = 30
const person = {
  age,
  height: '30cm',
  children: ['allen', 'bob', 'cyla']
}
const logg = () => console.log('hello template')

const template = html`
  <div age="${age}" sex="${{ male: true }}" @click="${logg}">
    <span>a test template ${person} </span>
    <pre>
$$    $$            $$  $$          
$$ |  $$ |          $$ |$$ |          
$$ |  $$ | $$$$$$   $$ |$$ | $$$$$$   
$$$$$$$$ |$$  __$$  $$ |$$ |$$  __$$  
$$  __$$ |$$$$$$$$ |$$ |$$ |$$ /  $$ 
$$ |  $$ |$$   ____|$$ |$$ |$$ |  $$ 
$$ |  $$ | $$$$$$$  $$ |$$ | $$$$$$ 
    </pre
    >
    ${person.children.map(
      c => html`
        <div>${c}</div>
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

debugger
document.querySelector('#app')?.appendChild(template.cloneNode(true))
