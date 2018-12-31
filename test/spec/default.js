import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import linkedin from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof linkedin, 'function')
  },
  async 'calls package without error'() {
    await linkedin()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await linkedin({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T