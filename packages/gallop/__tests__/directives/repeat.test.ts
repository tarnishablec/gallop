import {
  render,
  html,
  repeat,
  component,
  useState,
  ReactiveElement
} from '../../src'
import { Change, DiffKey, listKeyDiff } from '../../src/directives/repeat'

const generateRandomList = () => [
  ...new Set(new Array(~~(Math.random() * 30 + 2)).fill(Math.random() * 100))
]

const patch = (oldList: DiffKey[], changes: Change[] /* , log = false */) => {
  changes.forEach((change) => {
    switch (change.type) {
      case 'insert': {
        const { after, key } = change
        const afterIndex = oldList.indexOf(after)
        if (after === null) {
          oldList.unshift(key)
        } else {
          oldList.splice(afterIndex + 1, 0, key)
        }
        break
      }
      case 'movea': {
        const { after, key } = change
        const afterIndex = oldList.indexOf(after)
        const keyIndex = oldList.indexOf(key)
        const [k] = oldList.splice(keyIndex, 1)
        if (after === null) {
          oldList.unshift(k)
        } else {
          oldList.splice(afterIndex + 1, 0, k)
        }
        break
      }
      case 'moveb': {
        const { before, key } = change
        const keyIndex = oldList.indexOf(key)
        const [k] = oldList.splice(keyIndex, 1)
        const beforeIndex = oldList.indexOf(before)
        if (before === null) {
          oldList.push(k)
        } else {
          oldList.splice(beforeIndex, 0, k)
        }
        break
      }
      case 'remove': {
        const { key } = change
        const keyIndex = oldList.indexOf(key)
        oldList.splice(keyIndex, 1)
        break
      }
    }
    // log && console.log(oldList)
  })

  return oldList
}

describe('repeat', () => {
  test('should not have duplicated key', () => {
    expect(() => {
      render(html`
        <div>
          ${repeat(
            [1, 1],
            (item) => item,
            (item) => item
          )}
        </div>
      `)
    }).toThrowError()
  })

  test('two random list key diff', () => {
    const o = generateRandomList()
    const n = generateRandomList()
    expect(o).not.toEqual(n)
    const res = listKeyDiff(o, n)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('two single item list key diff', () => {
    const o = [1]
    const n = [2]
    const res = listKeyDiff(o, n)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('one single item list key diff', () => {
    const o = [1, 23, 4]
    const n = [23]
    const res = listKeyDiff(o, n)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('two custom item list1 key diff', () => {
    const o = [1, 5, 6, 7]
    const n = [7, 2, 1, 6]
    const res = listKeyDiff(o, n)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('two custom item list2 key diff', () => {
    const o = [1, 5, 6, 2, 7]
    const n = [7, 2, 1, 6, 8]
    const res = listKeyDiff(o, n)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('two custom item list3 key diff', () => {
    const o = [8, 1]
    const n = [7, 2, 1, 6, 8]
    const res = listKeyDiff(o, n)
    // console.log(res)
    const temp = [...o]
    patch(temp, res)
    expect(temp).toEqual(n)
  })

  test('two custom item list4 key diff', () => {
    const o = [8, 2, 3, 7, 4, 1]
    const n = [7, 2, 1, 6, 8]
    // console.log(res)
    const temp = [...o]
    const res = listKeyDiff(temp, n)
    patch(o, res)
    expect(o).toEqual(n)
  })

  test('repeat directive', (done) => {
    component('test-repeat', () => {
      const [state] = useState({ arr: [1, 2, 3] })

      return html` <button @click="${() => state.arr.push(state.arr.shift()!)}">
          move1
        </button>
        <button @click="${() => state.arr.unshift(state.arr.pop()!)}">
          move2
        </button>
        <hr />
        ${repeat(
          state.arr,
          (i) => i,
          (i) => html`<div>${i}</div>`
        )}`
    })

    render(html`<test-repeat></test-repeat>`)

    setTimeout(() => {
      const el = document.querySelector<ReactiveElement>('test-repeat')
      el?.$root.querySelectorAll('button')[0]?.click()
      el?.$root.querySelectorAll('button')[1]?.click()
      el?.$root.querySelectorAll('button')[1]?.click()
      setTimeout(() => {
        const str = el?.$root.querySelector('div')?.innerHTML
        try {
          expect(str).toBe('<!--π-->3<!--π-->')
          done()
        } catch (error) {
          done(error)
        }
      }, 100)
    }, 1000)
  })
})
