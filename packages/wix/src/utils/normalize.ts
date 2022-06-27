import type { Page } from '../types/page'
import type { Product } from '../types/product'
import type { Cart, LineItem } from '../types/cart'
import type { Category } from '../types/site'

import {
  Checkout,
  CheckoutLineItemEdge,
  SelectedOption,
  ProductVariantConnection,
  ProductOption,
  Page as ShopifyPage,
  PageEdge,
} from '../../schema'
import { colorMap } from './colors'

const money = ({ price, currency }: any) => {
  return {
    value: +price,
    currencyCode: currency,
  }
}

const normalizeProductOption = ({
  id,
  name: displayName,
  values,
}: ProductOption) => {
  return {
    __typename: 'MultipleChoiceOption',
    id,
    displayName: displayName.toLowerCase(),
    values: values.map((value) => {
      let output: any = {
        label: value,
      }
      if (displayName.match(/colou?r/gi)) {
        const mapedColor = colorMap[value.toLowerCase().replace(/ /g, '')]
        if (mapedColor) {
          output = {
            ...output,
            hexColors: [mapedColor],
          }
        }
      }
      return output
    }),
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
        availableForSale,
      },
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
            values: [value],
          })

          return options
        }),
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
  options,
  metafields,
  ...rest
}: any): Product {
  return {
    id,
    name: name,
    vendor: brand || '',
    path: `/${slug}`,
    slug: slug?.replace(/^\/+|\/+$/g, ''),
    price: money(convertedPriceData),
    images: normalizeProductImages(media),
    variants: [],
    options: options
      ? options
          .filter((o: any) => o.name !== 'Title') // By default Shopify adds a 'Title' name when there's only one option. We don't need it. https://community.shopify.com/c/Shopify-APIs-SDKs/Adding-new-product-variant-is-automatically-adding-quot-Default/td-p/358095
          .map((o: any) => normalizeProductOption(o))
      : [],
    ...(description && { description }),
    ...(descriptionHtml && { descriptionHtml }),
    ...rest,
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
      code: cart.currency,
    },
    taxesIncluded: cart.taxIncludedInPrices,
    lineItems: cart.lineItems?.map(normalizeLineItem),
    lineItemsSubtotalPrice: +cart.subtotal?.amount,
    subtotalPrice: +cart.subtotal?.amount,
    totalPrice: cart.subtotal?.amount,
    discounts: [],
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
        url: image.url || '/product-img-placeholder.svg',
      },
      requiresShipping: physicalProperties?.shippable ?? false,
      price: price?.amount,
      listPrice: priceBeforeDiscounts?.amount,
    },
    path: String(url.relativePath),
    discounts: [],
    options: [],
  }
}

export const normalizePage = (
  { title: name, handle, ...page }: ShopifyPage,
  locale: string = 'en-US'
): Page => ({
  ...page,
  url: `/${locale}/${handle}`,
  name,
})

export const normalizePages = (edges: PageEdge[], locale?: string): Page[] =>
  edges?.map((edge) => normalizePage(edge.node, locale))

export const normalizeCategory = ({
  name,
  id,
}: any): Category => ({
  id,
  name,
  slug: name,
  path: `/${name}`,
})
