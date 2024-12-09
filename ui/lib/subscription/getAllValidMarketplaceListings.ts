import MarketplaceTableABI from 'const/abis/MarketplaceTable.json'
import TeamABI from 'const/abis/Team.json'
import {
  getTablelandEndpoint,
  MARKETPLACE_TABLE_ADDRESSES,
  TABLELAND_ENDPOINT,
  TEAM_ADDRESSES,
} from 'const/config'
import { initSDK } from '../thirdweb/thirdweb'
import { getChain } from '../thirdweb/thirdwebChains'
import { slugsToShortSlugs } from '../thirdweb/thirdwebSlugs'

export default async function getAllValidMarketplaceListings() {
  const allValidListings: Record<string, any> = {}

  await Promise.all(
    Object.entries(MARKETPLACE_TABLE_ADDRESSES).map(
      async ([chainSlug, address]) => {
        const now = Math.floor(Date.now() / 1000)
        const chain = await getChain(chainSlug)
        if (!chain) return

        const sdk = initSDK(chain)
        const marketplaceTableContract = await sdk.getContract(
          address,
          MarketplaceTableABI
        )
        const marketplaceTableName = await marketplaceTableContract.call(
          'getTableName'
        )

        const statement = `SELECT * FROM ${marketplaceTableName} WHERE (startTime = 0 OR startTime <= ${now}) AND (endTime = 0 OR endTime >= ${now}) ORDER BY id DESC`

        const listingsRes = await fetch(
          `${getTablelandEndpoint(chainSlug)}?statement=${statement}`
        )
        const listings = await listingsRes.json()

        const teamContract = await sdk.getContract(
          TEAM_ADDRESSES[chainSlug],
          TeamABI
        )

        const validListings = listings.filter(async (listing: any) => {
          const teamExpiration = await teamContract.call('expiresAt', [
            listing.teamId,
          ])
          return teamExpiration.toNumber() > now
        })

        validListings.forEach((listing: any) => {
          listing.slug = chainSlug
          listing.shortSlug =
            slugsToShortSlugs[chainSlug as keyof typeof slugsToShortSlugs]
        })

        if (validListings.length > 0) {
          allValidListings[chain.slug] = validListings
        }
      }
    )
  )

  const all = Object.values(allValidListings).flat()

  return { ...allValidListings, all }
}
