import DiscordOauth2 from 'discord-oauth2'
import KEYS from '../namegetKeys'

const oauth = new DiscordOauth2()

async function getToken(code: any, redirectUri: string) {
  return await oauth.tokenRequest({
    clientId: KEYS.discordClientId,
    clientSecret: KEYS.discordClientSecret,
    code,
    scope: 'identify email',
    grantType: 'authorization_code',
    redirectUri,
  })
}

export async function getUserDiscordData(code: any) {
  const devUri = `http://localhost:3000/raffle`
  const productionUri = `https://app.moondao.com/raffle`
  try {
    const token = await getToken(code, devUri)
    const admin = await oauth.getUser(token.access_token)
    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    }
  } catch (err: any) {
    return err.message
  }
}
