import type {
  OperationContext,
} from '@vercel/commerce/api/operations'
import { GetAllProductsOperation } from '../../types/product'
import type { WixConfig, Provider } from '..'
import { normalizeProduct } from '../../utils'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<Provider>) {

  async function getAllProducts<T extends GetAllProductsOperation>({
    url = 'stores/v1/products/query',
    config,
  }: {
    url?: string
    config?: Partial<WixConfig>
  } = {}): Promise<T['data']> {
    const { fetcher } = commerce.getConfig(config)
    const { products } = await fetcher({url})
    return {
      products: products.map((p: any) =>
        normalizeProduct(p)
      ),
    }
  }

  return getAllProducts
}
