import { FetcherOptions } from '@vercel/commerce/utils/types'
import throwUserErrors from './throw-user-errors'

import {
  MutationCustomerActivateArgs,
  MutationCustomerActivateByUrlArgs,
} from '../../schema'
import { Mutation } from '../../schema'

const handleAccountActivation = async (
  fetch: <T = any, B = Body>(options: FetcherOptions<B>) => Promise<T>,
  input: MutationCustomerActivateByUrlArgs
) => {
  try {
    const { customerActivateByUrl } = await fetch<
      Mutation,
      MutationCustomerActivateArgs
    >({
      query: '',
      variables: {
        input,
      },
    })

    throwUserErrors(customerActivateByUrl?.customerUserErrors)
  } catch (error) {}
}

export default handleAccountActivation
