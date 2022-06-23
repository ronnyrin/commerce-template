import { useMemo } from 'react'
import useCommerceCart, { UseCart } from '@vercel/commerce/cart/use-cart'
import { checkoutToCart } from '../utils'
import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
  WIX_CHECKOUT_URL_COOKIE,
} from '../const'

export default useCommerceCart as UseCart<typeof handler>

export const handler: any = {
  async fetcher({ input: { cartId }, options, fetch }: any) {
    // if (cartId) {
    const { cart } = await fetch({
      ...options,
      url: 'ecom/v1/carts/current',
    })
    if (cart?.completedAt) {
      Cookies.remove(WIX_CART_ID_COOKIE)
      Cookies.remove(WIX_CHECKOUT_URL_COOKIE)
      return null
    } else {
      return checkoutToCart({
        cart,
      })
    }
    // }
    // return null
  },
  useHook:
    ({ useData }: any) =>
    (input: any) => {
      const response = useData({
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })
      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}
