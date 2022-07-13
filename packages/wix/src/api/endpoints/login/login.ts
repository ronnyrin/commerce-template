import type { LoginEndpoint } from '.'
import { WIX_ACCESS_TOKEN_COOKIE, WIX_CUSTOMER_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from '../../../const'

const login: LoginEndpoint['handlers']['login'] = async ({
  res,
  body: { email, password },
  cookies,
  config,
  // commerce
}) => {
  console.log('fdsfds')
  if (!(email && password)) {
    return res.status(400).json({
      data: null,
      errors: [{ message: 'Invalid request' }]
    })
  }

  try {
    const accessToken = cookies[WIX_ACCESS_TOKEN_COOKIE]
    const response = await fetch('http://www.wix.com/_api/wix-sm/v1/auth/login?petri_ovr=specs.ShouldForceCaptchaVerificationOnSignupSpec:Disabled', {
      headers: {
        'Authorization': accessToken!,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      })
    })
    const data = await response.json()
    res.setHeader(
      'Set-Cookie',
      [`${WIX_CUSTOMER_TOKEN_COOKIE}=${data.session.token}; Max-Age=${WIX_COOKIE_EXPIRE*86400}; Path=/`]
    )
    res.status(200).json({ data: data.member })
  } catch (error) {
    throw error
  }
}

export default login
