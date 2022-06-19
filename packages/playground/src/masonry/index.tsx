import { random } from 'lodash'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import styled from 'styled-components'
import Masonry from 'react-masonry-css'

const getNewList = () => new Array(40).fill(1).map(() => random(200, 400))

const App = () => {
  const [list, setList] = useState<number[]>([])

  const triggerRef = useRef(null)

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    if (trigger) {
      console.log(trigger)
      const interObs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            console.log(entry)
            setList((pre) => [...pre, ...getNewList()])
          }
        }
      })
      interObs.observe(trigger)
      return () => {
        interObs.disconnect()
      }
    }
  }, [])

  return (
    <Wrapper
      className="masonry"
      breakpointCols={{ default: 4 }}
      columnClassName="column"
    >
      {list.map((height, index) => (
        <Card
          key={index}
          style={{
            height,
            background: `rgb(${random(0, 255)},${random(0, 255)},${random(
              0,
              255
            )})`
          }}
        >
          {index + 1}
        </Card>
      ))}
      <Trigger ref={triggerRef} className="trigger">
        trigger
      </Trigger>
    </Wrapper>
  )
}

const Wrapper = styled(Masonry)`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  overflow-y: auto;
  column-gap: 4px;
  position: relative;

  .column {
    width: auto !important;
  }
`

const Card = styled.div`
  width: 260px;
  margin-bottom: 4px;
  display: grid;
  place-items: center;
`

const Trigger = styled.div`
  position: absolute;
  width: 100px;
  height: 30px;
  background: black;
  display: grid;
  place-items: center;
`

const root = createRoot(document.querySelector('#root')!)
root.render(<App />)
