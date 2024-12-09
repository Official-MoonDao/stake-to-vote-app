import CitizenABI from 'const/abis/Citizen.json'
import { CITIZEN_ADDRESSES } from 'const/config'
import { blockedCitizens } from 'const/whitelist'
import { initSDK } from '../thirdweb/thirdweb'
import { getChain } from '../thirdweb/thirdwebChains'
import { slugsToShortSlugs } from '../thirdweb/thirdwebSlugs'
import { getAttribute } from '../utils/nft'

export default async function getAllValidCitizens() {
  const allCitizens: Record<string, any> = {}

  await Promise.all(
    Object.entries(CITIZEN_ADDRESSES).map(async ([chainSlug, address]) => {
      const now = Math.floor(Date.now() / 1000)
      const chain = await getChain(chainSlug)
      if (!chain) return

      const sdk = initSDK(chain)
      const citizenContract = await sdk.getContract(address, CitizenABI)

      const totalCitizens = await citizenContract.call('totalSupply')

      const citizens = []
      for (let i = 0; i < totalCitizens.toNumber(); i++) {
        const citizen = await citizenContract.erc721.get(i)
        const view = getAttribute(
          citizen.metadata.attributes as any[],
          'view'
        )?.value
        const expiresAt = await citizenContract.call('expiresAt', [
          citizen.metadata.id,
        ])
        if (
          view === 'public' &&
          !blockedCitizens.includes(citizen.metadata.id) &&
          expiresAt.toNumber() > now
        ) {
          citizens.push({
            ...citizen,
            slug: chainSlug,
            shortSlug:
              slugsToShortSlugs[chainSlug as keyof typeof slugsToShortSlugs],
          })
        }
      }

      allCitizens[chain.slug] = citizens.reverse()
    })
  )

  const all = Object.values(allCitizens).flat()

  return { ...allCitizens, all }
}
