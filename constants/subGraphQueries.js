import {useQuery, gql} from "@apollo/client"

// creo una nuova query. Pos so creare la mia query sul sito di theGraph nella parte relativa al mio subgraph
const GET_ACTIVE_ITEM = gql
`
    {
        activeItems(first: 5, where:{buyer:"0x0000000000000000000000000000000000000000"}){
            id
            buyer
            seller
            nftAddress
            price
            tokenId
        }
    }
`
export default GET_ACTIVE_ITEM