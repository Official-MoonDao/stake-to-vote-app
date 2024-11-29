import { fetchChain } from '@thirdweb-dev/chains'
import CitizenABI from 'const/abis/Citizen.json'
import { CITIZEN_ADDRESSES } from 'const/config'
import { initSDK } from '../thirdweb/thirdweb'

export default async function getAllCitizens() {
  const allCitizens: Record<string, any> = {}

  await Promise.all(
    Object.entries(CITIZEN_ADDRESSES).map(async ([chainId, address]) => {
      const chain = await fetchChain(chainId)
      if (!chain) return

      const sdk = initSDK(chain)
      const citizenContract = await sdk.getContract(address, CitizenABI)

      const totalCitizens = await citizenContract.call('totalSupply')

      const citizens = []
      for (let i = 0; i < totalCitizens.toNumber(); i++) {
        const citizen = await citizenContract.erc721.get(i)
        citizens.push(citizen)
      }

      allCitizens[chain.slug] = citizens
    })
  )

  return allCitizens
}
