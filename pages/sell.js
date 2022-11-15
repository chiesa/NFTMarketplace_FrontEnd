import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Form, Network, NFT, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import { useMoralis, useWeb3Contract } from 'react-moralis'
import nftMarketplaceAbi from "../constants/ABI.json"
import networkMapping from "../constants/networkMapping.json"

export default function Home() {
  const { chainId } = useMoralis()
  const { runContractFunction } = useWeb3Contract()
  const dispatch = useNotification()

  async function approveAndList(data){  
    console.log("Approving....")
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils.parseUnits(data.data[2].inputResult,"ether").toString()

    const marketplaceAddress = networkMapping[parseInt(chainId).toString()].NFTMarketplace[0]

    const approveOptions = {
      abi:nftAbi,
      contractAddress: nftAddress,
      functionName:"approve",
      params:{
        to:marketplaceAddress,
        tokenId:tokenId,
      }
    }

    await runContractFunction({
      params: approveOptions,
      onSuccess: (succ) => handleApproveSuccess(nftAddress,tokenId,price),
      onError: (err) => {
        console.log(err)
      }
    })

    async function handleApproveSuccess(nftAddress,tokenId,price){
      console.log("Time to list!")
      const listOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params:{
          _NFTContract:nftAddress,
          _tokenId:tokenId,
          _price:price
        }
      }
      await runContractFunction({
        params: listOptions,
        onSuccess: (suc) => handleListSuccess(suc),
        onError: (err) => console.log(err)
      })
    }
  
    async function handleListSuccess(suc){
      suc.wait(1)
      dispatch({
        type:"success",
        message:"NFT Listing",
        title:"NFT Listed",
        position:"topR"
      })
    }  
  }

  return (
    <div className={styles.container}>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name:"NFT Address",
            type:"text",
            inputWith:"50%",
            value:"",
            key:"nftAddress"
          },
          {
            name:"Token ID",
            type:"number",
            value:"",
            key:"tokenId"            
          },
          {
            name:"ETH Price",
            type:"number",
            value:"",
            key:"price"           
          }
        ]}
        title="Sell your NFT"
        id="Main Form"
      />

    </div>
  )
}
