// Team Profile Page
import {
  TEAM_ADDRESSES,
  TABLELAND_ENDPOINT,
  TEAM_TABLE_NAMES,
  JOBS_TABLE_ADDRESSES,
  MARKETPLACE_TABLE_ADDRESSES,
  TEAM_TABLE_ADDRESSES,
} from 'const/config'
import { blockedTeams } from 'const/whitelist'
import { GetServerSideProps } from 'next'
import { generatePrettyLinks } from '@/lib/subscription/pretty-links'
import { initSDK } from '@/lib/thirdweb/thirdweb'
import { shortSlugsToChains } from '@/lib/thirdweb/thirdwebSlugs'
import TeamProfilePage from '@/components/subscription/TeamProfilePage'
import JobBoardTableABI from '../../../const/abis/JobBoardTable.json'
import MarketplaceTableABI from '../../../const/abis/MarketplaceTable.json'
import TeamABI from '../../../const/abis/Team.json'
import TeamTableABI from '../../../const/abis/TeamTable.json'

export default function TeamProfile({
  chain,
  tokenId,
  nft,
  imageIpfsLink,
  queriedJob,
  queriedListing,
}: any) {
  return (
    <TeamProfilePage
      chain={chain}
      tokenId={tokenId}
      nft={nft}
      imageIpfsLink={imageIpfsLink}
      queriedJob={queriedJob}
      queriedListing={queriedListing}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const chain = params?.chain as string
  const tokenIdOrName: any = params?.tokenIdOrName
  const thirdwebChain =
    shortSlugsToChains[chain as keyof typeof shortSlugsToChains]

  if (!thirdwebChain) {
    return {
      notFound: true,
    }
  }

  const sdk = initSDK(thirdwebChain)

  const teamTableContract = await sdk?.getContract(
    TEAM_TABLE_ADDRESSES[thirdwebChain.slug],
    TeamTableABI
  )

  const teamTableName = await teamTableContract.call('getTableName')
  const statement = `SELECT name, id FROM ${teamTableName}`
  const allTeamsRes = await fetch(
    `${TABLELAND_ENDPOINT}?statement=${statement}`
  )
  const allTeams = await allTeamsRes.json()
  const { prettyLinks } = generatePrettyLinks(allTeams)

  let tokenId
  if (!Number.isNaN(Number(tokenIdOrName))) {
    tokenId = tokenIdOrName
  } else {
    tokenId = prettyLinks[tokenIdOrName]
  }

  const teamContractAddress = TEAM_ADDRESSES[thirdwebChain.slug]

  if (tokenId === undefined || !teamContractAddress) {
    return {
      notFound: true,
    }
  }

  const teamContract = await sdk.getContract(teamContractAddress, TeamABI)
  const nft = await teamContract.erc721.get(tokenId)

  if (
    !nft ||
    !nft.metadata.uri ||
    blockedTeams.includes(Number(nft.metadata.id))
  ) {
    return {
      notFound: true,
    }
  }

  const rawMetadataRes = await fetch(nft.metadata.uri)
  const rawMetadata = await rawMetadataRes.json()
  const imageIpfsLink = rawMetadata.image

  //Check for a jobId in the url and get the queried job if it exists
  const jobId = query?.job
  let queriedJob = null
  if (jobId !== undefined) {
    const jobTableContract = await sdk.getContract(
      JOBS_TABLE_ADDRESSES[thirdwebChain.slug],
      JobBoardTableABI
    )
    const jobTableName = await jobTableContract.call('getTableName')
    const jobTableStatement = `SELECT * FROM ${jobTableName} WHERE id = ${jobId}`
    const jobRes = await fetch(
      `${TABLELAND_ENDPOINT}?statement=${jobTableStatement}`
    )
    const jobData = await jobRes.json()
    queriedJob = jobData?.[0] || null
  }

  //Check for a listingId in the url and get the queried listing if it exists
  const listingId = query?.listing
  let queriedListing = null
  if (listingId !== undefined) {
    const marketplaceTableContract = await sdk.getContract(
      MARKETPLACE_TABLE_ADDRESSES[thirdwebChain.slug],
      MarketplaceTableABI
    )
    const marketplaceTableName = await marketplaceTableContract.call(
      'getTableName'
    )
    const marketplaceTableStatement = `SELECßT * FROM ${marketplaceTableName} WHERE id = ${listingId}`
    const marketplaceRes = await fetch(
      `${TABLELAND_ENDPOINT}?statement=${marketplaceTableStatement}`
    )
    const marketplaceData = await marketplaceRes.json()
    queriedListing = marketplaceData?.[0] || null
  }

  return {
    props: {
      chain: thirdwebChain,
      nft,
      tokenId,
      imageIpfsLink,
      queriedJob,
      queriedListing,
    },
  }
}
