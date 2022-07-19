import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
  WIX_COOKIE_EXPIRE, WIX_CHECKOUT_ID_COOKIE
} from '../const'

export const cartCreate = async (
  fetcher: any,
  lineItems: any
): Promise<any> => {
  const res = await fetcher({
    url: 'ecom/v1/carts',
    variables: JSON.stringify({
      lineItems
    })
  })

  const { checkoutId } = await fetcher({
    url: `ecom/v1/carts/${res.cart.id}/create-checkout`,
    variables: JSON.stringify({channelType: 'WEB'})
  })

  if (res) {
    const cartId = res.cart?.id
    const options = {
      expires: WIX_COOKIE_EXPIRE
    }
    Cookies.set(WIX_CART_ID_COOKIE, cartId, options)
    Cookies.set(WIX_CHECKOUT_ID_COOKIE, checkoutId, options)
  }

  return res
}

export default cartCreate
