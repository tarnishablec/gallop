export type Class<T> = new (...args: any[]) => T

export type Flatten<T, R extends unknown[] = []> = T extends [
  infer FIRST,
  ...infer REST
]
  ? FIRST extends readonly unknown[]
    ? Flatten<[...FIRST, ...REST], R>
    : Flatten<REST, [...R, FIRST]>
  : R

type UnionToIntersectionFn<U> = (
  U extends unknown ? (k: () => U) => void : never
) extends (k: infer I) => void
  ? I
  : never

type GetUnionLast<U> = UnionToIntersectionFn<U> extends () => infer I
  ? I
  : never

type Prepend<Tuple extends unknown[], First> = [First, ...Tuple]

export type UnionToTuple<
  Union,
  T extends unknown[] = [],
  Last = GetUnionLast<Union>
> = [Union] extends [never]
  ? T
  : UnionToTuple<Exclude<Union, Last>, Prepend<T, Last>>
