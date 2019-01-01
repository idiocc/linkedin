const { jqt } = require('rqt');
const { stringify } = require('querystring');

const getLocalised = ({ localized, preferredLocale }) => {
  const { country, language } = preferredLocale
  const l = `${language}_${country}`
  const res = localized[l]
  return res
}

const getProfilePicture = ({ 'displayImage~': displayImage }) => {
  const { elements } = displayImage
  const [el] = elements
  if (!el) return
  const { identifiers } = el
  const [{ identifier }] = identifiers
  return identifier
}

const getUser = user => {
  const firstName = getLocalised(user.firstName)
  const lastName = getLocalised(user.lastName)
  const profilePicture = getProfilePicture(user.profilePicture)
  return {
    firstName,
    lastName,
    profilePicture,
  }
}

/**
 * The LinkedIn OAuth Login Routes For The Idio Web Server.
 * @param {import('koa-router')} [router] The router instance.
 * @param {Config} [config] Options for the program.
 * @param {string} config.client_id The app's client id.
 * @param {string} config.client_secret The app's client secret.
 * @param {string} [config.path="/auth/linkedin"] The server path to start the login flaw and use for redirect (`${path}/redirect`). Default `/auth/linkedin`.
 * @param {string} [config.scope="r_liteprofile"] The scope to ask permissions for. Default `r_liteprofile`.
 * @param {(ctx, token, user) => {}} [config.finish="setSession; redirect;"] The function to complete the authentication that receives the token and the data about the user, such as name and id. The default function redirects to `/`. Default `setSession; redirect;`.
 */
               async function linkedin(router, config = {}) {
  const {
    client_id,
    client_secret,
    path = '/auth/linkedin',
    scope = 'r_liteprofile',
    finish = /* async */ (ctx, token, user, /* next */) => {
      ctx.session.token = token
      ctx.session.user = getUser(user)
      ctx.redirect('/')
      // await next()
    },
  } = config

  if (!client_id) {
    console.warn('[linkedin] No client id - the dialog won\'t work.')
  }
  if (!client_secret) {
    console.warn('[linkedin] No client secret - the redirect won\'t work.')
  }

  router.get(path, async (ctx) => {
    const state = Math.floor(Math.random() * 10000)
    ctx.session.state = state
    const redirect_uri = getRedirect(ctx, path)
    const u = linkedinDialogUrl({
      redirect_uri,
      client_id,
      scope,
      state,
    })
    ctx.redirect(u)
  })

  router.get(`${path}/redirect`, async (ctx, next) => {
    const redirect_uri = getRedirect(ctx, path)
    const state = ctx.query.state
    if (state != ctx.session.state) {
      throw new Error('The state is incorrect.')
    }
    ctx.session.state = null
    if (!ctx.query.code) throw new Error('Code Not Found.')

    const token = await exchange({
      client_id,
      client_secret,
      redirect_uri,
      code: ctx.query.code,
    })
    const data = await getInfo(token)
    await finish(ctx, token, data, next)
  })
}

/**
 * Gets all available info
 */
const getInfo = async (token) => {
  return await query({
    token,
    path: 'me',
    data: {
      projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
    },
  })
}

/**
 * Request data from LinkedIn API.
 * @param {QueryConfig} config Options for Query.
 * @param {string} config.token The access token with appropriate permissions.
 * @param {string} config.path The API endpoint.
 * @param {*} config.data The object containing data to query the API with.
 * @param {string} [config.version="v2"] The version of the API to query. Default `v2`.
 */
       const query = async (config) => {
  const {
    token,
    version = 'v2',
    path,
    data,
  } = config
  const url = `https://api.linkedin.com/${version}/${path}`
  const d = stringify(data)
  const res = await jqt(`${url}?${d}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-li-format': 'json',
    },
  })
  if (res.serviceErrorCode) {
    throw new Error(res.message)
  }
  return res
}

const exchange = async ({
  code, client_id, client_secret, redirect_uri,
}) => {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri,
    client_id,
    client_secret,
  }
  const { error, access_token } = await jqt('https://www.linkedin.com/oauth/v2/accessToken', {
    data,
    type: 'form',
  })
  if (error) throw new Error(error)
  return access_token
}

const linkedinDialogUrl = ({
  redirect_uri,
  client_id,
  scope,
  state,
}) => {
  const s = stringify({
    state,
    response_type: 'code',
    client_id,
    redirect_uri,
    ...(scope ? { scope } : {}),
  })
  return `https://www.linkedin.com/oauth/v2/authorization?${s}`
}

const getRedirect = ({ protocol, host }, path) => {
  const parts = [
    /\.ngrok\.io$/.test(host) ? 'https' : protocol,
    '://',
    host,
    path,
    '/redirect',
  ]
  const p = parts.join('')
  return p
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {string} client_id The app's client id.
 * @prop {string} client_secret The app's client secret.
 * @prop {string} [path="/auth/linkedin"] The server path to start the login flaw and use for redirect (`${path}/redirect`). Default `/auth/linkedin`.
 * @prop {string} [scope="r_liteprofile"] The scope to ask permissions for. Default `r_liteprofile`.
 * @prop {(ctx, token, user) => {}} [finish="setSession; redirect;"] The function to complete the authentication that receives the token and the data about the user, such as name and id. The default function redirects to `/`. Default `setSession; redirect;`.
 *
 * @typedef {Object} QueryConfig Options for Query.
 * @prop {string} token The access token with appropriate permissions.
 * @prop {string} path The API endpoint.
 * @prop {*} data The object containing data to query the API with.
 * @prop {string} [version="v2"] The version of the API to query. Default `v2`.
 */


module.exports = linkedin
module.exports.query = query