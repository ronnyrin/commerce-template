import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
  WIX_COOKIE_EXPIRE
} from '../const'

export const cartCreate = async (
  fetcher: any,
  lineItems: any
): Promise<any> => {
  const { cart } = await fetcher({
    method: 'POST',
    url: 'ecom/v1/carts',
    variables: JSON.stringify({
      lineItems
    })
  })

  if (cart) {
    const cartId = cart?.id
    const options = {
      expires: WIX_COOKIE_EXPIRE
    }
    Cookies.set(WIX_CART_ID_COOKIE, cartId, options)
  }

  return cartCreate!
}

export default cartCreate
