import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
  WIX_CHECKOUT_URL_COOKIE,
  WIX_COOKIE_EXPIRE
} from '../const'

import { FetcherOptions } from '@vercel/commerce/utils/types'

export const cartCreate = async (
  fetcher: any,
  lineItems: any
): Promise<any> => {
  const res = await fetcher({
    method: 'POST',
    shouldAdd: false,
    url: 'v1/meta-site/session-token'
  })
  console.log(res)
  const { cart } = await fetcher({
    method: 'POST',
    url: 'ecom/v1/carts',
    variables: {
      lineItems
    }
  })

  if (cart) {
    const cartId = cart?.id
    const options = {
      expires: WIX_COOKIE_EXPIRE
    }
    Cookies.set(WIX_CART_ID_COOKIE, cartId, options)
    if (cartId?.webUrl) {
      Cookies.set(WIX_CHECKOUT_URL_COOKIE, cartId.webUrl, options)
    }
  }

  return cartCreate!
}

export default cartCreate
