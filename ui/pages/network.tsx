import { MapIcon } from '@heroicons/react/24/outline'
import { NFT } from '@thirdweb-dev/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useCallback } from 'react'
import getAllValidCitizens from '@/lib/subscription/getAllValidCitizens'
import getAllValidTeams from '@/lib/subscription/getAllValidTeams'
import { useShallowQueryRoute } from '@/lib/utils/hooks'
import Card from '../components/layout/Card'
import Container from '../components/layout/Container'
import ContentLayout from '../components/layout/ContentLayout'
import Frame from '../components/layout/Frame'
import Head from '../components/layout/Head'
import CardGridContainer from '@/components/layout/CardGridContainer'
import CardSkeleton from '@/components/layout/CardSkeleton'
import { NoticeFooter } from '@/components/layout/NoticeFooter'
import Search from '@/components/layout/Search'
import StandardButton from '@/components/layout/StandardButton'
import Tab from '@/components/layout/Tab'
import ChainFilterSelector from '@/components/thirdweb/ChainFilterSelector'

type NetworkProps = {
  validTeams: any
  validCitizens: any
}

export default function Network({ validTeams, validCitizens }: NetworkProps) {
  const router = useRouter()
  const shallowQueryRoute = useShallowQueryRoute()

  const [teams, setTeams] = useState([])
  const [citizens, setCitizens] = useState([])

  const [chainFilter, setChainFilter] = useState('all')

  const [input, setInput] = useState('')
  function filterBySearch(nfts: NFT[]) {
    return nfts.filter((nft) => {
      return nft.metadata.name
        ?.toString()
        .toLowerCase()
        .includes(input.toLowerCase())
    })
  }

  const [tab, setTab] = useState<string>('teams')
  function loadByTab(tab: string) {
    if (tab === 'teams') {
      setCachedNFTs(input != '' ? filterBySearch(teams) : teams)
    } else if (tab === 'citizens') {
      setCachedNFTs(input != '' ? filterBySearch(citizens) : citizens)
    } else {
      const nfts =
        teams?.[0] && citizens?.[0]
          ? [...teams, ...citizens]
          : citizens?.[0]
          ? citizens
          : teams?.[0]
          ? teams
          : []
      setCachedNFTs(input != '' ? filterBySearch(nfts) : nfts)
    }
  }

  const handleTabChange = useCallback(
    (newTab: string) => {
      setTab(newTab)
      setPageIdx(1)
      shallowQueryRoute({ tab: newTab, page: '1' })
    },
    [shallowQueryRoute]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPageIdx(newPage)
      shallowQueryRoute({ tab, page: newPage.toString() })
    },
    [shallowQueryRoute, tab]
  )

  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    const totalTeams = input != '' ? filterBySearch(teams).length : teams.length
    const totalCitizens =
      input != ''
        ? filterBySearch(citizens).length
        : citizens.length
        ? filterBySearch(citizens).length
        : citizens.length

    if (tab === 'teams') setMaxPage(Math.ceil(totalTeams / 9))
    if (tab === 'citizens') setMaxPage(Math.ceil(totalCitizens / 9))
  }, [tab, input, citizens, teams])

  const [cachedNFTs, setCachedNFTs] = useState<NFT[]>([])

  const [pageIdx, setPageIdx] = useState(1)

  useEffect(() => {
    const { tab: urlTab, page: urlPage } = router.query
    if (urlTab && (urlTab === 'teams' || urlTab === 'citizens')) {
      setTab(urlTab as string)
    }
    if (urlPage && !isNaN(Number(urlPage))) {
      setPageIdx(Number(urlPage))
    }
  }, [router.query])

  useEffect(() => {
    loadByTab(tab)
  }, [tab, input, teams, citizens, router.query])

  useEffect(() => {
    setTeams(validTeams?.[chainFilter] || [])
    setCitizens(validCitizens?.[chainFilter] || [])
  }, [chainFilter, validTeams, validCitizens])

  console.log(teams, citizens)

  const descriptionSection = (
    <div className="pt-2">
      <div className="mb-4">
        The Space Acceleration Network is an onchain startup society focused on
        building a permanent settlement on the Moon and beyond. Help build our
        multiplanetary future and{' '}
        <u>
          <Link href="/join">join the network</Link>
        </u>
        .
      </div>
      <Frame bottomLeft="20px" topLeft="5vmax" marginBottom="10px" noPadding>
        <Search input={input} setInput={setInput} />
      </Frame>
      <div className="w-full flex gap-4">
        <div
          id="filter-container"
          className="max-w-[350px] border-b-5 border-black"
        >
          <Frame noPadding>
            <div className="flex flex-wrap text-sm bg-filter">
              <Tab
                tab="teams"
                currentTab={tab}
                setTab={handleTabChange}
                icon="/../.././assets/icon-org.svg"
              >
                Teams
              </Tab>
              <Tab
                tab="citizens"
                currentTab={tab}
                setTab={handleTabChange}
                icon="/../.././assets/icon-passport.svg"
              >
                Citizens
              </Tab>
            </div>
          </Frame>
        </div>
        <ChainFilterSelector
          chainFilter={chainFilter}
          setChainFilter={setChainFilter}
        />

        <StandardButton
          className="gradient-2 h-[40px]"
          onClick={() => router.push('/map')}
        >
          <MapIcon width={20} height={20} />
        </StandardButton>
      </div>
    </div>
  )

  return (
    <section id="network-container" className="overflow-hidden">
      <Head
        title={'Space Acceleration Network'}
        description={
          'The Space Acceleration Network is an onchain startup society focused on building a permanent settlement on the Moon and beyond.'
        }
        image="https://ipfs.io/ipfs/QmbExwDgVoDYpThFaVRRxUkusHnXxMj3Go8DdWrXg1phxi"
      />
      <Container>
        <ContentLayout
          header="The Network"
          headerSize="max(20px, 3vw)"
          description={descriptionSection}
          preFooter={<NoticeFooter />}
          mainPadding
          mode="compact"
          popOverEffect={false}
          isProfile
        >
          <>
            <CardGridContainer>
              {cachedNFTs?.[0] ? (
                cachedNFTs
                  ?.slice((pageIdx - 1) * 9, pageIdx * 9)
                  .map((nft: any, I: number) => {
                    if (nft.metadata.name !== 'Failed to load NFT metadata') {
                      const type = nft.metadata.attributes.find(
                        (attr: any) => attr.trait_type === 'communications'
                      )
                        ? 'team'
                        : 'citizen'
                      return (
                        <div
                          className="justify-center mt-5 flex"
                          key={'team-citizen-' + I}
                        >
                          <Card
                            inline
                            metadata={nft.metadata}
                            owner={nft.owner}
                            type={type}
                            hovertext="Explore Profile"
                            slug={nft.slug}
                          />
                        </div>
                      )
                    }
                  })
              ) : (
                <>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <CardSkeleton key={`card-skeleton-${i}`} />
                  ))}
                </>
              )}
            </CardGridContainer>
            <Frame noPadding marginBottom="0px">
              <div
                id="pagination-container"
                className="w-full mb-5 flex font-GoodTimes text-2xl flex-row justify-center items-center lg:space-x-8"
              >
                <button
                  onClick={() => {
                    if (pageIdx > 1) {
                      handlePageChange(pageIdx - 1)
                    }
                  }}
                  className={`pagination-button ${
                    pageIdx === 1 ? 'opacity-10' : 'cursor-pointer opacity-100'
                  }`}
                  disabled={pageIdx === 1}
                >
                  <Image
                    src="/../.././assets/icon-left.svg"
                    alt="Left Arrow"
                    width={35}
                    height={35}
                  />
                </button>
                <p id="page-number" className="px-5 font-bold">
                  Page {pageIdx} of {maxPage}
                </p>
                <button
                  onClick={() => {
                    if (pageIdx < maxPage) {
                      handlePageChange(pageIdx + 1)
                    }
                  }}
                  className={`pagination-button ${
                    pageIdx === maxPage
                      ? 'opacity-10'
                      : 'cursor-pointer opacity-100'
                  }`}
                  disabled={pageIdx === maxPage}
                >
                  <Image
                    src="/../.././assets/icon-right.svg"
                    alt="Right Arrow"
                    width={35}
                    height={35}
                  />
                </button>
              </div>
            </Frame>
          </>
        </ContentLayout>
      </Container>
    </section>
  )
}

export async function getStaticProps() {
  const validTeams = await getAllValidTeams()
  const validCitizens = await getAllValidCitizens()

  return {
    props: {
      validTeams,
      validCitizens,
    },
    revalidate: 60,
  }
}
