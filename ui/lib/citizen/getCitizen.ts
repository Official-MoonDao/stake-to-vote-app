import CitizenABI from 'const/abis/Citizen.json'
import { CITIZEN_ADDRESSES } from 'const/config'
import { initSDK } from '../thirdweb/thirdweb'
import { getChain } from '../thirdweb/thirdwebChains'
import { slugsToShortSlugs } from '../thirdweb/thirdwebSlugs'
import { CitizenNFT } from './citizen-context'

export default async function getCitizen(citizenAddress: string) {
  let citizen: CitizenNFT
  const citizenPromises = Object.entries(CITIZEN_ADDRESSES).map(
    async ([chainSlug, contractAddress]) => {
      try {
        const chain = await getChain(chainSlug)
        if (!chain) return
        const sdk = initSDK(chain)
        const citizenContract = await sdk?.getContract(
          contractAddress,
          CitizenABI
        )

        const ownedTokenId = await citizenContract?.call('getOwnedToken', [
          citizenAddress,
        ])
        const nft = await citizenContract?.erc721.get(ownedTokenId)
        if (nft) {
          return {
            ...nft,
            slug: chainSlug,
            shortSlug:
              slugsToShortSlugs[chainSlug as keyof typeof slugsToShortSlugs] ||
              '',
          } as CitizenNFT
        }
      } catch (err) {
        return undefined
      }
    }
  )

  const citizens = await Promise.all(citizenPromises)
  citizen = citizens.find((c) => c !== undefined)
  return citizen
}
