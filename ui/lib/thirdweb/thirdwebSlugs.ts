import {
  Base,
  Ethereum,
  Sepolia,
  Arbitrum,
  Polygon,
} from '@thirdweb-dev/chains'

export const shortSlugsToChains = {
  eth: Ethereum,
  matic: Polygon,
  arb: Arbitrum,
  ...(process.env.NEXT_PUBLIC_ENV === 'dev' && { sep: Sepolia }),
  base: Base,
}

export const slugsToShortSlugs = {
  ethereum: 'eth',
  polygon: 'polygon',
  arbitrum: 'arb',
  ...(process.env.NEXT_PUBLIC_ENV === 'dev' && { sepolia: 'sep' }),
  base: 'base',
}
