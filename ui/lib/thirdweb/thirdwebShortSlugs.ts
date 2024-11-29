import {
  Base,
  Ethereum,
  Sepolia,
  Arbitrum,
  Polygon,
} from '@thirdweb-dev/chains'

const thirdwebShortSlugs = {
  eth: Ethereum,
  matic: Polygon,
  arb: Arbitrum,
  ...(process.env.NEXT_PUBLIC_ENV === 'dev' && { sep: Sepolia }),
  base: Base,
}

export default thirdwebShortSlugs
