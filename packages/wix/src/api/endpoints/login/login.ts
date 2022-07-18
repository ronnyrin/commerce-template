import type { LoginEndpoint } from '.'
import { WIX_ACCESS_TOKEN_COOKIE, WIX_CUSTOMER_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from '../../../const'

const cache = {email: '', password: ''};

const login: LoginEndpoint['handlers']['login'] = async ({
  res,
  body: { email, password },
  req: {cookies},
  config,
  // commerce
}) => {
  if (!(email && password) && !(cache.email && cache.password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }]
    })
  }

  try {
    const accessToken = cookies[WIX_ACCESS_TOKEN_COOKIE]
    const response = await fetch('http://www.wix.com/_api/wix-sm/v1/auth/login', {
      headers: {
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email: email || cache.email,
        password: password || cache.password,
      })
    })
    const data = await response.json()

    if (data.session?.token) {
      cache.email = email || cache.email;
      cache.password = password || cache.password;
    }

    res.setHeader(
      'Set-Cookie',
      [`${WIX_CUSTOMER_TOKEN_COOKIE}=${data.session.token}; Max-Age=${WIX_COOKIE_EXPIRE*86400}; Path=/`, `${WIX_ACCESS_TOKEN_COOKIE}=; expires=Thu, Jan 01 1970 00:00:00 UTC;; Path=/`]
    )
    res.status(200).json({ data: data.member })
  } catch (error) {
    throw error
  }
}

export default login
