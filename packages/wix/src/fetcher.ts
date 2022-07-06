import { API_URL, WIX_ACCESS_TOKEN_COOKIE, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './const'
import { handleFetchResponse } from './utils'
import Cookies from 'js-cookie'

const fetcher: any = async ({
  method = 'POST',
  url,
  variables
}: any) => {
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE)
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE)
  if (!accessToken) {
    const res = await fetch(
      `${API_URL}/v1/meta-site/session-token`,
      {
        method: 'POST',
        headers: {
          'origin': WIX_DOMAIN!,
          'Content-Type': 'application/json',
          ...(refreshToken && {'refresh-token': refreshToken})
        }
      })
    const json = await res.json()
    accessToken = json.accessToken
    Cookies.set(WIX_ACCESS_TOKEN_COOKIE, accessToken!, {expires: 0.3})
    Cookies.set(WIX_REFRESH_TOKEN_COOKIE, json.refreshToken!, {expires: WIX_COOKIE_EXPIRE})
  }

  if (!url) {
    return Promise.resolve({ data: { pages: { edges: [] }, products: { edges: [] } } })
  }

  return handleFetchResponse(
    await fetch(`${API_URL}/${url}`, {
      method,
      ...(variables && { body: variables }),
      headers: {
        'origin': WIX_DOMAIN!,
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      }
    })
  )
}

export default fetcher
