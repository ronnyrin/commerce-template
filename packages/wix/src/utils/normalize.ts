import type { Page } from '../types/page'
import type { Product } from '../types/product'
import type { Cart, LineItem } from '../types/cart'
import type { Category } from '../types/site'

import {
  SelectedOption,
  ProductVariantConnection,
  Page as ShopifyPage,
  PageEdge
} from '../../schema'

const money = ({ price, currency }: any) => {
  return {
    value: +price,
    currencyCode: currency
  }
}

const normalizeProductOption = ({
  name: displayName,
  choices
}: any) => {
  return {
    displayName: displayName.toLowerCase(),
    values: choices.map((choice: any) => {
      let output: any = {
        label: choice.value
      }
      if (displayName.match(/colou?r/gi)) {
        output = {
          ...output,
          hexColors: [choice.value]
        }
      }
      return output
    })
  }
}

const normalizeProductImages = ({ items }: any) =>
  items?.map((i: any) => i.image)

const normalizeProductVariants = ({ edges }: ProductVariantConnection) => {
  return edges?.map(
    ({
      node: {
        id,
        selectedOptions,
        sku,
        title,
        priceV2,
        compareAtPriceV2,
        requiresShipping,
        availableForSale
      }
    }) => {
      return {
        id,
        name: title,
        sku: sku ?? id,
        price: +priceV2.amount,
        listPrice: +compareAtPriceV2?.amount,
        requiresShipping,
        availableForSale,
        options: selectedOptions.map(({ name, value }: SelectedOption) => {
          const options = normalizeProductOption({
            id,
            name,
            values: [value]
          })

          return options
        })
      }
    }
  )
}

export function normalizeProduct({
  id,
  name,
  brand,
  media,
  variants,
  description,
  descriptionHtml,
  price,
  slug,
  convertedPriceData,
  productOptions,
  metafields,
  ...rest
}: any): any {
  return {
    id,
    name: name,
    vendor: brand || '',
    path: `/${slug}`,
    slug: slug?.replace(/^\/+|\/+$/g, ''),
    price: money(convertedPriceData),
    images: normalizeProductImages(media),
    variants: [],
    options: productOptions
      ? productOptions
        .map((o: any) => normalizeProductOption(o))
      : [],
    ...(description && { description }),
    ...(descriptionHtml && { descriptionHtml }),
    ...rest
  }
}

export function normalizeCart(cart: any): Cart {
  return {
    id: cart.id,
    // url: cart.webUrl,
    customerId: '',
    email: '',
    createdAt: cart.createdDate,
    currency: {
      code: cart.currency
    },
    taxesIncluded: cart.taxIncludedInPrices,
    lineItems: cart.lineItems?.map(normalizeLineItem),
    lineItemsSubtotalPrice: +cart.subtotal?.amount,
    subtotalPrice: +cart.subtotal?.amount,
    totalPrice: cart.subtotal?.amount,
    discounts: []
  }
}

function normalizeLineItem({
  id, productName, quantity, catalogReference, image, physicalProperties, price, priceBeforeDiscounts, url
}: any): LineItem {
  return {
    id,
    variantId: catalogReference.catalogItemId,
    productId: catalogReference.catalogItemId,
    name: productName.translated,
    quantity,
    variant: {
      id: catalogReference.catalogItemId,
      sku: physicalProperties?.sku ?? '',
      name: productName.translated,
      image: {
        url: image.url || '/product-img-placeholder.svg'
      },
      requiresShipping: physicalProperties?.shippable ?? false,
      price: price?.amount,
      listPrice: priceBeforeDiscounts?.amount
    },
    path: String(url.relativePath.split('/')[2]),
    discounts: [],
    options: []
  }
}

export const normalizePage = (
  { title: name, handle, ...page }: ShopifyPage,
  locale: string = 'en-US'
): Page => ({
  ...page,
  url: `/${locale}/${handle}`,
  name
})

export const normalizePages = (edges: PageEdge[], locale?: string): Page[] =>
  edges?.map((edge) => normalizePage(edge.node, locale))

export const normalizeCategory = ({
  name,
  id
}: any): Category => ({
  id,
  name,
  slug: name,
  path: `/${name}`
})
