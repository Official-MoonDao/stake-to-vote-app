import { Arbitrum, Sepolia } from '@thirdweb-dev/chains'
import { useContract } from '@thirdweb-dev/react'
import MarketplaceABI from 'const/abis/MarketplaceTable.json'
import TeamABI from 'const/abis/Team.json'
import {
  MARKETPLACE_TABLE_ADDRESSES,
  TABLELAND_ENDPOINT,
  TEAM_ADDRESSES,
} from 'const/config'
import { useContext, useEffect, useState } from 'react'
import CitizenContext from '@/lib/citizen/citizen-context'
import getAllValidMarketplaceListings from '@/lib/subscription/getAllValidMarketplaceListings'
import ChainContext from '@/lib/thirdweb/chain-context'
import { initSDK } from '@/lib/thirdweb/thirdweb'
import Container from '@/components/layout/Container'
import ContentLayout from '@/components/layout/ContentLayout'
import Frame from '@/components/layout/Frame'
import Head from '@/components/layout/Head'
import IndexCardGridContainer from '@/components/layout/IndexCardGridContainer'
import { NoticeFooter } from '@/components/layout/NoticeFooter'
import Search from '@/components/layout/Search'
import TeamListing, {
  TeamListing as TeamListingType,
} from '@/components/subscription/TeamListing'
import ChainFilterSelector from '@/components/thirdweb/ChainFilterSelector'

type MarketplaceProps = {
  allValidListings: Record<string, TeamListingType[]>
}

export default function Marketplace({ allValidListings }: MarketplaceProps) {
  const { selectedChain } = useContext(ChainContext)
  const { citizen } = useContext(CitizenContext)

  const [chainFilter, setChainFilter] = useState<string>('all')
  const [listings, setListings] = useState<TeamListingType[]>()
  const [filteredListings, setFilteredListings] = useState<TeamListingType[]>()
  const [input, setInput] = useState('')

  useEffect(() => {
    setListings(allValidListings?.[chainFilter] || [])
  }, [allValidListings, chainFilter])

  useEffect(() => {
    if (listings && input != '') {
      setFilteredListings(
        listings.filter((listing: TeamListingType) => {
          return listing.title.toLowerCase().includes(input.toLowerCase())
        })
      )
    } else {
      setFilteredListings(listings)
    }
  }, [listings, input])

  const descriptionSection = (
    <div className="pt-2">
      <div className="mb-4">
        Discover space products and services from top innovators and teams in
        the Space Acceleration Network, available for direct on-chain purchase.
      </div>
      <Frame bottomLeft="20px" topLeft="5vmax" marginBottom="10px" noPadding>
        <Search input={input} setInput={setInput} />
      </Frame>
      <div className="mt-2">
        <ChainFilterSelector
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
        />
      </div>
    </div>
  )

  return (
    <section id="jobs-container" className="overflow-hidden">
      <Head
        title="Marketplace"
        image="https://ipfs.io/ipfs/QmTtEyhgwcE1xyqap4nvaXyPpMBnfskRPtnz7i1jpGnw5M"
      />
      <Container>
        <ContentLayout
          header="Marketplace"
          headerSize="max(20px, 3vw)"
          description={descriptionSection}
          preFooter={<NoticeFooter />}
          mainPadding
          mode="compact"
          popOverEffect={false}
          isProfile
        >
          <IndexCardGridContainer>
            {filteredListings &&
              filteredListings.map((listing: TeamListingType, i: number) => (
                <TeamListing
                  key={`team-listing-${i}`}
                  listing={listing}
                  teamName
                  isCitizen={citizen}
                />
              ))}
          </IndexCardGridContainer>
        </ContentLayout>
      </Container>
    </section>
  )
}

export async function getStaticProps() {
  const allValidListings = await getAllValidMarketplaceListings()

  return {
    props: {
      allValidListings,
    },
    revalidate: 60,
  }
}
