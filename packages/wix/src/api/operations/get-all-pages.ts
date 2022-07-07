import type {
  OperationContext,
  OperationOptions
} from '@vercel/commerce/api/operations'
import type { WixConfig, Provider } from '..'

export default function getAllPagesOperation({
  commerce
}: OperationContext<Provider>) {
  async function getAllPages(opts?: {
    config?: Partial<WixConfig>
    preview?: boolean
  }): Promise<any> {
    return Promise.resolve({ pages: [] });
  }

  return getAllPages
}
