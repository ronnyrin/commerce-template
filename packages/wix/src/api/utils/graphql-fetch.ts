import type { GraphQLFetcher } from '@vercel/commerce/api'

import { FetcherError } from '@vercel/commerce/utils/errors'
import { WixConfig } from '../index'

const fetchGraphqlApi: (getConfig: () => WixConfig) => GraphQLFetcher =
  () => async () => {
    throw new FetcherError({
      errors: [{ message: 'GraphQL fetch is not implemented' }],
      status: 500,
    })
  }

export default fetchGraphqlApi
