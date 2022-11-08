import dynamic from 'next/dynamic'
import { Builder } from '@builder.io/react'
import { Input } from '@builder.io/sdk'
import {restrictedRegister} from "@builder-commerce/blocks/utils";
const LazyProductGrid = dynamic(
  () => import(`@builder-commerce/blocks/ProductList/ProductList.block`),
  { ssr: true }
)
import builderConfig from '@builder-commerce/config'

export const productGridSchema: Input[] = [
  {
    name: 'useMarquee',
    friendlyName: 'Use Marquee',
    type: 'boolean',
    defaultValue: false,
  },
  {
    name: 'alternateView',
    friendlyName: 'Use Alternate View',
    type: 'boolean',
    defaultValue: 'default',
  },
]
export const register = () => {
  restrictedRegister(
    LazyProductGrid,
    {
      name: 'ProductsInContext',
      image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/play-list-add.svg',
      description:
        'Product list, the associated products are passed from the model so it should only be used in search page',
      inputs: [
        {
          name: 'offset',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 50,
        },
      ].concat(productGridSchema as any),
      defaults: {
        bindings: {
          'component.options.products': 'state.products',
        },
      },
    },
    ['product-grid', 'theme', 'products-page']
  );
  if (builderConfig.collectionHandleName) {
    Builder.registerComponent(LazyProductGrid, {
      name: 'CollectionView',
      image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/play-list-add.svg',
      description: 'Pick products to be presented as a list or marquee',
      inputs: [
        {
          name: 'collectionId',
          friendlyName: 'Collection',
          type: builderConfig.collectionHandleName,
        },
        {
          name: 'offset',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 9,
        },
      ].concat(productGridSchema as any),
    })
  }

  if (builderConfig.productHandleName) {
    Builder.registerComponent(LazyProductGrid, {
      name: 'ProductList',
      image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/play-list-add.svg',
      description: 'Pick products to be presented as a list or marquee',
      inputs: [
        {
          name: 'productsList',
          type: 'list',
          subFields: [
            {
              name: 'product',
              type: builderConfig.productHandleName,
            },
          ],
        },
      ].concat(productGridSchema as any),
    })
  }


}
