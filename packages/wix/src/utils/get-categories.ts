import type { Category } from '../types/site'
import { WixConfig } from '../api'
import { CollectionEdge } from '../../schema'
import { normalizeCategory } from './normalize'
import getSiteCollectionsQuery from './queries/get-all-collections-query'

const getCategories = async ({
  fetcher,
  locale,
}: WixConfig): Promise<Category[]> => {
  const { data } = await fetcher({})

  return (
    data.collections?.edges?.map(({ node }: CollectionEdge) =>
      normalizeCategory(node)
    ) ?? []
  )
}

export default getCategories
