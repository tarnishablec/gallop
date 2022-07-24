export const property: ({ label }: { label: string }) => PropertyDecorator =
  () => (target) => {
    console.log(target)
  }

export { autowired } from '../core/Component'
