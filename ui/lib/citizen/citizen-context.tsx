import { NFT } from '@thirdweb-dev/sdk'
import { createContext } from 'react'

export type CitizenNFT =
  | (NFT & { slug: string; shortSlug: string })
  | undefined
  | null

const CitizenContext = createContext<{
  citizen: CitizenNFT
  setCitizen: (citizen: CitizenNFT) => void
}>({
  citizen: undefined,
  setCitizen: (citizen: CitizenNFT) => {},
})

export default CitizenContext
