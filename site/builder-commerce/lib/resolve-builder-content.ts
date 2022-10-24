import { builder } from '@builder.io/react'
import { getAsyncProps } from '@builder.io/utils'
import builderConfig from '@builder-commerce/config'
import commerce from "@lib/api/commerce";
builder.init(builderConfig.apiKey)

export async function resolveBuilderContent(
  modelName: string,
  targetingAttributes?: any,
  preview?: boolean,
  locale?: string,
  locales?: string[],
) {
  const config = { locale: locale ?? 'en', locales: locales ?? [] }
  let page = await builder
    .get(modelName, {
      userAttributes: targetingAttributes,
      includeRefs: true,
      cachebust: true,
    } as any)
    .toPromise()

  if (page) {
    return await getAsyncProps(page, {
      async ProductList(props: any) {
        let products: any[] = []
        if (props.productsList) {
          const promises = props.productsList
            .slice(0, props.limit ?? 50)
            .map((entry: any) => entry.product)
            .filter((handle: string | undefined) => typeof handle === 'string')
            .map(
              async (handle: string) =>
                commerce.getProduct({
                  variables: { slug: handle },
                  config,
                  preview,
                }).then(({product}) => product)
            )
          products = await Promise.all(promises)
        }
        return {
          // resolve the query as `products` for ssr
          // used for example in ProductList.block.tsx as initialProducts
          products,
        }
      },
      async ProductBox(props: any) {
        let product = props.product
        if (product && typeof product === 'string') {
          product = (await commerce.getProduct({
            variables: { slug: product },
            config,
            preview,
          })).product
        }
        return {
          product,
        }
      },
      async ProductCard(props: any) {
        const productSlug = props.productSlug ?? '';
        let product = null;
        if (productSlug && typeof productSlug === 'string') {
          product = (await commerce.getProduct({
            variables: { slug: productSlug },
            config,
            preview,
          })).product
        }
        return {
          product,
          productSlug: productSlug,
          config,
          preview: preview ?? false,
        }
      },
    })
  }
  return null
}
