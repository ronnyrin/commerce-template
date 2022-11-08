import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'
import { builder, Builder } from '@builder.io/react'
import builderConfig from '@builder-commerce/config'
builder.init(builderConfig.apiKey)
import { register as registerProductCard } from '@builder-commerce/blocks/ProductCard/ProductCard.builder'
import { register as registerProductList } from '@builder-commerce/blocks/ProductList/ProductList.builder'
registerProductCard();
registerProductList();

Builder.register('insertMenu', {
  name: 'Commerce Components',
  items: [
    { name: 'ProductCard' },
    { name: 'ProductList' },
    { name: 'CollectionView' },
    { name: 'ProductsInContext' },
  ],
})

const Noop: FC = ({ children }) => <>{children}</>

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
