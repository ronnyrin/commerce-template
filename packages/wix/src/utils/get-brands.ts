import { WixConfig } from '../api'

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
  return Promise.resolve([]);
}

export default getBrands
