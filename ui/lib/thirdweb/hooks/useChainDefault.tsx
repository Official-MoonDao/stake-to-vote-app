import { DEFAULT_CHAIN } from 'const/config'
import { useContext, useEffect, useMemo } from 'react'
import ChainContext from '../chain-context'

export function useChainDefault() {
  const { setSelectedChain } = useContext(ChainContext)

  useEffect(() => {
    setSelectedChain(DEFAULT_CHAIN)
  }, [setSelectedChain])
}
