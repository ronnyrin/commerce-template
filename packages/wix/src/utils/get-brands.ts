import {
  GetAllProductVendorsQuery,
  GetAllProductVendorsQueryVariables,
} from '../../schema'
import { WixConfig } from '../api'
import getAllProductVendors from './queries/get-all-product-vendors-query'

export type Brand = {
  entityId: string
  name: string
  path: string
}

export type BrandEdge = {
  node: Brand
}

export type Brands = BrandEdge[]

const getBrands = async (config: WixConfig): Promise<any> => {
  const { data } = await config.fetcher({})

  return [...new Set(data.products.edges)].map((v: any) => {
    const id = v.replace(/\s+/g, '-').toLowerCase()
    return {
      node: {
        entityId: id,
        name: v,
        path: `brands/${id}`,
      },
    }
  })
}

export default getBrands
