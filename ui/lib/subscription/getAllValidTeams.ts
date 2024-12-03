import { fetchChain } from '@thirdweb-dev/chains'
import TeamABI from 'const/abis/Team.json'
import { TEAM_ADDRESSES } from 'const/config'
import { blockedTeams, featuredTeams } from 'const/whitelist'
import { initSDK } from '../thirdweb/thirdweb'
import { getAttribute } from '../utils/nft'

export default async function getAllValidTeams() {
  const allTeams: Record<string, any> = {}

  await Promise.all(
    Object.entries(TEAM_ADDRESSES).map(async ([chainSlug, address]) => {
      if (chainSlug === 'sepolia' && process.env.NEXT_PUBLIC_ENV === 'prod')
        return
      const now = Math.floor(Date.now() / 1000)
      const chain = await fetchChain(chainSlug)
      if (!chain) return

      const sdk = initSDK(chain)
      const teamContract = await sdk.getContract(address, TeamABI)

      const totalTeams = await teamContract.call('totalSupply')

      const teams = []
      for (let i = 0; i < totalTeams.toNumber(); i++) {
        const team = await teamContract.erc721.get(i)
        const view = getAttribute(
          team.metadata.attributes as any[],
          'view'
        ).value
        const expiresAt = await teamContract.call('expiresAt', [
          team.metadata.id,
        ])
        if (
          view === 'public' &&
          !blockedTeams.includes(team.metadata.id) &&
          expiresAt.toNumber() > now
        ) {
          teams.push({ ...team, slug: chainSlug })
        }
      }

      allTeams[chain.slug] = teams.reverse()
    })
  )

  //Featured sort
  allTeams?.['arbitrum'].sort((a: any, b: any) => {
    const aIsFeatured = featuredTeams.includes(a.metadata.id)
    const bIsFeatured = featuredTeams.includes(b.metadata.id)

    if (aIsFeatured && bIsFeatured) {
      return (
        featuredTeams.indexOf(a.metadata.id) -
        featuredTeams.indexOf(b.metadata.id)
      )
    } else if (aIsFeatured) {
      return -1
    } else if (bIsFeatured) {
      return 1
    } else {
      return 0
    }
  })

  const all = Object.values(allTeams).flat()
  return { ...allTeams, all }
}
