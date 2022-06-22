import {
  getCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@vercel/commerce'
import { wixProvider, WixProvider } from './provider'

export { wixProvider }
export type { WixProvider }

export const CommerceProvider = getCommerceProvider(wixProvider)

export const useCommerce = () => useCoreCommerce<WixProvider>()
