import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        {/* Facebook Open Graph */}
        <meta property="og:title" content="Pitch Evaluator - Revolutionizing the Art of Pitching" />
        <meta property="og:description" content="Perfect your business pitches with our AI-powered Pitch Evaluator. Get personalized evaluations and feedback to improve your pitch." />
        <meta property="og:image" content="//fb.png" />
        <meta property="og:url" content="https://pitch-evaluator.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pitch Evaluator - Revolutionizing the Art of Pitching" />
        <meta name="twitter:description" content="Perfect your business pitches with our AI-powered Pitch Evaluator. Get personalized evaluations and feedback to improve your pitch." />
        <meta name="twitter:image" content="//twitter.png" />
        <meta name="twitter:url" content="https://pitch-evaluator.vercel.app" />

      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
