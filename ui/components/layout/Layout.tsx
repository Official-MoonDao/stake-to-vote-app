import CitizenABI from 'const/abis/Citizen.json'
import { CITIZEN_ADDRESSES } from 'const/config'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { Toaster } from 'react-hot-toast'
import CitizenContext from '@/lib/citizen/citizen-context'
import useNavigation from '@/lib/navigation/useNavigation'
import { getChainSlug } from '@/lib/thirdweb/chain'
import ChainContextV5 from '@/lib/thirdweb/chain-context-v5'
import useContract from '@/lib/thirdweb/hooks/useContract'
import { LogoSidebarLight, LogoSidebar } from '../assets'
import { PrivyConnectWallet } from '../privy/PrivyConnectWallet'
import CitizenProfileLink from '../subscription/CitizenProfileLink'
import CookieBanner from './CookieBanner'
import LanguageChange from './Sidebar/LanguageChange'
import MobileMenuTop from './Sidebar/MobileMenuTop'
import MobileSidebar from './Sidebar/MobileSidebar'
import NavigationLink from './Sidebar/NavigationLink'
import Starfield from './Starfield'

interface Layout {
  children: JSX.Element
}

export default function Layout({ children }: Layout) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const router = useRouter()

  const { selectedChain } = useContext(ChainContextV5)
  const chainSlug = getChainSlug(selectedChain)

  const { citizen } = useContext(CitizenContext)
  const citizenContract = useContract({
    address: CITIZEN_ADDRESSES[chainSlug],
    chain: selectedChain,
    abi: CitizenABI as any,
  })

  const navigation = useNavigation(citizen)

  const [currentLang, setCurrentLang] = useState(router.locale)
  const { t } = useTranslation('common')
  //Background is defined in this root div.
  const layout = (
    <div id="app-layout" className="min-h-screen relative">
      <Starfield />

      {/*Mobile menu top bar*/}
      <MobileMenuTop
        setSidebarOpen={setSidebarOpen}
        citizenContract={citizenContract}
      />

      <MobileSidebar
        navigation={navigation}
        lightMode={lightMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Static sidebar for desktop */}
      <div className="relative z-10 hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col lg:w-[275px]">
        {/* Sidebar component*/}
        <div className="w-[250px] lg:w-[275px] flex flex-grow flex-col pt-5">
          <Link href="/" passHref>
            <div className="mt-2 ml-7 lg:ml-9 flex flex-shrink-0 items-center px-4 pl-6">
              <LogoSidebar />
            </div>
          </Link>
          <div className="flex flex-grow flex-col pt-9 lg:pl-2">
            <div className="h-[50px] pl-6 mb-4 flex justify-center items-center">
              <PrivyConnectWallet
                type="desktop"
                citizenContract={citizenContract}
              />

              <div className="relative mt-1 lg:right-4">
                <CitizenProfileLink />
              </div>
            </div>
            <nav className="flex flex-col px-4 overflow-y-auto h-[calc(75vh-2rem)] pb-[4rem]">
              {navigation.map((item, i) => (
                <NavigationLink key={`nav-link-${i}`} item={item} />
              ))}
              {/*Language change, import button*/}
              <ul className="pt-4 px-3">
                {/*Language change button*/}
                <LanguageChange />
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/*The content, child rendered here*/}
      <main className="flex justify-center pb-24 md:ml-60 relative">
        <section
          className={`mt-4 flex flex-col md:w-[90%] lg:px-14 xl:px-16 2xl:px-20`}
        >
          {/*Connect Wallet and Preferred network warning*/}
          {children}
        </section>
      </main>

      <CookieBanner />
      <Toaster />
    </div>
  )

  return layout
}
