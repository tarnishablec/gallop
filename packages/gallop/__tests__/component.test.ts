import {
  verifyComponentName,
  component,
  UpdatableElement,
  resolveCurrentHandle,
  setCurrentHandle,
  requestUpdate
} from '../src/component'
import { html, createContext, useEffect, render, useState } from '../src'
import { createInstance } from '../src/clip'
import { isMarker } from '../src/is'

describe('component', () => {
  test('verifyComponentName', () => {
    expect(verifyComponentName('asdasd')).toBe(false)
    expect(verifyComponentName('asdasd-0a')).toBe(true)
    expect(verifyComponentName('Adasd-asd')).toBe(false)
    expect(verifyComponentName('1')).toBe(false)
    expect(verifyComponentName('asd-sda-asdasd')).toBe(true)
  })

  test('register component', () => {
    let [data, context] = createContext({ tik: 0 })

    let a = 1
    let b = 1

    const hobbies = ['sing', 'jump', 'rap', '🏀']
    component(
      'test-example',
      function (
        this: UpdatableElement,
        name: string = 'yihan',
        age: number,
        hobbies: string[],
        status: { hungry: boolean } = { hungry: true }
      ) {
        let [state] = useState({ tok: 100 })

        useEffect(() => {
          a++
          expect(this.localName).toBe('test-example')
          expect(this.$state).toEqual({ tok: 100 })
        }, [])

        let sha = html`
          <div id="root" style="color:red" .class=${'test-example'}>
            <div>${name}</div>
            <div>${age}</div>
            <div>${hobbies}</div>
            <div>${status.hungry}</div>
            <div>${data.tik}</div>
            <div>${state.tok}</div>
            <button
              @click="${(e: Event) => {
                data.tik += 1
                state.tok += 1
                b += 2
                console.log(data.tik)
                console.log(e)
              }}"
            ></button>
          </div>
        `.useContext([context])

        expect(
          isMarker(
            sha
              .do(createInstance)
              .dof.querySelector('#root')
              ?.getAttribute('.class')
          )
        ).toBe(true)

        expect(
          isMarker(
            sha
              .do(createInstance)
              .dof.querySelector('#root')
              ?.getAttribute('style')
          )
        ).toBe(false)

        return sha
      },
      ['name', 'age', 'hobbies', 'status']
    )

    render(
      html` <test-example :hobbies="${hobbies}" :age="24"></test-example> `
    )

    const instance = document.body.querySelector('test-example')!

    expect(instance instanceof UpdatableElement).toBe(true)
    expect(instance.parentNode).toBe(document.body)

    setTimeout(() => {
      expect(!!instance.shadowRoot).toBe(true)
      expect(instance.shadowRoot?.childNodes.length).toBe(1)
      expect(
        instance!.shadowRoot?.firstChild?.childNodes[6] instanceof
          HTMLButtonElement
      ).toBe(true)
      expect(
        (instance!.shadowRoot?.firstChild?.childNodes[6] as HTMLDivElement)
          .textContent
      ).toBe(100)
      const button = instance!.shadowRoot?.firstChild
        ?.childNodes[6] as HTMLButtonElement
      button.dispatchEvent(new Event('click'))
      expect(
        instance.shadowRoot?.querySelector('#root') instanceof HTMLDivElement
      ).toBe(true)
      expect(a).toBe(2)
      expect(b).toBe(3)
      expect(data.tik).toBe(101)
      expect(
        (instance!.shadowRoot?.firstChild?.childNodes[6] as HTMLDivElement)
          .textContent
      ).toBe(101)
    }, 0)

    const TestName = () => component('asda', () => html``)
    expect(TestName).toThrowError(/The provided name /)
  })

  test('dispatchUpdate', () => {
    component('test-dispatch', () => html`<div>dispatch</div>`)
    render(
      html`
        <test-dispatch></test-dispatch>
        <test-dispatch></test-dispatch>
      `
    )
    const a = document.querySelectorAll('test-dispatch')[0] as UpdatableElement
    // const b = document.querySelectorAll('test-dispatch')[1] as UpdatableElement
    setCurrentHandle(a)
    expect(resolveCurrentHandle()).toBe(a)
  })
})
