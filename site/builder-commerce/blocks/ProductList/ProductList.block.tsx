import React, { FC, useEffect, useState } from 'react'
import { LoadingDots, Marquee, Grid } from '@components/ui'
import ProductCard from '@components/product/ProductCard'
import commerce from "@lib/api/commerce";
import useSearch from '@framework/product/use-search'

export interface ProductGridProps {
  products?: any[]
  productsList?: Array<{ product: string }>
  collectionId?: string
  offset: number
  limit: number
  config: any
  preview: boolean
  useMarquee?: boolean
  alternateView?: boolean
}

const ProductListContent = ({products, offset, limit, useMarquee, alternateView, loading}: ProductGridProps & {loading: boolean}) => {
  if (loading) {
    return <LoadingDots />
  }
  const content = products?.slice(offset, limit).map((product, i) => (
    <ProductCard
      key={String(product._id) + i}
      product={product}
      variant={useMarquee ? 'slim' : 'simple'}
    />
  ));

  return content ? (
    useMarquee ?
      <Marquee variant={alternateView ? 'primary' : 'secondary'}>
        {content}
      </Marquee> :
      <Grid layout={alternateView ? 'normal' : 'A'}>
        {content}
      </Grid>
  ) : <>No Products</>
}

const PickedProductListBlock: FC<ProductGridProps> = ({
                                                  products: initialProducts,
                                                  productsList,
                                                  offset = 0,
                                                  limit = 10,
                                                  config,
                                                  preview,
                                                  useMarquee ,
                                                  alternateView = false,
                                                }) => {
  const [products, setProducts] = useState(initialProducts || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true)
      const promises = productsList!
        .map((entry) => entry.product)
        .filter((handle: string | undefined) => typeof handle === 'string')
        .map(
          (handle: string) => commerce.getProduct({
            variables: { slug: handle },
            config,
            preview,
          }).then(({product}) => product)
        )
      setProducts(await Promise.all(promises))
      setLoading(false)
    }
    if (productsList && !initialProducts) {
      getProducts()
    } else {
      setProducts(initialProducts ?? [])
    }
  }, [productsList, initialProducts, config, preview])

  return <ProductListContent products={products}
                             alternateView={alternateView}
                             useMarquee={useMarquee}
                             offset={offset}
                             limit={limit}
                             config={config}
                             preview={preview}
                             loading={loading}/>;
}

const ProductListBlock: FC<ProductGridProps> = (props) => {
  return props.collectionId ? <ProductsCollectionBlock {...props}/> : <PickedProductListBlock {...props}/>;
}

const ProductsCollectionBlock: FC<ProductGridProps> = ({
                                                  collectionId,
                                                  offset = 0,
                                                  limit = 10,
                                                  config,
                                                  preview,
                                                  useMarquee ,
                                                  alternateView = false,
                                                }) => {
  const {data} = useSearch({
    categoryId: collectionId,
    sort: '',
    search: '',
  });

  return <ProductListContent products={data?.products}
                             alternateView={alternateView}
                             useMarquee={useMarquee}
                             offset={offset}
                             limit={limit}
                             config={config}
                             preview={preview}
                             loading={!data}/>;
}

export default ProductListBlock
