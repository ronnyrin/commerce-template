import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'

import {
  normalizeProduct,
} from '../utils'

export type SearchProductsInput = {
  search?: string
  categoryId?: number
  brandId?: number
  sort?: string
  locale?: string
}

export default useSearch as UseSearch<typeof handler>

export const handler: any = {
// @ts-ignore
  async fetcher({ input, options, fetcher }) {
    const { categoryId, brandId } = input
    const method = 'POST'
    // const variables = getSearchVariables(input)
    let products
    if (categoryId) {
      const data = await fetcher({
        url: 'stores/v1/collections/query',
        method,
        query: JSON.stringify({variables: {id: input.categoryId}}),
      })
      products = brandId
        ? data.products?.filter(
            ({ node: { vendor } }: any) =>
              vendor.replace(/\s+/g, '-').toLowerCase() === brandId
          )
        : data.products
    } else {
      const data = await fetcher({
        method,
        // variables,
      })
      products = data.products
    }

    return {
      products: products?.map((p: any) =>
        normalizeProduct(p)
      ),
      found: !!products?.length,
    }
  },
  useHook:
    ({ useData }: any) =>
    (input: any = {}) => {
      return useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          ['brandId', input.brandId],
          ['sort', input.sort],
          ['locale', input.locale],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}
