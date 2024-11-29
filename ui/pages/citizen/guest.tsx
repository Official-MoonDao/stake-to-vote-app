//Citizen Profile
import { Arbitrum } from '@thirdweb-dev/chains'
import { GetServerSideProps } from 'next'
import CitizenProfilePage from '@/components/subscription/CitizenProfilePage'

export default function CitizenDetailPage({
  chain,
  nft,
  tokenId,
  imageIpfsLink,
}: any) {
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
  const nft = {
    metadata: {
      name: 'Your Name Here',
      description:
        'Start your journey with the Space Acceleration Network by funding your wallet and becoming a Citizen to unlock a myriad of benefits.',
      image: '/assets/citizen-default.png',
      uri: '',
      id: 'guest',
      attributes: [
        {
          trait_type: 'location',
          value: '',
        },
        {
          trait_type: 'view',
          value: 'public',
        },
      ],
    },
    owner: '',
  }

  const tokenId = 'guest'

  const imageIpfsLink = ''

  return {
    props: {
      chain: Arbitrum,
      nft,
      tokenId,
      imageIpfsLink,
    },
  }
}
