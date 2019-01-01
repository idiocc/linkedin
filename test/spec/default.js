import { equal, deepEqual } from 'zoroaster/assert'
import core from '@idio/core'
import { aqt } from 'rqt'
import Context from '../context'
import linkedin from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof linkedin, 'function')
  },
  async 'redirects to facebook'() {
    const { app, router, url } = await core({
      session: { use: true, keys: ['test'] },
    })
    linkedin(router, {
      client_id: 'client-id',
      client_secret: 'client-secret',
    })
    app.use(router.routes())
    const { headers } = await aqt(`${url}/auth/linkedin`)
    app.destroy()
    const { location } = headers
    const l = location.replace(/state=\d+&/, '')
    equal(l, 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=client-id&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&scope=r_liteprofile')
  },
  async 'redirects to facebook with scope'() {
    const { app, router, url } = await core({
      session: { use: true, keys: ['test'] },
    })
    linkedin(router, {
      client_id: 'client-id',
      client_secret: 'client-secret',
      scope: 'r_liteprofile,r_basicprofile',
    })
    app.use(router.routes())
    const { headers } = await aqt(`${url}/auth/linkedin`)
    app.destroy()
    const { location } = headers
    const l = location.replace(/state=\d+&/, '')
    equal(l, 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=client-id&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&scope=r_liteprofile%2Cr_basicprofile')
  },
}

export default T