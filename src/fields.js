export const fields = {
  id: 'A unique identifying value for the member linked to the technation.sucks LinkedIn application.',
  'first-name': 'The member\'s first name.',
  'last-name': `The member's last name.`,
  'maiden-name': `The member's maiden name.`,
  'formatted-name': `The member's name, formatted based on language.`,
  'phonetic-first-name': `The member's first name, spelled phonetically.`,
  'phonetic-last-name': `The member's last name, spelled phonetically.`,
  'formatted-phonetic-name': `The member's name, spelled phonetically and formatted based on language.`,
  headline: `The member's headline.`,
  location: `An object representing the user's physical location.`,
  industry: `The industry the member belongs to.`,
  'num-connections': `The number of LinkedIn connections the member has, capped at 500.  See 'num-connections-capped' to determine if the value returned has been capped.`,
  'num-connections-capped': "Returns 'true' if the member's 'num-connections' value has been capped at 500', or 'false' if 'num-connections' represents the user's true value.",
  summary: `A long-form text area describing the member's professional profile.`,
  specialties: `A short-form text area describing the member's specialties`,
  positions: `An object representing the member's current position.`,
  'picture-url': `A URL to the member's formatted profile picture, if one has been provided.`,
  'picture-urls::(original)': `A URL to the member's original unformatted profile picture.  This image is usually larger than the picture-url value above.`,
  'public-profile-url': `The URL to the member's public profile on LinkedIn.`,
}

const selectFields = f => `(${f.join(',')})`
