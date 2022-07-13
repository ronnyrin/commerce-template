import type { CustomerEndpoint } from '.'
import { WIX_ACCESS_TOKEN_COOKIE } from '../../../const'

const getLoggedInCustomer: CustomerEndpoint['handlers']['getLoggedInCustomer'] =
  async ({ req, res, config }) => {
    const token = req.cookies[config.customerCookie]

    if (token) {
      const response = await fetch('https://www.wixapis.com/members/v1/members/my?fieldsets=FULL', {
        headers: {
          'Authorization': req.cookies[WIX_ACCESS_TOKEN_COOKIE],
          'Content-Type': 'application/json'
        },
        method: 'GET',
      })
      const data = await response.json()
      const { member } = data

      if (!member) {
        return res.status(400).json({
          data: null,
          errors: [{ message: 'member not found', code: 'not_found' }],
        })
      }

      return res.status(200).json({ data: { customer: {firstName: member.contact.firstName, lastName: member.contact.lastName, email: member.loginEmail } } })
    }

    res.status(200).json({ data: null })
  }

export default getLoggedInCustomer
