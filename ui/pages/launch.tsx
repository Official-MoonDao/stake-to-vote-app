import HatsABI from 'const/abis/Hats.json'
import MissionCreatorABI from 'const/abis/MissionCreator.json'
import MissionTableABI from 'const/abis/MissionTable.json'
import TeamABI from 'const/abis/Team.json'
import {
  DEFAULT_CHAIN_V5,
  HATS_ADDRESS,
  MISSION_CREATOR_ADDRESSES,
  MISSION_TABLE_ADDRESSES,
  TEAM_ADDRESSES,
} from 'const/config'
import React, { useContext, useState } from 'react'
import { getContract, readContract } from 'thirdweb'
import queryTable from '@/lib/tableland/queryTable'
import { getChainSlug } from '@/lib/thirdweb/chain'
import ChainContextV5 from '@/lib/thirdweb/chain-context-v5'
import { serverClient } from '@/lib/thirdweb/client'
import useContract from '@/lib/thirdweb/hooks/useContract'
import Container from '../components/layout/Container'
import StandardButton from '@/components/layout/StandardButton'
import CreateMission from '@/components/mission/CreateMission'
import MissionCard from '@/components/mission/MissionCard'

export default function Launch({ missions }: any) {
  const { selectedChain } = useContext(ChainContextV5)
  const chainSlug = getChainSlug(selectedChain)

  const [isCreatingMission, setIsCreatingMission] = useState(false)

  const teamContract = useContract({
    address: TEAM_ADDRESSES[chainSlug],
    chain: selectedChain,
    abi: TeamABI as any,
  })

  const missionCreatorContract = useContract({
    address: MISSION_CREATOR_ADDRESSES[chainSlug],
    chain: selectedChain,
    abi: MissionCreatorABI as any,
  })

  const hatsContract = useContract({
    address: HATS_ADDRESS,
    chain: selectedChain,
    abi: HatsABI as any,
  })

  if (isCreatingMission) {
    return (
      <CreateMission
        selectedChain={selectedChain}
        missionCreatorContract={missionCreatorContract}
        teamContract={teamContract}
        hatsContract={hatsContract}
        setIsCreatingMission={setIsCreatingMission}
      />
    )
  }

  return (
    <section className="overflow-auto">
      <Container>
        <div className="w-full md:w-[90%] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <h1 className="mt-24 font-GoodTimes text-4xl">Launch Pad</h1>
            <p className="text-center text-2xl font-bold">
              Raise Funds. Launch Missions. Accelerate Space.
            </p>
            <p className="max-w-[800px]">
              Join the first onchain fundraising platform designed exclusively
              for space missions. MoonDAO’s Launch Pad empowers teams to raise
              funds transparently, manage their treasuries independently, and
              take their space exploration ideas from concept to fully funded
              launch.
            </p>
          </div>

          <div className="w-full max-w-[800px] mt-8 flex gap-[25%] items-center justify-center">
            <StandardButton className="gradient-2" hoverEffect={false}>
              Explore Missions
            </StandardButton>
            <StandardButton
              className="gradient-2"
              hoverEffect={false}
              onClick={() => setIsCreatingMission(true)}
            >
              Launch a Mission
            </StandardButton>
          </div>

          <div className="mt-8 flex gap-4">
            {missions && missions.length > 0 ? (
              missions.map((mission: any) => (
                <MissionCard
                  key={`mission-card-${mission.id}`}
                  mission={mission}
                  teamContract={teamContract}
                />
              ))
            ) : (
              <p>No missions found</p>
            )}
          </div>

          <div className="w-full mt-8 flex flex-col gap-4">
            <h2 className="font-bold text-xl">
              Built for New Space Innovation
            </h2>
            <p>{`Whether you're launching a nanosatellite, testing lunar ISRU tech, or sending humans to space, MoonDAO’s Launch Pad provides the tools you need to turn your vision into reality while tapping into a global network of backers and funding that are passionate about space, as well as leading space companies and service providers that are already part of the Space Acceleration Network.`}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export async function getStaticProps() {
  const chain = DEFAULT_CHAIN_V5
  const chainSlug = getChainSlug(chain)
  const missionTableContract = getContract({
    client: serverClient,
    address: MISSION_TABLE_ADDRESSES[chainSlug],
    chain,
    abi: MissionTableABI as any,
  })

  const missionTableName = await readContract({
    contract: missionTableContract,
    method: 'getTableName' as string,
  })

  const statement = `SELECT * FROM ${missionTableName}`

  const missions = await queryTable(chain, statement)

  return {
    props: {
      missions,
    },
  }
}
