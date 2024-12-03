// Team Profile Page
import {
  TEAM_ADDRESSES,
  TABLELAND_ENDPOINT,
  TEAM_TABLE_NAMES,
} from 'const/config'
import { blockedTeams } from 'const/whitelist'
import { GetServerSideProps } from 'next'
import { generatePrettyLinks } from '@/lib/subscription/pretty-links'
import { initSDK } from '@/lib/thirdweb/thirdweb'
import { shortSlugsToChains } from '@/lib/thirdweb/thirdwebSlugs'
import TeamProfilePage from '@/components/subscription/TeamProfilePage'
import TeamABI from '../../../const/abis/Team.json'

export default function TeamProfile({
  chain,
  tokenId,
  nft,
  imageIpfsLink,
}: any) {
  return (
    <TeamProfilePage
      chain={chain}
      tokenId={tokenId}
      nft={nft}
      imageIpfsLink={imageIpfsLink}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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

  const statement = `SELECT name, id FROM ${
    TEAM_TABLE_NAMES[thirdwebChain.slug]
  }`
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

  return {
    props: {
      chain: thirdwebChain,
      nft,
      tokenId,
      imageIpfsLink,
    },
  }
}
