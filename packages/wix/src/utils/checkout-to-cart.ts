import type { Cart } from '../types/cart'
import { CommerceError } from '@vercel/commerce/utils/errors'

import { normalizeCart } from './normalize'
import throwUserErrors from './throw-user-errors'

const checkoutToCart = (checkoutPayload?: any): Cart => {
  throwUserErrors(checkoutPayload?.checkoutUserErrors)

  if (!checkoutPayload?.checkout) {
    throw new CommerceError({
      message: 'Missing checkout object from response',
    })
  }

  return normalizeCart(checkoutPayload?.checkout)
}

export default checkoutToCart
