import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export async function getServerSideProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    config,
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <>
      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 340,
              height: i === 0 ? 1080 : 340,
              priority: true,
            }}
          />
        ))}
      </Grid>
    </>
  )
}

Home.Layout = Layout
