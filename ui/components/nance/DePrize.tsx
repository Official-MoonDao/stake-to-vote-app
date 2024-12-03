import { Arbitrum, Sepolia } from '@thirdweb-dev/chains'
import { useAddress, useContract } from '@thirdweb-dev/react'
import CompetitorABI from 'const/abis/Competitor.json'
import ERC20 from 'const/abis/ERC20.json'
import REVDeployer from 'const/abis/REVDeployer.json'
import TeamABI from 'const/abis/Team.json'
import { CompetitorPreview } from '@/components/nance/CompetitorPreview'
import {
  DEPRIZE_DISTRIBUTION_TABLE_ADDRESSES,
  DEPRIZE_ID,
  PRIZE_TOKEN_ADDRESSES,
  COMPETITOR_TABLE_ADDRESSES,
  PRIZE_DECIMALS,
  REVNET_ADDRESSES,
  PRIZE_REVNET_ID,
  BULK_TOKEN_SENDER_ADDRESSES,
} from 'const/config'
import { TEAM_ADDRESSES } from 'const/config'
import { HATS_ADDRESS } from 'const/config'
import { BigNumber } from 'ethers'
import _ from 'lodash'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useCitizens } from '@/lib/citizen/useCitizen'
import { useAssets } from '@/lib/dashboard/hooks'
import { useTeamWearer } from '@/lib/hats/useTeamWearer'
import toastStyle from '@/lib/marketplace/marketplace-utils/toastConfig'
import { SNAPSHOT_SPACE_NAME } from '@/lib/nance/constants'
import useIsOperator from '@/lib/revnet/hooks/useIsOperator'
import useWindowSize from '@/lib/team/use-window-size'
import useTokenSupply from '@/lib/tokens/hooks/useTokenSupply'
import useWatchTokenBalance from '@/lib/tokens/hooks/useWatchTokenBalance'
import { getBudget, getPayouts } from '@/lib/utils/rewards'
import { runQuadraticVoting } from '@/lib/utils/voting'
import Asset from '@/components/dashboard/treasury/balance/Asset'
import { Hat } from '@/components/hats/Hat'
import Container from '@/components/layout/Container'
import ContentLayout from '@/components/layout/ContentLayout'
import Head from '@/components/layout/Head'
import { NoticeFooter } from '@/components/layout/NoticeFooter'
import { JoinDePrizeModal } from '@/components/nance/JoinDePrizeModal'
import StandardButton from '../layout/StandardButton'
import { useVotingPowers } from '@/lib/snapshot'
import useTokenBalances from '@/lib/tokens/hooks/useTokenBalances'

export type Metadata = {
  social: string
}
export type Competitor = {
  id: string
  deprize: number
  teamId: number
  metadata: Metadata
}
export type Distribution = {
  deprize: number
  address: string
  timestamp: number
  distribution: { [key: string]: number }
}

export type DePrizeProps = {
  competitors: Competitor[]
  distributions: Distribution[]
  refreshRewards: () => void
}

