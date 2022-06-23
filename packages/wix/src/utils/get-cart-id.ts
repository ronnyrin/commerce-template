import Cookies from 'js-cookie'
import { WIX_CART_ID_COOKIE } from '../const'

const getCartId = (id?: string) => {
  return id ?? Cookies.get(WIX_CART_ID_COOKIE)
}

export default getCartId
