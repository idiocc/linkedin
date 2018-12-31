import { debuglog } from 'util'

const LOG = debuglog('@idio/linkedin')

/**
 * The LinkedIn OAuth Login Routes For The Idio Web Server.
 * @param {Config} [config] Options for the program.
 * @param {boolean} [config.shouldRun=true] A boolean option. Default `true`.
 * @param {string} config.text A text to return.
 */
export default async function linkedin(config = {}) {
  const {
    shouldRun = true,
    text,
  } = config
  if (!shouldRun) return
  LOG('@idio/linkedin called with %s', text)
  return text
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {boolean} [shouldRun=true] A boolean option. Default `true`.
 * @prop {string} text A text to return.
 */
