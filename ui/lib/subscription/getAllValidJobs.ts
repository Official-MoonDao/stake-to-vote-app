import JobsTableABI from 'const/abis/JobBoardTable.json'
import TeamABI from 'const/abis/Team.json'
import {
  getTablelandEndpoint,
  JOBS_TABLE_ADDRESSES,
  TEAM_ADDRESSES,
} from 'const/config'
import { initSDK } from '../thirdweb/thirdweb'
import { getChain } from '../thirdweb/thirdwebChains'
import { slugsToShortSlugs } from '../thirdweb/thirdwebSlugs'

export default async function getAllValidJobs() {
  const allValidJobs: Record<string, any> = {}

  await Promise.all(
    Object.entries(JOBS_TABLE_ADDRESSES).map(async ([chainSlug, address]) => {
      const now = Math.floor(Date.now() / 1000)
      const chain = await getChain(chainSlug)
      if (!chain) return

      const sdk = initSDK(chain)
      const jobsTableContract = await sdk.getContract(address, JobsTableABI)
      const jobsTableName = await jobsTableContract.call('getTableName')

      const statement = `SELECT * FROM ${jobsTableName} WHERE (endTime = 0 OR endTime >= ${now}) ORDER BY id DESC`

      const jobsRes = await fetch(
        `${getTablelandEndpoint(chainSlug)}?statement=${statement}`
      )
      const jobs = await jobsRes.json()

      const teamContract = await sdk.getContract(
        TEAM_ADDRESSES[chainSlug],
        TeamABI
      )

      const validJobs = jobs.filter(async (job: any) => {
        const teamExpiration = await teamContract.call('expiresAt', [
          job.teamId,
        ])
        return teamExpiration.toNumber() > now
      })

      validJobs.forEach((job: any) => {
        job.slug = chainSlug
        job.shortSlug =
          slugsToShortSlugs[chainSlug as keyof typeof slugsToShortSlugs]
      })

      if (validJobs.length > 0) {
        allValidJobs[chain.slug] = validJobs
      }
    })
  )

  const all = Object.values(allValidJobs).flat()

  return { ...allValidJobs, all }
}
