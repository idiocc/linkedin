/* yarn example/ */
import { aqt } from 'rqt'
import dotenv from '@demimonde/dotenv'
dotenv()
/* start example */
import linkedIn, { query } from '../src'
import idioCore from '@idio/core'

const Server = async () => {
  const { url, router, app } = await idioCore({
    session: { use: true,
      keys: [process.env.SESSION_KEY || 'dev'] },
    logger: { use: true },
    static: {
      use: true,
      root: 'img',
    },
  })
  router.get('/', (ctx) => {
    const u = userDiv(ctx.session.user)
    ctx.body = `${u}hello world`
  })
  router.get('/signout', (ctx) => {
    ctx.session = null
    ctx.redirect('/')
  })
  linkedIn(router, {
    client_id: process.env.LINKEDIN_ID,
    client_secret: process.env.LINKEDIN_SECRET,
    scope: 'r_liteprofile,r_basicprofile',
    async finish(ctx, token, user) {
      const { positions: { values: pos } } = await query({
        token,
        path: 'people/~:(positions)',
        version: 'v1',
      })
      const positions = pos.map(({
        title,
        company: { id, name },
        location: { name: location } ,
      }) => {
        return {
          id, name, title,
          location: location.replace(/,\s*$/, ''),
        }
      })
      ctx.session.token = token
      ctx.session.user = user
      ctx.session.positions = positions
      ctx.redirect('/')
    },
  })
  app.use(router.routes())
  return { app, url }
}

const userDiv = (user) => {
  if (!user) return `
    <div class="User">
      <p>Welcome.</p>
      <a href="/auth/linkedin" title="Sign In with LinkedIn">
        <object data="button.svg" type="image/svg+xml">
        <img src="linkedin.png" alt="Sign In With LinkedIn">
        </object>
      </a>
    </div>
  `
  const img = `<img src="${user.profilePicture}" width="50">`
  return `
    <div class="User">
      ${img} Hello, ${user.firstName} ${user.lastName}!
      <a href="/signout">Sign out</a>
    </div>`
}

/* end example */

(async () => {
  const { app, url } = await Server()
  console.log(url, '')
  const res = await aqt(`${url}/auth/linkedin`)
  console.log(res)
  const { headers: { location } } = res
  console.log('\n > Redirect to Dialog %s', location)
  // await app.destroy()
})()