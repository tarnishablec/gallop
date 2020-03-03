import { ShallowClip } from './clip'

const appRoot = document.querySelector('#app')!

export const render = (shaClip: ShallowClip, location: Node = appRoot) => {
  let clip = shaClip.createInstance()
  location.appendChild(clip.dof)

  clip.parts.forEach((p,index)=>{
    p.setValue(shaClip.vals[index])
  })

  clip.parts.forEach((p)=>{
    p.commit()
  })
}

