import dynamic from 'next/dynamic'
import {Builder} from "@builder.io/react";
import builderConfig from "@builder-commerce/config";


const LazyProductView = dynamic(
  () => import(`@builder-commerce/blocks/ProductCard/ProductCard.block`),
  { ssr: true }
)

export const register = () => {
  if (builderConfig.productHandleName) {
    Builder.registerComponent(
      LazyProductView,
      {
        name: 'ProductCard',
        inputs: [
          {
            name: 'productSlug',
            friendlyName: 'Product',
            type: builderConfig.productHandleName,
            defaultValue: '',
          },
          {
            name: 'size',
            type: 'number',
            defaultValue: 300,
          },
          {
            name: 'name',
            type: 'text',
            helperText: 'Override product title',
          },
        ],
        image: 'https://unpkg.com/css.gg@2.0.0/icons/svg/ereader.svg',
        description: 'Choose a product to show in the box',
      },
    )
  }
}
