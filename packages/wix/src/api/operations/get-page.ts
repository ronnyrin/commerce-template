import type {
  OperationContext,
  OperationOptions,
} from '@vercel/commerce/api/operations'
import { normalizePage } from '../../utils'
import type { WixConfig, Provider } from '..'
import {
  GetPageQuery,
  GetPageQueryVariables,
  Page as ShopifyPage,
} from '../../../schema'
import { GetPageOperation } from '../../types/page'
import getPageQuery from '../../utils/queries/get-page-query'

export default function getPageOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getPage<T extends GetPageOperation>(opts: {
    variables: T['variables']
    config?: Partial<WixConfig>
    preview?: boolean
  }): Promise<T['data']>

  async function getPage<T extends GetPageOperation>(
    opts: {
      variables: T['variables']
      config?: Partial<WixConfig>
      preview?: boolean
    } & OperationOptions
  ): Promise<T['data']>

  async function getPage<T extends GetPageOperation>({
    query = getPageQuery,
    variables,
    config,
  }: {
    query?: string
    variables: T['variables']
    config?: Partial<WixConfig>
    preview?: boolean
  }): Promise<T['data']> {
    const { fetcher, locale } = commerce.getConfig(config)

    const {
      data: { node: page },
    } = await fetcher({})

    return page ? { page: normalizePage(page as ShopifyPage, locale) } : {}
  }

  return getPage
}
