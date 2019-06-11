import factory from './factory'
import slateControls from '../../src/packages/slate-controls/package.json'
import dummy from '../../src/packages/dummy/package.json'

const configurations = [
  // ...factory(slateControls),
  ...factory(dummy),
]

export default configurations
