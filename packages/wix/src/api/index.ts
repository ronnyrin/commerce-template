import {
  CommerceAPI,
  CommerceAPIConfig,
  getCommerceApi as commerceApi
} from '@vercel/commerce/api'
import createGraphqlFetcher from './utils/graphql-fetch'

import {
  API_URL,
  API_TOKEN,
  WIX_CUSTOMER_TOKEN_COOKIE,
  SHOPIFY_CHECKOUT_ID_COOKIE
} from '../const'

import fetcher from '../fetcher'

import * as operations from './operations'

if (!API_TOKEN) {
  throw new Error(
    `The environment variable NEXT_PUBLIC_WIX_STOREFRONT_ACCESS_TOKEN is missing and it's required to access your store`
  )
}

export interface WixConfig extends CommerceAPIConfig {
  fetcher: typeof fetcher
}

const ONE_DAY = 60 * 60 * 24

const config: WixConfig = {
  commerceUrl: API_URL,
  apiToken: API_TOKEN,
  customerCookie: WIX_CUSTOMER_TOKEN_COOKIE,
  cartCookie: SHOPIFY_CHECKOUT_ID_COOKIE,
  cartCookieMaxAge: ONE_DAY * 30,
  fetch: createGraphqlFetcher(() => getCommerceApi().getConfig()),
  fetcher
}

export const provider = {
  config,
  operations
}

export type Provider = typeof provider

export type WixAPI<P extends Provider = Provider> = CommerceAPI<P>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): WixAPI<P> {
  return commerceApi(customProvider)
}
