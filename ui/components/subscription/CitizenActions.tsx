import {
  ArrowUpRightIcon,
  GlobeAmericasIcon,
  LockClosedIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Frame from '@/components/layout/Frame'
import Action from '@/components/subscription/Action'
import SlidingCardMenu from '../layout/SlidingCardMenu'

type CitizenActionsProps = {
  address?: string
  nft?: any
  incompleteProfile?: boolean
  mooneyBalance?: number
  vmooneyBalance?: number
  setCitizenMetadataModalEnabled: Function
}

export default function CitizenActions({
  address,
  nft,
  incompleteProfile,
  mooneyBalance,
  vmooneyBalance,
  setCitizenMetadataModalEnabled,
}: CitizenActionsProps) {
  const router = useRouter()

  const [hasMooney, setHasMooney] = useState<boolean>(false)
  const [hasVmooney, setHasVmooney] = useState<boolean>(false)

  useEffect(() => {
    if (mooneyBalance && mooneyBalance > 0) setHasMooney(true)
    if (vmooneyBalance && vmooneyBalance > 0) setHasVmooney(true)
  }, [mooneyBalance, vmooneyBalance])

  return (
    <div id="citizen-actions-container" className="py-5 px-5 md:py-0 z-30">
      {address === nft?.owner && (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 pr-12">
            <div className="flex gap-5 opacity-[50%]">
              <h2 className="header font-GoodTimes">Next Steps</h2>
            </div>
          </div>
          <div className="px-5 pt-5 md:px-0 md:pt-0">
            <Frame
              noPadding
              marginBottom="0px"
              bottomRight="2vmax"
              topRight="2vmax"
              topLeft="10px"
              bottomLeft="2vmax"
            >
              <SlidingCardMenu>
                {/* <div
                  className={`mt-2 mb-5 grid grid-cols-1 lg:grid-cols-3 ${
                    incompleteProfile && '2xl:grid-cols-4'
                  } gap-4 h-full`}
                > */}
                <div className="flex gap-5">
                  {incompleteProfile && (
                    <Action
                      title="Complete Profile"
                      description="Complete your profile by adding a bio, social links, or your location."
                      icon={<UserIcon height={30} width={30} />}
                      onClick={() => setCitizenMetadataModalEnabled(true)}
                    />
                  )}
                  {!hasMooney && !hasVmooney && (
                    <>
                      <Action
                        title="Get Mooney"
                        description="$MOONEY is our governance token, swap directly from within the website."
                        icon={
                          <Image
                            src="/assets/icon-job.svg"
                            alt="Browse open jobs"
                            height={30}
                            width={30}
                          />
                        }
                        onClick={() => router.push('/get-mooney')}
                      />
                    </>
                  )}
                  {hasMooney && !hasVmooney && (
                    <Action
                      title="Lock to Vote"
                      description="Lock your MOONEY to aquire voting power and vote on proposals."
                      icon={<LockClosedIcon height={30} width={30} />}
                      onClick={() => router.push('/lock')}
                    />
                  )}
                  <Action
                    title="Create Project"
                    description="Submit a proposal to secure funding for your space project."
                    icon={
                      <Image
                        src="/assets/icon-project.svg"
                        alt="Submit a proposal"
                        height={30}
                        width={30}
                      />
                    }
                    onClick={() => router.push('/propose')}
                  />
                  <Action
                    title="Get Rewards"
                    description="Get rewarded for mission-aligned work towards a lunar settlement."
                    icon={
                      <Image
                        src="/assets/icon-submit.svg"
                        alt="Get rewards"
                        height={30}
                        width={30}
                      />
                    }
                    onClick={() =>
                      window.open(
                        'https://discord.com/channels/914720248140279868/1179874302447853659'
                      )
                    }
                  />
                  <Action
                    title="Explore the Network Map"
                    description="Connect with fellow members of the Network both locally and globally."
                    icon={<GlobeAmericasIcon height={40} width={40} />}
                    onClick={() => router.push('/map')}
                  />
                  <Action
                    title="Connect to Guild.xyz"
                    description="Join Guild.xyz by connecting your wallet and Discord to unlock new roles."
                    icon={<ArrowUpRightIcon height={30} width={30} />}
                    onClick={() => window.open('https://guild.xyz/moondao')}
                  />
                  {hasVmooney && (
                    <Action
                      title="Create a Team"
                      description="Join a team or create your own to work together on accelerating space."
                      icon={<PlusIcon height={30} width={30} />}
                      onClick={() => router.push('/team')}
                    />
                  )}
                </div>
              </SlidingCardMenu>
            </Frame>
          </div>
        </>
      )}
    </div>
  )
}
