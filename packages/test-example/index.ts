import { createProxy } from '@jumoku/jumoku'

const p = createProxy([] as number[])

p.push(2)
p[1] = 3

console.log(p)
