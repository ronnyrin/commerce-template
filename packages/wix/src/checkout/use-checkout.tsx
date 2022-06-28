import { SWRHook } from '@vercel/commerce/utils/types'
import useCheckout, {
  UseCheckout,
} from '@vercel/commerce/checkout/use-checkout'
import { useMemo } from 'react'
import { WIX_VIEWER_URL, WIX_DOMAIN } from '../const'

export default useCheckout as UseCheckout<typeof handler>

export const handler: SWRHook<any> = {
  fetchOptions: {
    url: 'ecom/v1/carts/create-checkout',
    method: 'POST',
  },
  async fetcher({ input, options, fetch }) {
    const { checkoutId } = await fetch({
      method: 'POST',
      url: `ecom/v1/carts/${input.cartId}/create-checkout`,
      variables: JSON.stringify({channelType: 'WEB'})
    })
    return `${WIX_VIEWER_URL}/checkout?appSectionParams={"checkoutId":"${checkoutId}","successUrl":"${WIX_DOMAIN}/success"}`;
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
