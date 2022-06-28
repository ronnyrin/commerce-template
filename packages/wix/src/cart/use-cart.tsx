import { useMemo } from 'react'
import useCommerceCart, { UseCart } from '@vercel/commerce/cart/use-cart'
import { checkoutToCart } from '../utils'
import Cookies from 'js-cookie'

import {
  WIX_CART_ID_COOKIE,
} from '../const'

export default useCommerceCart as UseCart<typeof handler>

export const handler: any = {
  fetchOptions: {
    url: 'ecom/v1/carts/current',
    method: 'GET',
  },
  async fetcher({ options, fetch }: any) {
    try {
      const { cart } = await fetch({
        ...options,
        method: 'GET',
        url: 'ecom/v1/carts/current',
      })
        return checkoutToCart({
          cart,
        })
    } catch (e) {
      Cookies.remove(WIX_CART_ID_COOKIE)
    }
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
