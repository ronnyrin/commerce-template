import useCustomer, {
  UseCustomer,
} from '@vercel/commerce/customer/use-customer'
import type { CustomerHook } from '../types/customer'
import { SWRHook } from '@vercel/commerce/utils/types'
import { getCustomerToken } from '../utils'

export default useCustomer as UseCustomer<typeof handler>

export const handler: SWRHook<CustomerHook> = {
  fetchOptions: {
    query: '',
  },

  async fetcher({ options, fetch }) {
    const customerAccessToken = getCustomerToken()
    // if (customerAccessToken) {
    //   const data = await fetch<GetCustomerQuery, GetCustomerQueryVariables>({
    //     ...options,
    //     variables: { customerAccessToken: getCustomerToken() },
    //   })
    //   return data.customer
    // }
    return customerAccessToken
  },
  useHook:
    ({ useData }) =>
    (input) => {
      return useData({
        swrOptions: {
          revalidateOnFocus: false,
          ...input?.swrOptions,
        },
      })
    },
}
