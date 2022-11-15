import '../styles/globals.css'
import Head from 'next/head'
import {MoralisProvider} from "react-moralis" 
import Header from '../components/header'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NotificationProvider } from "web3uikit"

// diciamo al client dove fare la query
const client = new ApolloClient({
  cache: new InMemoryCache(),
  // in uri inserisco il link a cui mi voglio connettere prendendolo dai "details" di thegraph in "deployment query url"
  uri: "https://api.studio.thegraph.com/query/37987/nft-marketplace/v0.0.2",
})

function MyApp({ Component, pageProps }) {
  return(
    <div>
      <Head>
        <title>NFT NEXTJS MARKETPLACE</title>
        <meta name="description" content="NFT marketplace pp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <NotificationProvider>
              <Header /> 
              <Component {...pageProps} />
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
