const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.ipfscdn.io https://r2.comfy.icu https://ipfs.io https://cdn.discordapp.com https://cdn.stamp.fyi https://cdn.shopify.com https://cryptologos.cc https://ipfs.cf-ipfs.com https://*.walletconnect.com https://unpkg.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://auth.privy.io https://*.privy.systems https://*.thirdweb.com https://*.nance.app https://*.walletconnect.com wss://*.walletconnect.com https://www.walletlink.org wss://*.walletlink.org https://*.safe.global https://*.ipfscdn.io https://*.ensideas.com https://*.amazonaws.com https://apple.com https://google.com https://www.apple.com https://www.google.com https://*.snapshot.org https://testnets.tableland.network https://tableland.network https://*.coinbase.com https://ipfs.io https://cloudflare-ipfs.com https://*.etherscan.io;
    frame-src 'self' https://*.youtube.com https://*.privy.io https://*.moondao.com https://*.typeform.com https://*.snapshot.org https://*.coinbase.com https://moondao.ck.page https://moondao.kit.com;
    upgrade-insecure-requests;
`

const nextTranslate = require('next-translate')
module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.shopify.com',
      'cryptologos.cc',
      'gateway.ipfscdn.io',
      'ipfs.cf-ipfs.com',
      'ipfscdn.io',
      'b507f59d2508ebfb5e70996008095782.ipfscdn.io',
      'r2.comfy.icu',
      'cdn.discordapp.com',
      'cdn.stamp.fyi',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'app.moondao.com',
          },
        ],
        destination: 'https://moondao.com/:path*',
        permanent: true,
      },
      {
        source: '/docs',
        destination: 'https://docs.moondao.com/',
        permanent: true,
      },
      {
        source: '/docs/introduction',
        destination: 'https://docs.moondao.com/',
        permanent: true,
      },
      {
        source: '/docs/constitution',
        destination: 'https://docs.moondao.com/Governance/Constitution',
        permanent: true,
      },
      {
        source: '/docs/token',
        destination: 'https://docs.moondao.com/Governance/Governance-Tokens',
        permanent: true,
      },
      {
        source: '/docs/faq',
        destination: 'https://docs.moondao.com/About/FAQ',
        permanent: true,
      },
      {
        source: '/docs/launch-path',
        destination: 'https://docs.moondao.com/launch-path',
        permanent: true,
      },
      {
        source: '/docs/team',
        destination: 'https://docs.moondao.com/About/Team',
        permanent: true,
      },
      {
        source: '/docs/contribute',
        destination: 'https://docs.moondao.com/Onboarding/Contribute',
        permanent: true,
      },
      {
        source: '/docs/project-guidelines',
        destination: 'https://docs.moondao.com/Projects/Project-System',
        permanent: true,
      },
      {
        source: '/docs/ticket-to-space-sweepstakes-rules',
        destination:
          'https://docs.moondao.com/Legal/Ticket-to-Space-NFT/Ticket-to-Space-Sweepstakes-Rules',
        permanent: true,
      },
      {
        source: '/docs/ticket-to-space-NFT-FAQs',
        destination:
          'https://docs.moondao.com/Legal/Ticket-to-Space-NFT/Ticket-to-Space-Sweepstakes-Rules',
        permanent: true,
      },
      {
        source: '/docs/dispute-notice',
        destination:
          'https://docs.moondao.com/Legal/Ticket-to-Space-NFT/Dispute-Notice',
        permanent: true,
      },
      {
        source: '/docs/nft-owner-agreement',
        destination:
          'https://docs.moondao.com/Legal/Ticket-to-Space-NFT/Ticket-to-Space-NFT-Owner-Agreement',
        permanent: true,
      },
      {
        source: '/docs/website-terms-and-conditions',
        destination:
          'https://docs.moondao.com/Legal/Website-Terms-and-Conditions',
        permanent: true,
      },
      {
        source: '/docs/sweepstakes-and-securities-disclaimer',
        destination:
          'https://docs.moondao.com/Legal/Ticket-to-Space-NFT/Sweepstakes-and-Securities-Disclaimer',
        permanent: true,
      },
      {
        source: '/docs/privacy-policy',
        destination: 'https://docs.moondao.com/Legal/Website-Privacy-Policy',
        permanent: true,
      },
      {
        source: '/thank-you-explorer-almost-there',
        destination: '/almost-there',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/OfficialMoonDAO',
        permanent: true,
      },
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/official_moondao/',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/moondao',
        permanent: true,
      },
      {
        source: '/zero-g',
        destination: '/zero-gravity',
        permanent: true,
      },
      {
        source: '/zero-g-sweepstakes',
        destination: '/zero-gravity',
        permanent: true,
      },
      {
        source: '/zero-g-contest',
        destination: '/zero-gravity',
        permanent: true,
      },
      {
        source: '/es',
        destination: '/',
        permanent: true,
      },
      {
        source: '/zh-cn',
        destination: '/',
        permanent: true,
      },
      {
        source: '/zh-Hant',
        destination: '/',
        permanent: true,
      },
      {
        source: '/old-home-3',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dude-perfect-second-astronaut-selection',
        destination: '/dude-perfect',
        permanent: true,
      },
      {
        source: '/follow-moondao',
        destination: '/linktree',
        permanent: true,
      },
      {
        source: '/waitlist',
        destination: '/join-us',
        permanent: true,
      },
      {
        source: '/eiman',
        destination: 'https://forms.gle/uHsbCFxX36UScLW27',
        permanent: true,
      },
      {
        source: '/submit-contribution',
        destination: '/submit?tag=contribution',
        permanent: true,
      },
      {
        source: '/contribute',
        destination: '/submit?tag=contribution',
        permanent: true,
      },
      {
        source: '/contribution',
        destination: '/submit?tag=contribution',
        permanent: true,
      },
      {
        source: '/citizens',
        destination: '/network?tab=citizens',
        permanent: true,
      },
      {
        source: '/propose',
        destination: '/submit?tag=proposal',
        permanent: true,
      },
      {
        source: '/teams',
        destination: '/network?tab=teams',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/project',
        permanent: true,
      },
      {
        source: '/report',
        destination: '/submit?tag=report',
        permanent: true,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
      config.resolve.fallback.tls = false
      config.resolve.fallback.net = false
      config.resolve.fallback.child_process = false
    }
    return config
  },
})
