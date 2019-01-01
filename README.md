# <img src="https://raw.github.com/idiocc/linkedin/master/square.svg?sanitize=true" align="left"> @idio/linkedin

[![npm version](https://badge.fury.io/js/%40idio%2Flinkedin.svg)](https://npmjs.org/package/@idio/linkedin)

`@idio/linkedin` is The LinkedIn OAuth Login Routes For The Idio Web Server.

```sh
yarn add -E @idio/linkedin
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`linkedin(router: Router, config: Config)`](#linkedinrouter-routerconfig-config-void)
  * [`Config`](#type-config)
  * [finish](#finish)
- [`getUser(user: *): { firstName, lastName, profilePicture }`](#getuseruser---firstname-lastname-profilepicture-)
- [`query(config: QueryConfig)`](#queryconfig-queryconfig-void)
  * [`QueryConfig`](#type-queryconfig)
- [Button](#button)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import linkedin from '@idio/linkedin'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `linkedin(`<br/>&nbsp;&nbsp;`router: Router,`<br/>&nbsp;&nbsp;`config: Config,`<br/>`): void`

Sets up the `/auth/linkedin` and `/auth/linkedin/redirect` paths on the router to enable LinkedIn App Login. The session middleware needs to be installed to remember the state. The state is destroyed after the redirect.

__<a name="type-config">`Config`</a>__: Options for the program.

|        Name        |             Type              |                                                                         Description                                                                          |         Default         |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| __client_id*__     | _string_                      | The app's client id.                                                                                                                                         | -                       |
| __client_secret*__ | _string_                      | The app's client secret.                                                                                                                                     | -                       |
| path               | _string_                      | The server path to start the login flaw and use for redirect (`${path}/redirect`).                                                                           | `/auth/linkedin`        |
| scope              | _string_                      | The scope to ask permissions for.                                                                                                                            | `r_liteprofile`         |
| finish             | _(ctx, token, user) =&gt; {}_ | The function to complete the authentication that receives the token and the data about the user, such as name and id. The default function redirects to `/`. | `setSession; redirect;` |

```js
import linkedIn, { query, linkedInButton, getUser } from '@idio/linkedin'
import idioCore from '@idio/core'

const Server = async () => {
  const { url, router, app } = await idioCore({
    session: { use: true,
      keys: [process.env.SESSION_KEY || 'dev'] },
    logger: { use: true },
  })
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
```
```
[+] LINKEDIN_ID [+] LINKEDIN_SECRET [+] SESSION_KEY 
http://localhost:5000 
  <-- GET /auth/linkedin
  --> GET /auth/linkedin 302 21ms 485b
{ body: 'Redirecting to <a href="https://www.linkedin.com/oauth/v2/authorization?state=6757&amp;response_type=code&amp;client_id=86986rqg6dmn58&amp;redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&amp;scope=r_liteprofile%2Cr_basicprofile">https://www.linkedin.com/oauth/v2/authorization?state=6757&amp;response_type=code&amp;client_id=86986rqg6dmn58&amp;redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&amp;scope=r_liteprofile%2Cr_basicprofile</a>.',
  headers: 
   { location: 'https://www.linkedin.com/oauth/v2/authorization?state=6757&response_type=code&client_id=86986rqg6dmn58&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&scope=r_liteprofile%2Cr_basicprofile',
     'content-type': 'text/html; charset=utf-8',
     'content-length': '485',
     'set-cookie': 
      [ 'koa:sess=eyJzdGF0ZSI6Njc1NywiX2V4cGlyZSI6MTU0NjQ3MjEzMDI3OSwiX21heEFnZSI6ODY0MDAwMDB9; path=/; httponly',
        'koa:sess.sig=7MLBXhpIhvZvagp81tJw2PXt2mE; path=/; httponly' ],
     date: 'Tue, 01 Jan 2019 23:35:30 GMT',
     connection: 'close' },
  statusCode: 302,
  statusMessage: 'Found' }

 > Redirect to Dialog https://www.linkedin.com/oauth/v2/authorization?state=6757&response_type=code&client_id=86986rqg6dmn58&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Flinkedin%2Fredirect&scope=r_liteprofile%2Cr_basicprofile
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="15"></a></p>

### finish

The config allows to set the finish function that can be used to alter the logic of setting the token on the session or performing additional operations such as storing a new user in the database. The default sets the token on the `ctx.session` and also sets the user data such as name and id in the `ctx.session.user` property.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## `getUser(`<br/>&nbsp;&nbsp;`user: *,`<br/>`): { firstName, lastName, profilePicture }`

When data is requested from `/me` route for the lite profile, the results will come back containing a lot of metadata such as names' locales and an array with profile pictures of different sizes. The `getUser` method keeps only 3 properties as strings: the `firstName`, `lastName` and `profilePicture`.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## `query(`<br/>&nbsp;&nbsp;`config: QueryConfig,`<br/>`): void`

The query method allows to query the LinkedIn API. The `v2` version of the API only allows to query basic data with the `r_liteprofile` permission. The other methods of the API are not pubic. This package will automatically query the `/me` route to find out the user's name and profile picture, therefore specifying the `r_liteprofile` scope is required. The `v1` version which is used to query positions with the `r_basicprofile` scope will be switched off in March 2019.

__<a name="type-queryconfig">`QueryConfig`</a>__: Options for Query.

|    Name    |   Type   |                    Description                    | Default |
| ---------- | -------- | ------------------------------------------------- | ------- |
| __token*__ | _string_ | The access token with appropriate permissions.    | -       |
| __path*__  | _string_ | The API endpoint.                                 | -       |
| __data*__  | _*_      | The object containing data to query the API with. | -       |
| version    | _string_ | The version of the API to query.                  | `v2`    |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## Button

The package provides the implementation of the Sign-In button with CSS and HTML. It was added in favour of the static image button to be able to switch background color on hover, and instead of an SVG button because problems will arise when placing SVG into an `a` element.

![Default Button](img/linkedin.png) The default linked-in button.
<br>
![Idio Linkedin Button](img/button.png) Idio's button CSS+HTML implementation.

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/6.svg?sanitize=true"></a></p>


## Copyright

(c) [Idio][1] 2018

[1]: https://idio.cc

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>