export function DePrize({
  competitors,
  distributions,
  refreshRewards,
}: DePrizeProps) {
  const chain = process.env.NEXT_PUBLIC_CHAIN === 'mainnet' ? Arbitrum : Sepolia
  const { isMobile } = useWindowSize()

  const userAddress = useAddress()
  const quarter = Math.floor((new Date().getMonth() + 3) / 3) - 1

  const { contract: prizeContract } = useContract(
    PRIZE_TOKEN_ADDRESSES[chain.slug],
    ERC20.abi
  )
  const { contract: revnetContract } = useContract(
    REVNET_ADDRESSES[chain.slug],
    REVDeployer
  )
  const { contract: competitorContract } = useContract(
    COMPETITOR_TABLE_ADDRESSES[chain.slug],
    CompetitorABI
  )
  const { contract: distributionTableContract } = useContract(
    DEPRIZE_DISTRIBUTION_TABLE_ADDRESSES[chain.slug]
  )
  const { contract: teamContract } = useContract(TEAM_ADDRESSES[chain.slug])

  const [edit, setEdit] = useState(false)
  const [distribution, setDistribution] = useState<{ [key: string]: number }>(
    {}
  )
  // Check if the user already has a distribution
  useEffect(() => {
    if (distributions && userAddress) {
      for (const d of distributions) {
        if (d.address.toLowerCase() === userAddress.toLowerCase()) {
          setDistribution(d.distribution)
          setEdit(true)
          break
        }
      }
    }
  }, [userAddress, distributions])

  const prizeBalance = useWatchTokenBalance(prizeContract, PRIZE_DECIMALS)
  const userHasVotingPower = prizeBalance > 0
  const prizeSupply = useTokenSupply(prizeContract, PRIZE_DECIMALS)
  const prizeBudget = prizeSupply * 0.1
  const winnerPool = prizeSupply * 0.3
  const prizePrice = 1

  const [joinModalOpen, setJoinModalOpen] = useState(false)

  const userTeams = useTeamWearer(teamContract, chain, userAddress)

  const isCompetitor = userTeams.some((team) =>
    competitors.some(
      (competitor) => competitor.teamId.toString() === team.teamId
    )
  )
  const handleJoinWithTeam = async (teamId: string) => {
    try {
      await competitorContract?.call('insertIntoTable', [
        DEPRIZE_ID,
        teamId,
        '{}',
      ])
      toast.success('Joined as a competitor!', {
        style: toastStyle,
      })
      setJoinModalOpen(false)
      setTimeout(() => {
        refreshRewards()
      }, 5000)
    } catch (error) {
      console.error('Error joining as a competitor:', error)
      toast.error('Error joining as a competitor. Please try again.', {
        style: toastStyle,
      })
    }
  }
  const handleDistributionChange = (competitorId: string, value: number) => {
    setDistribution((prev) => ({
      ...prev,
      [competitorId]: Math.min(100, Math.max(1, value)),
    }))
  }
  const handleSubmit = async () => {
    const totalPercentage = Object.values(distribution).reduce(
      (sum, value) => sum + value,
      0
    )
    if (totalPercentage !== 100) {
      toast.error('Total distribution must equal 100%', {
        style: toastStyle,
      })
      return
    }
    try {
      await distributionTableContract?.call('insertIntoTable', [
        DEPRIZE_ID,
        JSON.stringify(distribution),
      ])
      toast.success('Distribution submitted successfully!', {
        style: toastStyle,
      })
      setTimeout(() => {
        refreshRewards()
      }, 5000)
    } catch (error) {
      console.error('Error submitting distribution:', error)
      toast.error('Error submitting distribution. Please try again.', {
        style: toastStyle,
      })
    }
  }

  return (
    <section id="rewards-container" className="overflow-hidden">
      <Head
        title="DePrize"
        description="Distribute rewards to contributors based on their contributions."
      />
      <Container>
        <ContentLayout
          header={'DePrize'}
          description="Distribute rewards to contributors based on their contributions."
          headerSize="max(20px, 3vw)"
          preFooter={<NoticeFooter />}
          mainPadding
          mode="compact"
          popOverEffect={false}
          isProfile
        >
          {!isCompetitor && (
            <>
              <StandardButton
                onClick={() => setJoinModalOpen(true)}
                className="gradient-2 rounded-full"
              >
                Join
              </StandardButton>
              {joinModalOpen && (
                <JoinDePrizeModal
                  userTeams={userTeams}
                  setJoinModalOpen={setJoinModalOpen}
                  teamContract={teamContract}
                  handleJoinWithTeam={handleJoinWithTeam}
                />
              )}
            </>
          )}
          <section
            className={`w-full flex ${
              isMobile ? 'flex-col items-center' : 'flex-row items-start'
            }`}
          >
            <section
              className={`mt-8 flex flex-col ${isMobile ? '' : 'w-1/3'}`}
            >
              <h3 className="title-text-colors text-2xl font-GoodTimes">
                Total Q{quarter} Rewards
              </h3>
              <Asset
                name="PRIZE"
                amount={Number(prizeBudget.toPrecision(3)).toLocaleString()}
                usd={Number(
                  (prizeBudget * prizePrice).toPrecision(3)
                ).toLocaleString()}
              />
            </section>
            {userAddress && (
              <section
                className={`mt-8 flex flex-col px-4 ${isMobile ? '' : 'w-1/3'}`}
              >
                <h3 className="title-text-colors text-2xl font-GoodTimes">
                  Winner Prize
                </h3>
                <Asset name="PRIZE" amount={String(winnerPool)} usd="" />
              </section>
            )}
            {userAddress && (
              <section
                className={`mt-8 flex flex-col px-4 ${isMobile ? '' : 'w-1/3'}`}
              >
                <h3 className="title-text-colors text-2xl font-GoodTimes">
                  Voting Power
                </h3>
                <Asset name="PRIZE" amount={String(prizeBalance)} usd="" />
              </section>
            )}
          </section>
          <div className="pb-32 w-full flex flex-col gap-4 py-2">
            <div className="flex justify-between items-center">
              <h3 className="title-text-colors text-2xl font-GoodTimes">
                Distribute
              </h3>
              {readyToRunVoting && (
                <h3 className="title-text-colors text-2xl font-GoodTimes">
                  Estimated Rewards
                </h3>
              )}
            </div>
            <div>
              {competitors &&
                competitors.map((competitor, i: number) => (
                  <div
                    key={i}
                    className="flex items-center w-full py-1 text-[17px]"
                  >
                    <div className="w-24">
                      <input
                        type="number"
                        value={distribution[competitor.id] || ''}
                        onChange={(e) =>
                          handleDistributionChange(
                            competitor.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 w-20"
                        style={{
                          backgroundColor: 'var(--black)',
                        }}
                        min="1"
                        max="100"
                        disabled={!userAddress || !userHasVotingPower}
                      />
                      <span>%</span>
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="flex-1 px-8">
                      <CompetitorPreview
                        teamId={competitor.teamId}
                        teamContract={teamContract}
                      />
                    </div>
                  </div>
                ))}
            </div>
            {competitors && userHasVotingPower ? (
              <span>
                <StandardButton
                  onClick={handleSubmit}
                  className="gradient-2 rounded-full"
                >
                  {edit ? 'Edit Distribution' : 'Submit Distribution'}
                </StandardButton>
                {edit && (
                  <StandardButton
                    onClick={handleDelete}
                    className="gradient-1 rounded-full"
                  >
                    Delete Distribution
                  </StandardButton>
                )}
              </span>
            ) : (
              <span>
                <StandardButton
                  link={`https://revnet.app/${chain.slug}/${PRIZE_REVNET_ID}`}
                  className="gradient-2 rounded-full"
                >
                  Get Voting Power
                </StandardButton>
              </span>
            )}
          </div>
        </ContentLayout>
      </Container>
    </section>
  )
}
