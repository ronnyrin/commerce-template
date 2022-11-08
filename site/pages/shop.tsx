import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import {useRouter} from "next/router";
import {BuilderComponent} from "@builder.io/react";
import { builder } from '@builder.io/react'

import builderConfig from '@builder-commerce/config'
builder.init(builderConfig.apiKey)

export async function getStaticProps({
                                       locale,
                                       locales,
                                     }: GetStaticPropsContext<{ path: string[] }>) {
  const config = { locale, locales }
  const page = await builder
    .get('page', {url: '/shop'}).promise()
    ?? null
  const productsPromise = commerce.getAllProducts({
    config,
  })
  const { products } = await productsPromise
  return {
    props: {
      page,
      locale,
      products,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5,
  }
}

export default function Shop({
                               page,
                               products,
                             }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  return (
    <div>
      <BuilderComponent
        options={{ includeRefs: true } as any}
        data={{ products }}
        model="products-page"
        {...(page && { content: page })}
      />
    </div>
  )
}

Shop.Layout = Layout
