import { type Component, component } from '@gallop/gallop'

export const registerGallopElement = (
  name: string,
  componentFn: Component
): ClassDecorator => {
  return () => {
    component(name, componentFn)
  }
}
