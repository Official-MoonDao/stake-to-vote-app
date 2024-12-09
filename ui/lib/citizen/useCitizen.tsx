import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Chain } from '@thirdweb-dev/chains'
import { useSDK } from '@thirdweb-dev/react'
import CitizenABI from 'const/abis/Citizen.json'
import { CITIZEN_ADDRESSES } from 'const/config'
import { useContext, useEffect, useState } from 'react'
import PrivyWalletContext from '../privy/privy-wallet-context'
import { initSDK } from '../thirdweb/thirdweb'
import { getChain } from '../thirdweb/thirdwebChains'
import { CitizenNFT } from './citizen-context'
import getCitizen from './getCitizen'

export function useCitizen(citizenAddress?: string) {
  const { selectedWallet } = useContext(PrivyWalletContext)
  const { wallets } = useWallets()
  const { authenticated } = usePrivy()
  const [citizenNFT, setCitizenNFT] = useState<CitizenNFT>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getCitizenNFTByAddress() {
      if (!authenticated) return setCitizenNFT(undefined)

      const citizen = await getCitizen(
        citizenAddress || wallets[selectedWallet]?.address
      )

      if (citizen) {
        setCitizenNFT(citizen)
      } else {
        setCitizenNFT(null)
      }
      setIsLoading(false)
    }

    getCitizenNFTByAddress()
  }, [wallets, citizenAddress, authenticated])

  return { citizen: citizenNFT, isLoading }
}

export function useCitizens(selectedChain: Chain, citizenAddresses: string[]) {
  const sdk = useSDK()
  const [areCitizens, setAreCitizens] = useState<boolean[]>([])

  useEffect(() => {
    async function getAreCitizens() {
      try {
        const areCitizens = await Promise.all(
          citizenAddresses.map(async (address) => {
            return Object.entries(CITIZEN_ADDRESSES).some(
              async ([chainSlug, contractAddress]) => {
                const chain = await getChain(chainSlug)
                if (!chain) return false
                const sdk = initSDK(chain)
                const citizenContract = await sdk?.getContract(
                  contractAddress,
                  CitizenABI
                )
                const ownedTokenId = await citizenContract?.call(
                  'getOwnedToken',
                  [address]
                )
                return !!ownedTokenId
              }
            )
          })
        )

        setAreCitizens(areCitizens)
      } catch (err: any) {
        console.error(err)
      }
    }

    if (sdk && selectedChain) getAreCitizens()
  }, [])

  return areCitizens
}
