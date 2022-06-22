import { Fetcher } from '@vercel/commerce/utils/types'
import { API_TOKEN, API_URL } from './const'
import { handleFetchResponse } from './utils'

const fetcher: Fetcher = async ({
  method = 'POST',
  url,
  variables,
}) => {
  if (!url) {
    return Promise.resolve({data: {pages: {edges: []}, products: {edges: []}}});
  }

  return handleFetchResponse(
    await fetch(`${API_URL}/${url}`, {
      method,
      ...(variables && {body: JSON.stringify({query: variables})}),
      headers: {
        'Authorization': API_TOKEN!,
        'Content-Type': 'application/json',
      },
    })
  )
}

export default fetcher
