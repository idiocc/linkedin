/* yarn example/ */
import { aqt } from 'rqt'
import dotenv from '@demimonde/dotenv'
dotenv()
/* start example */
import linkedIn, { query } from '../src'
import idioCore from '@idio/core'

const Server = async () => {
  const { url, router, app } = await idioCore({
    session: { use: true, keys: [process.env.SESSION_KEY || 'dev'] },
    logger: { use: true },
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
      const { positions: { values: positions } } = await query({
        path: 'people/~:(positions)',
        token,
        version: 'v1',
      })
      const pos = positions.map(({ title, company: { id, name }, location: { name: location } }) => {
        return {
          title,
          id, name, location: location.replace(/,\s*$/, ''),
        }
      })
      ctx.session.token = token
      ctx.session.user = user
      ctx.session.positions = pos
      ctx.redirect('/')
    },
  })
  app.use(router.routes())
  return { app, url }
}

const userDiv = (user) => {
  if (!user) return `
    <div class="User">Welcome. <a href="/auth/linkedin">Sign in</a></div>
  `
  const img = `<img src="${user.profilePicture}" width="50">`
  return `<div class="User">${img} Hello, ${user.firstName} ${user.lastName}! <a href="/signout">Sign out</a></div>`
}

/* end example */

(async () => {
  const { app, url } = await Server()
  console.log(url, '')
  const res = await aqt(`${url}/auth/linkedin`)
  console.log(res)
  const { headers: { location } } = res
  console.log('\n > Redirect to Dialog %s', location)
  await app.destroy()
})()