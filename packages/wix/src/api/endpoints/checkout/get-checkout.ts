import {
  WIX_CART_ID_COOKIE,
  WIX_CHECKOUT_URL_COOKIE,
  WIX_CUSTOMER_TOKEN_COOKIE,
} from '../../../const'
import associateCustomerWithCheckoutMutation from '../../../utils/mutations/associate-customer-with-checkout'
import type { CheckoutEndpoint } from '.'

const getCheckout: CheckoutEndpoint['handlers']['getCheckout'] = async ({
  req,
  res,
  config,
}) => {
  const { cookies } = req
  const checkoutUrl = cookies[WIX_CHECKOUT_URL_COOKIE]
  const customerCookie = cookies[WIX_CUSTOMER_TOKEN_COOKIE]

  if (customerCookie) {
    try {
      await config.fetch(associateCustomerWithCheckoutMutation, {
        variables: {
          checkoutId: cookies[WIX_CART_ID_COOKIE],
          customerAccessToken: cookies[WIX_CUSTOMER_TOKEN_COOKIE],
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (checkoutUrl) {
    res.redirect(checkoutUrl)
  } else {
    res.redirect('/cart')
  }
}

export default getCheckout
