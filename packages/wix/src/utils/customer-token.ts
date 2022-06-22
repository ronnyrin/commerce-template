import Cookies, { CookieAttributes } from 'js-cookie'
import { WIX_COOKIE_EXPIRE, WIX_CUSTOMER_TOKEN_COOKIE } from '../const'

export const getCustomerToken = () => Cookies.get(WIX_CUSTOMER_TOKEN_COOKIE)

export const setCustomerToken = (
  token: string | null,
  options?: CookieAttributes
) => {
  if (!token) {
    Cookies.remove(WIX_CUSTOMER_TOKEN_COOKIE)
  } else {
    Cookies.set(
      WIX_CUSTOMER_TOKEN_COOKIE,
      token,
      options ?? {
        expires: WIX_COOKIE_EXPIRE,
      }
    )
  }
}
