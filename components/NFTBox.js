import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/ABI.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image";
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./updateModal";

// per migliorare la formattazione del address in visualizzazione
const truncateAdd = (fullStr, strLen) => {
    if(fullStr.length <= strLen) return fullStr

    const separetor = "..."
    let separetorLen = separetor.length
    const charsToShow = strLen - separetorLen
    const fronChars = Math.ceil(charsToShow/2)
    const backChars = Math.floor(charsToShow/2)
    return (
        fullStr.substring(0,fronChars) + 
        separetor + 
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({price, nftAddress, tokenId, marketplaceAddress,seller}){
    const [imageURI, setImageURI] = useState("")
    const {isWeb3Enabled, account} = useMoralis()
    const [tokenName, setTokenName] = useState("")
    const [tokenDesc, setTokenDesc] = useState("") 
    const [showModal, setShowModal] = useState(false) 
    //const [BuyModal, setBuyModal] = useState("")

    const hideModal = ()=> setShowModal(false)

    const {runContractFunction: getTokenURI} = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "TOKEN_URI",
        params: {
            tokenId: tokenId,
        }
    })

    const {runContractFunction: buyItem } = useWeb3Contract({
        abi:nftMarketplaceAbi,
        contractAddress:nftAddress,
        functionName:"buyItem",
        msgValue:price,
        params:{
            _NFTContract:nftAddress, 
            _tokenId:tokenId
        }
    })

    async function updateUI(){
        const tokenURI = await getTokenURI()
        console.log(tokenURI)
        if(tokenURI){
            /*
            Usando firefox utilizzo un gateway e non c'è connessione diretta tramite ipfs://, 
            non necessari i seguenti passaggi in questo caso:

            // IPFS gateway: lo utilizzo per passare da un IPFS in a normal file URL.
            const requestURL = tokenURI.replace("ipfs://","https://ipfs.io/ipfs/")
            // fetch è la parola chiave per ottenere URL
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)

            Servono solo:
            */
            const tokenURIResponse = await (await fetch(tokenURI)).json()
            const imageURI = tokenURIResponse.image
            setImageURI(imageURI)
            setTokenName(tokenURIResponse.name)
            setTokenDesc(tokenURIResponse.description)
        }
    }

    useEffect( () => {
        if(isWeb3Enabled){
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByU = seller === account || seller === undefined
    console.log(isOwnedByU)
    const formattedAddress = isOwnedByU ? "you" : truncateAdd(seller||"",15)

    const dispatch = useNotification()
    const handleUpdateBuySuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "item correctly bought",
            title: "buy item",
            position: "topR"
        })
    }

    const handleCardClick = () =>{
        // se l'utente è proprietario si può aggiornare il listing
        // altrimenti si può acquistare
        isOwnedByU 
            ? setShowModal(true)
            : buyItem({
                onError: (err)=>{
                    console.log(err)
                },
                onSuccess: (success) =>{
                    handleUpdateBuySuccess(success)
                }
            })
    }
    return(
        <div>
            <div>
                {imageURI ?  (
                    <div>
                        <UpdateListingModal 
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal }
                        />
                        <Card title={tokenName} description={tokenDesc} onClick={handleCardClick}>
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="italic text-sm"> Owned by {formattedAddress}</div>
                                    <Image 
                                        loader={()=> imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price,"ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                        </div>
                ):(
                  <div>Loading...</div>  
                )}
            </div>
        </div>
    )
}
