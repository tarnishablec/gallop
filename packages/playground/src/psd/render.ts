import Knova from 'konva'
import { type Psd } from 'ag-psd'

const { Stage } = Knova

export const renderPsd = ({ psd }: { psd: Psd }) => {
  const { width, height } = psd
  const stage = new Stage({
    container: '',
    width,
    height
  })

  return stage
}
