import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftAbi from "../constants/ABI.json"
import { ethers } from "ethers"

export default function UpdateListingModal({nftAddress, tokenId, isVisible, marketplaceAddress, onClose}){
    const [priceUpdate, setPriceUpdate] = useState(0)
    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            _NFTContract: nftAddress,
            _tokenId: tokenId,
            _price: ethers.utils.parseEther(priceUpdate || "0"),
        }
    })
    const dispatch = useNotification()
    // importante questa funzione è async e devo aspettare il tx perchè voglio che prima la transazione sia vera e poi fare il popup
    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "update",
            position: "topR"
        })
        onClose && onClose()
        setPriceUpdate("0")
    }

    return (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={()=>
                    updateListing({
                        onError: (err)=>{
                            console.log(err)
                        },
                        onSuccess: (success) =>{
                            handleUpdateListingSuccess(success)
                        }
                    })
                }
            >
                <Input
                    label="Update listing price"
                    name="New listing price"
                    type="number"
                    onChange={(event)=>{
                        // event.target.value è quello che viene inserito nell'input box
                        setPriceUpdate(event.target.value)
                    }}
                />
            </Modal>
        </div>
    )
}
