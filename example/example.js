/* yarn example/ */
import { aqt } from 'rqt'
import dotenv from '@demimonde/dotenv'
dotenv()
/* start example */
import linkedIn, { query, linkedInButton, getUser } from '../src'
import idioCore from '@idio/core'

const Server = async () => {
  const { url, router, app, middleware: {
    session,
  } } = await idioCore({
    session: {
      keys: [process.env.SESSION_KEY],
    },
    logger: { use: true },
  }, { port: 0 })
  router.get('/', async (ctx) => {
    const u = await userDiv(ctx.session.user)
    ctx.body = `<!doctype html>
    <html>
      <body>
        ${u}
        <hr>
        &copy;Art Deco, 2019
      </body>
    </html>`
  })
  router.get('/signout', session, (ctx) => {
    ctx.session = null
    ctx.redirect('/')
  })
  linkedIn(router, {
    session,
    client_id: process.env.LINKEDIN_ID,
    client_secret: process.env.LINKEDIN_SECRET,
    scope: 'r_liteprofile,r_basicprofile',
    error(ctx, error) {
      ctx.redirect(`/?error=${error}`)
    },
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
      ctx.session.user = getUser(user)
      ctx.session.positions = positions
      ctx.redirect('/')
    },
  })
  app.use(router.routes())
  return { app, url }
}

const userDiv = async (user) => {
  if (!user) {
    const { idioCommon, style, button } = await linkedInButton()
    return `
    <style>
      ${idioCommon}
      ${style}
    </style>
    <div class="User">
      <p>Welcome.</p>
      ${button}
    </div>`
  }
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
  if (!process.env.LIVE) await app.destroy()
})()