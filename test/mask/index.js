import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import linkedin from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await linkedin({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
