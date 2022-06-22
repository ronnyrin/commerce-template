import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import { GetAllProductPathsOperation } from '../../types/product'
import {
  GetAllProductPathsQuery,
  GetAllProductPathsQueryVariables,
  ProductEdge,
} from '../../../schema'
import type { WixConfig, Provider } from '..'
import { getAllProductsQuery } from '../../utils'

export default function getAllProductPathsOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getAllProductPaths<
    T extends GetAllProductPathsOperation
  >(opts?: {
    variables?: T['variables']
    config?: WixConfig
  }): Promise<T['data']>

  async function getAllProductPaths<T extends GetAllProductPathsOperation>(
    opts: {
      variables?: T['variables']
      config?: WixConfig
    } & OperationOptions
  ): Promise<T['data']>

  async function getAllProductPaths<T extends GetAllProductPathsOperation>({
    query = getAllProductsQuery,
    config,
    variables,
  }: {
    query?: string
    config?: WixConfig
    variables?: T['variables']
  } = {}): Promise<any> {
    config = commerce.getConfig(config)

    const { data } = await config.fetcher({})

    // return {
    //   products: data.products.edges.map(({ node: { handle } }) => ({
    //     path: `/${handle}`,
    //   })),
    // }
  }

  return getAllProductPaths
}
