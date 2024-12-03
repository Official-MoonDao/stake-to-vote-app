//Citizen Profile
import { Chain } from '@thirdweb-dev/chains'
import { NFT } from '@thirdweb-dev/sdk'
import CitizenABI from 'const/abis/Citizen.json'
import CitizenTableABI from 'const/abis/CitizenTable.json'
import {
  CITIZEN_ADDRESSES,
  CITIZEN_TABLE_ADDRESSES,
  TABLELAND_ENDPOINT,
} from 'const/config'
import { blockedCitizens } from 'const/whitelist'
import { GetServerSideProps } from 'next'
import { generatePrettyLinks } from '@/lib/subscription/pretty-links'
import { initSDK } from '@/lib/thirdweb/thirdweb'
import { shortSlugsToChains } from '@/lib/thirdweb/thirdwebSlugs'
import CitizenProfilePage from '@/components/subscription/CitizenProfilePage'

type CitizenProfilePageProps = {
  chain: Chain
  nft: NFT
  tokenId: string
  imageIpfsLink: string
}

export default function CitizenProfile({
  chain,
  nft,
  tokenId,
  imageIpfsLink,
}: CitizenProfilePageProps) {
  return (
    <CitizenProfilePage
      chain={chain}
      nft={nft}
      tokenId={tokenId}
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

  let tokenId, imageIpfsLink
  const sdk = initSDK(thirdwebChain)

  const citizenTableContract = await sdk.getContract(
    CITIZEN_TABLE_ADDRESSES[thirdwebChain.slug],
    CitizenTableABI
  )

  const citizenTableName = await citizenTableContract.call('getTableName')

  const statement = `SELECT name, id FROM ${citizenTableName}`
  const allCitizensRes = await fetch(
    `${TABLELAND_ENDPOINT}?statement=${statement}`
  )
  const allCitizens = await allCitizensRes.json()

  const { prettyLinks } = generatePrettyLinks(allCitizens, {
    allHaveTokenId: true,
  })

  if (!Number.isNaN(Number(tokenIdOrName))) {
    tokenId = tokenIdOrName
  } else {
    tokenId = prettyLinks[tokenIdOrName]
  }

  const citizenContractAddress = CITIZEN_ADDRESSES?.[thirdwebChain.slug]

  if (!citizenContractAddress || tokenId === undefined) {
    return {
      notFound: true,
    }
  }

  const citizenContract = await sdk.getContract(
    citizenContractAddress,
    CitizenABI
  )
  const nft = await citizenContract.erc721.get(tokenId)

  if (!nft || !nft.metadata.uri || blockedCitizens.includes(nft.metadata.id)) {
    return {
      notFound: true,
    }
  }

  const rawMetadataRes = await fetch(nft.metadata.uri)
  const rawMetadata = await rawMetadataRes.json()
  imageIpfsLink = rawMetadata.image

  return {
    props: {
      chain: thirdwebChain,
      nft,
      tokenId,
      imageIpfsLink,
    },
  }
}
