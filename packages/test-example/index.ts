import { TestComponent } from './src/components/TestComponent'

const props = {
  person: {
    age: 30,
    children: ['allen', 'bob', 'cyla']
  },
  logg: () => alert('hello template')
}
document
  .querySelector('#app')
  ?.appendChild(TestComponent({ ...props }).fragment)
