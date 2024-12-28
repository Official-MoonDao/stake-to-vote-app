import StandardButton from '../layout/StandardButton'

export default function Callout1() {
  return (
    <section id="callout1-section" className="bg-dark-warm md:bg-transparent">
      <div
        id="callout1-container"
        className="md:rounded-bl-[5vmax] z-20 relative w-[100%] h-[100%] bg-white mt-[-2vmax] pt-[2vmax] pb-0 lg:pb-10"
      >
        <div
          id="content-container"
          className="compact-lg flex flex-col-reverse justify-end lg:flex-row items-start lg:items-center min-h-[250px] md:min-h-[400px] p-5 pt-10 pb-0 md:p-10 md:pt-10 lg:max-w-[1200px]"
        >
          <div
            id="content"
            className="overflow-visible relative pb-10 md:pb-10 w-[100%]"
          >
            <h1 className="header flex overflow-visible flex-col text-4xl font-GoodTimes font-bold bg-clip-text text-dark-cool bg-gradient-to-r from-red-500 to-blue-500 leading-none">
              MoonDAO is <br></br>
              Permissionless
            </h1>
            <p
              id="paragraph"
              className="pt-2 pb-5 text-black text-lg w-[100%] max-w-[500px]"
            >
              We are an open source space community where everything is
              proposed, governed, and created by our members. Co-govern the treasury 
              by locking $MOONEY to become a fully-fledged voter. 
            </p>
            <StandardButton
              backgroundColor="bg-dark-cool"
              textColor="text-white"
              hoverColor="bg-mid-cool"
              borderRadius="rounded-tl-[10px] rounded-[2vmax]"
              link="/get-mooney"
              paddingOnHover="pl-5"
            >
              Unlock Voting Power
            </StandardButton>
          </div>
        </div>
      </div>
    </section>
  )
}
