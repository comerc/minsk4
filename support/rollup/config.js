import factory from './factory'
import slateControls from '../../packages/slate-controls/package.json'
import dummy from '../../packages/dummy/package.json'

const configurations = [...factory(slateControls), ...factory(dummy)]

export default configurations
