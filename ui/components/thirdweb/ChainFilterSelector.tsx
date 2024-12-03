import {
  ChartBarSquareIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import Portal from '../layout/Portal'

interface ChainFilterSelectorProps {
  chainFilter: string
  setChainFilter: (chain: string) => void
}

export default function ChainFilterSelector({
  chainFilter,
  setChainFilter,
}: ChainFilterSelectorProps) {
  const [dropdown, setDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLDivElement>(null)

  function selectChain(chain: string) {
    setChainFilter(chain)
    setDropdown(false)
  }

  function handleClickOutside({ target }: any) {
    if (target.closest('#network-selector-dropdown')) return
    setDropdown(false)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (dropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }
  }, [dropdown])

  return (
    <div id="network-selector" className="w-auto flex flex-col cursor-pointer">
      <div
        ref={buttonRef}
        id="network-selector-dropdown-button"
        className="flex items-center gap-2 p-2 gradient-2 rounded-lg"
        onClick={(e) => {
          if (e.detail === 0) return e.preventDefault()
          setDropdown((prev) => !prev)
        }}
      >
        {chainFilter === 'all' ? (
          <ChartBarSquareIcon height={24} width={24} />
        ) : (
          <Image
            className="h-6 w-6"
            src={`/icons/networks/${chainFilter}.svg`}
            width={24}
            height={24}
            alt={chainFilter}
          />
        )}
        <span>
          {chainFilter.charAt(0).toUpperCase() + chainFilter.slice(1)}
        </span>
        <button className={`${dropdown && 'rotate-180'}`}>
          <ChevronDownIcon height={14} width={14} />
        </button>
      </div>
      {dropdown && (
        <Portal>
          <div
            id="network-selector-dropdown"
            className="fixed flex flex-col items-start gap-2 text-black z-10 w-[250px]"
            style={{
              top: `${dropdownPosition.top + 10}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <button
              type="button"
              className="w-full flex gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => selectChain('all')}
            >
              {'All'}
            </button>
            <button
              type="button"
              className="w-full flex gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => selectChain('ethereum')}
            >
              <Image
                src="/icons/networks/ethereum.svg"
                width={13}
                height={13}
                alt="Ethereum"
              />
              {'Ethereum'}
            </button>
            <button
              className="w-full flex gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => selectChain('polygon')}
            >
              <Image
                src="/icons/networks/polygon.svg"
                width={24}
                height={24}
                alt="Polygon"
              />
              {'Polygon'}
            </button>
            <button
              className="w-full flex gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
              onClick={() => selectChain('arbitrum')}
            >
              <Image
                src="/icons/networks/arbitrum.svg"
                width={24}
                height={24}
                alt="Arbitrumm"
              />
              {'Arbitrum'}
            </button>
            {process.env.NEXT_PUBLIC_ENV === 'dev' && (
              <button
                className="w-full flex gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
                onClick={() => selectChain('sepolia')}
              >
                <Image
                  src="/icons/networks/sepolia.svg"
                  width={24}
                  height={24}
                  alt="Sepolia"
                />
                {'Sepolia'}
              </button>
            )}
          </div>
        </Portal>
      )}
    </div>
  )
}
