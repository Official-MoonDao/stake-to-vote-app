import { useContext } from 'react'
import CitizenContext from '@/lib/citizen/citizen-context'
import { useCitizen } from '@/lib/citizen/useCitizen'
import ChainContext from '@/lib/thirdweb/chain-context'
import Tier from '@/components/onboarding/Tier'

type CitizenTierProps = {
  setSelectedTier: Function
  compact?: boolean
}

const CitizenTier = ({
  setSelectedTier,
  compact = false,
}: CitizenTierProps) => {
  const { selectedChain } = useContext(ChainContext)
  const { citizen } = useContext(CitizenContext)

  const handleCitizenClick = () => {
    setSelectedTier('citizen')
  }

  return (
    <div id="citizen-tier-container">
      <Tier
        price={0.0111}
        label="Become a Citizen"
        description="Citizens are the trailblazers supporting the creation of off-world settlements. Whether you're already part of a team or seeking to join one, everyone has a crucial role to play in this mission."
        points={[
          'Unique Identity: Create a personalized, AI-generated passport image representing your on-chain identity.',
          'Professional Networking: Connect with top space startups, non-profits, and ambitious teams.',
          'Career Advancement: Access jobs, gigs, hackathons, and more; building on-chain credentials to showcase your experience.',
          'Early Project Access: Engage in space projects, earn money, and advance your career.',
        ]}
        buttoncta={compact ? 'Learn More' : 'Become a Citizen'}
        onClick={compact ? () => {} : handleCitizenClick}
        hasCitizen={citizen ? true : false}
        isLoadingCitizen={citizen === undefined}
        type="citizen"
        compact={compact}
      />
    </div>
  )
}

export default CitizenTier
