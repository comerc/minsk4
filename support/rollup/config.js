import factory from './factory'
import slateCoder from '../../packages/slate-coder/package.json'
import slateControls from '../../packages/slate-controls/package.json'

const configurations = [...factory(slateCoder), ...factory(slateControls)]

export default configurations
