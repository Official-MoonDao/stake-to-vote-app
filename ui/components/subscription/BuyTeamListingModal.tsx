import { XMarkIcon } from '@heroicons/react/24/outline'
import { usePrivy } from '@privy-io/react-auth'
import { Chain } from '@thirdweb-dev/chains'
import { MediaRenderer, useAddress, useSDK } from '@thirdweb-dev/react'
import ERC20ABI from 'const/abis/ERC20.json'
import {
  DAI_ADDRESSES,
  TEAM_ADDRESSES,
  MOONEY_ADDRESSES,
  USDC_ADDRESSES,
} from 'const/config'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CitizenContext from '@/lib/citizen/citizen-context'
import useCitizenEmail from '@/lib/citizen/useCitizenEmail'
import { createSession, destroySession } from '@/lib/iron-session/iron-session'
import useTeamEmail from '@/lib/team/useTeamEmail'
import { initSDK } from '@/lib/thirdweb/thirdweb'
import { TeamListing } from '@/components/subscription/TeamListing'
import Modal from '../layout/Modal'
import { PrivyWeb3Button } from '../privy/PrivyWeb3Button'

type BuyListingModalProps = {
  listing: TeamListing
  listingChain?: Chain
  recipient: string | undefined
  setEnabled: Function
}

