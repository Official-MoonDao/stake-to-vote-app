import { fetchChain } from '@thirdweb-dev/chains'
import { slugsToShortSlugs } from './thirdwebSlugs'

export async function getChain(
  chainSlug: string,
  chainSlugType: string = 'long'
) {
  const slug =
    chainSlugType === 'short'
      ? slugsToShortSlugs?.[chainSlug as keyof typeof slugsToShortSlugs]
      : chainSlug
  if ((slug === 'sep' && process.env.NEXT_PUBLIC_ENV === 'prod') || !slug)
    return
  const chain = await fetchChain(slug)
  return chain
}
