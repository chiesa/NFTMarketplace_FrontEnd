import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEM from '../constants/subGraphQueries'
import { useQuery } from "@apollo/client"
import NFTBox from '../components/NFTBox' 

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  console.log(chainString)
  const marketplaceAddress =  networkMapping[chainString]["NFTMarketplace"][0]

  const { loading, error, data: listedNtfs } = useQuery(GET_ACTIVE_ITEM)

  return (
    
    <div className={styles.container}>
      <div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
        <div className="flex flex-wrap">
          {console.log(loading || !listedNtfs)}
          {isWeb3Enabled ? (
            (loading || !listedNtfs) ? (
              <div> Loading... </div>
            ) : (
              listedNtfs.activeItems.map( (nft) => {
                console.log(nft)
                const { price, nftAddress, tokenId, seller } = nft
                return (
                  <div>
                    <NFTBox
                      price = {price}
                      nftAddress = {nftAddress}
                      tokenId = {tokenId}
                      marketplaceAddress = {marketplaceAddress}
                      seller = {seller}
                      key = {`${nftAddress}${tokenId}`}
                    />
                  </div>
                )
              })
            )
          ) : (
            <div> Web3 not Enabled </div>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
