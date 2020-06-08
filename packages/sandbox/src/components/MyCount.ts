import {
  component,
  html,
  useState,
  useStyle,
  css,
  useEffect
} from '@gallop/gallop'

export const MyCount = component(
  'my-count',
  ({ color = 'red' }: { color?: string } = {}) => {
    const [state] = useState({ count: 0 })
    console.log('my-count')

    useEffect(() => {
      console.log('my-count mounted')
      return () => console.log(`m-count unmounted`)
    }, [])

    useStyle(
      () => css`
        span {
          color: ${color};
        }
      `
    )
    return html`
      <button @click="${() => state.count--}">
        -
      </button>
      <span>${state.count}</span>
      <button @click="${() => state.count++}">
        +
      </button>
      <style>
        * {
          font-size: 200%;
        }

        span {
          width: 4rem;
          display: inline-block;
          text-align: center;
        }

        button {
          width: 64px;
          height: 64px;
          border: none;
          border-radius: 10px;
          background-color: seagreen;
          color: white;
        }
      </style>
    `
  }
)
