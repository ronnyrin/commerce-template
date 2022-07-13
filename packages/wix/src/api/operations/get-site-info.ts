import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import type { WixConfig, Provider } from '..'
import { GetSiteInfoOperation } from '../../types/site'

import { getCategories, getBrands } from '../../utils'

export default function getSiteInfoOperation({
  commerce,
}: OperationContext<Provider>) {
  async function getSiteInfo<T extends GetSiteInfoOperation>({
    config,
  }: {
    query?: string
    config?: Partial<WixConfig>
    preview?: boolean
    variables?: any
  } = {}): Promise<T['data']> {
    const cfg = commerce.getConfig(config)

    const categoriesPromise = getCategories(cfg)
    const brandsPromise = getBrands(cfg)

    return {
      categories: await categoriesPromise,
      brands: await brandsPromise,
    }
  }

  return getSiteInfo
}
