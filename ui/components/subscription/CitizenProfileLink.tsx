import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { MediaRenderer } from 'thirdweb/react'
import CitizenContext from '@/lib/citizen/citizen-context'
import { generatePrettyLinkWithId } from '@/lib/subscription/pretty-links'
import client from '@/lib/thirdweb/client'
import { LoadingSpinner } from '../layout/LoadingSpinner'

export default function CitizenProfileLink() {
  const router = useRouter()
  const { citizen } = useContext(CitizenContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  if (citizen?.metadata?.id !== null && citizen?.metadata?.id !== undefined) {
    return (
      <button
        onClick={async () => {
          setIsLoading(true)
          await router.push(
            `/citizen/${generatePrettyLinkWithId(
              citizen.metadata.name as string,
              citizen.metadata.id
            )}`
          )
          setIsLoading(false)
        }}
      >
        <div className="rounded-[100%] w-[40px] h-[40px] overflow-hidden  animate-fadeIn">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <MediaRenderer
              client={client}
              className=""
              src={citizen.metadata.image}
              width="100%"
              height="100%"
            />
          )}
        </div>
      </button>
    )
  }
}