export default function BuyTeamListingModal({
  listing,
  listingChain,
  recipient,
  setEnabled,
}: BuyListingModalProps) {
  const { citizen } = useContext(CitizenContext)
  const address = useAddress()
  const { getAccessToken } = usePrivy()

  const [teamNft, setTeamNft] = useState<any>()

  const teamEmail = useTeamEmail(teamNft)

  const [email, setEmail] = useState<string>()
  const [shippingInfo, setShippingInfo] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const citizenEmail = useCitizenEmail(citizen)

  const currencyDecimals: any = {
    ETH: 18,
    MOONEY: 18,
    DAI: 18,
    USDC: 6,
  }

  const currencyAddresses: any = {
    MOONEY: MOONEY_ADDRESSES[listing.slug],
    DAI: DAI_ADDRESSES[listing.slug],
    USDC: USDC_ADDRESSES[listing.slug],
  }

  useEffect(() => {
    async function getTeamNft() {
      if (!listingChain) return
      const sdk = initSDK(listingChain)
      try {
        const teamContract = await sdk?.getContract(
          TEAM_ADDRESSES[listing.slug]
        )
        const nft = await teamContract?.erc721.get(listing.teamId)
        setTeamNft(nft)
      } catch (err) {
        setTeamNft(null)
      }
    }
    getTeamNft()
  }, [listing, listingChain])

  useEffect(() => {
    if (citizenEmail) {
      setEmail(citizenEmail)
    }
  }, [citizenEmail])

  async function buyListing() {
    let price

    if (citizen) {
      price = +listing.price
    } else {
      price = +listing.price + +listing.price * 0.1 // 10% upcharge for non-citizens
    }

    setIsLoading(true)
    if (!listingChain) return
    const sdk = initSDK(listingChain)

    const accessToken = await getAccessToken()
    await createSession(accessToken)

    let receipt
    try {
      if (+listing.price <= 0) {
        receipt = true
      } else if (listing.currency === 'ETH') {
        // buy with eth
        const signer = sdk?.getSigner()
        const tx = await signer?.sendTransaction({
          to: recipient,
          value: String(price * 10 ** 18),
        })
        receipt = await tx?.wait()
      } else {
        // buy with erc20
        const currencyContract = await sdk?.getContract(
          currencyAddresses?.[listing.currency],
          ERC20ABI as any
        )
        const tx = await currencyContract?.call('transfer', [
          recipient,
          String(price * 10 ** currencyDecimals[listing.currency]),
        ])
        receipt = tx.receipt
      }

      if (receipt) {
        const etherscanUrl =
          process.env.NEXT_PUBLIC_CHAIN === 'mainnet'
            ? 'https://arbiscan.io/tx/'
            : 'https://sepolia.etherscan.io/tx/'

        const transactionLink =
          +listing.price <= 0 ? 'none' : etherscanUrl + receipt.transactionHash

        const shipping = Object.values(shippingInfo).join(', ')

        //send email to entity w/ purchase details
        const res = await fetch('/api/marketplace/marketplace-purchase', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            address,
            email,
            item: listing.title,
            value: price,
            originalValue: +listing.price,
            currency: listing.currency,
            decimals: currencyDecimals[listing.currency],
            quantity: 1,
            txLink: transactionLink,
            txHash: receipt.transactionHash,
            recipient,
            isCitizen: citizen ? true : false,
            shipping,
            teamEmail,
          }),
        })

        const { success, message } = await res.json()

        if (success) {
          toast.success(
            "Successfull purchase! You'll receive an email shortly.",
            {
              duration: 10000,
            }
          )
        } else {
          console.log(message)
          toast.error('Something went wrong, please contact support.', {
            duration: 10000,
          })
        }
      }

      setEnabled(false)
    } catch (err: any) {
      console.log(err)
      if (err && !err.message.startsWith('user rejected transaction')) {
        toast.error('Insufficient funds')
      }
    }
    await destroySession(accessToken)
    setIsLoading(false)
  }

  //There is a bug where setEnabled can't be called from a button in the main component
  function Close() {
    const [close, setClose] = useState(false)

    useEffect(() => {
      if (close) setEnabled(false)
    }, [close])

    return (
      <button
        type="button"
        className="flex h-10 w-10 border-2 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={() => setClose(true)}
      >
        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    )
  }

  return (
    <Modal id="team-marketplace-buy-modal-backdrop" setEnabled={setEnabled}>
      <div className="w-full rounded-[2vmax] flex flex-col gap-2 items-start justify-start w-auto md:w-[500px] p-5  bg-dark-cool h-screen md:h-auto">
        <form
          className="w-full flex flex-col gap-2 items-start justify-start"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="font-GoodTimes">{'Buy a Listing'}</h2>
            </div>
            <Close />
          </div>
          <div>
            {listing.image && (
              <div
                id="image-container"
                className="rounded-[20px] overflow-hidden my flex flex-wrap w-full"
              >
                <MediaRenderer src={listing.image} width="100%" height="100%" />
              </div>
            )}

            <div className="mt-4">
              <p>{`# ${listing.id}`}</p>
              <p className="font-GoodTimes">{listing.title}</p>
              <p className="text-[75%]">{listing.description}</p>
              <p id="listing-price" className="font-bold">{`${
                citizen ? listing.price : +listing.price * 1.1
              } ${listing.currency}`}</p>
            </div>
          </div>
          <p className="opacity-60">
            Enter your information, confirm the transaction and wait to receive
            an email from the vendor.
          </p>
          <input
            className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
            placeholder="Enter your email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          {listing.shipping === 'true' && (
            <div className="w-full flex flex-col gap-2">
              <input
                className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
                placeholder="Street Address"
                value={shippingInfo.streetAddress}
                onChange={({ target }) =>
                  setShippingInfo({
                    ...shippingInfo,
                    streetAddress: target.value,
                  })
                }
              />
              <div className="w-full flex gap-2">
                <input
                  className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={({ target }) =>
                    setShippingInfo({ ...shippingInfo, city: target.value })
                  }
                />
                <input
                  className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
                  placeholder="State"
                  value={shippingInfo.state}
                  onChange={({ target }) =>
                    setShippingInfo({ ...shippingInfo, state: target.value })
                  }
                />
              </div>
              <div className="w-full flex gap-2">
                <input
                  className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
                  placeholder="Postal Code"
                  value={shippingInfo.postalCode}
                  onChange={({ target }) =>
                    setShippingInfo({
                      ...shippingInfo,
                      postalCode: target.value,
                    })
                  }
                />
                <input
                  className="w-full p-2 border-2 dark:border-0 dark:bg-[#0f152f] rounded-sm"
                  placeholder="Country"
                  value={shippingInfo.country}
                  onChange={({ target }) =>
                    setShippingInfo({ ...shippingInfo, country: target.value })
                  }
                />
              </div>
            </div>
          )}
          <PrivyWeb3Button
            requiredChain={listingChain}
            label="Buy"
            action={async () => {
              if (!email || email.trim() === '' || !email.includes('@'))
                return toast.error('Please enter a valid email')
              if (listing.shipping === 'true') {
                if (
                  shippingInfo.streetAddress.trim() === '' ||
                  shippingInfo.city.trim() === '' ||
                  shippingInfo.state.trim() === '' ||
                  shippingInfo.postalCode.trim() === '' ||
                  shippingInfo.country.trim() === ''
                )
                  return toast.error('Please fill out all fields')
              }
              buyListing()
            }}
            className="mt-4 w-full gradient-2 rounded-[5vmax]"
            isDisabled={isLoading || !teamEmail || !recipient}
          />
          {isLoading && (
            <p>Do not leave the page until the transaction is complete.</p>
          )}
        </form>
      </div>
    </Modal>
  )
}
