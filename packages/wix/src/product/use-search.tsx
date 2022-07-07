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
  fetchOptions: {
    query: '',
  },
  async fetcher({ input, options, fetch }: any) {
    const { categoryId } = input
    const method = 'POST'
    let products
    let sortType = input.sort.split('-')[0];
    if (sortType === 'latest' || sortType === 'trending') {
      sortType = 'lastUpdated'
    }
    const sortValue = input.sort.split('-')[1];
    const sortQuery = {sort: JSON.stringify([{[sortType]: sortValue}])}
    if (categoryId) {
      const data = await fetch({
        url: 'stores/v1/products/query',
        method,
        variables: JSON.stringify({query: {filter: JSON.stringify({'collections.id': categoryId}), ...(sortType && sortQuery)}}),
      })

      products = data.products
    } else {
      const data = await fetch({
        url: 'stores/v1/products/query',
        method,
        variables: JSON.stringify({query: {filter: JSON.stringify({'name': {'$startsWith': input.search}}), ...(sortType && sortQuery)}}),
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
