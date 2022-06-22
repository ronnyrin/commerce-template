import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetProductOperation } from '../../types/product'
import { normalizeProduct } from '../../utils'
import type { WixConfig, Provider } from '..'

export default function getProductOperation({
  commerce,
}: OperationContext<Provider>) {

  async function getProduct<T extends GetProductOperation>({
    url = 'stores/v1/products/query',
    variables,
    config,
  }: {
    url?: string
    variables?: any,
    config?: Partial<WixConfig>
  } = {}): Promise<T['data']> {
    const { fetcher } = commerce.getConfig(config)
    const { products } = await fetcher({url, method: 'POST', variables: {filter: JSON.stringify({slug: variables.slug})}})
    console.log(products.length)
    return {
      product: normalizeProduct(products[0])
    }
  }

  return getProduct
}
