## NFT MARKETPLACE FRONT-END
L'obiettivo è quello di creare le seguenti pagine:
1. home page:
	in questa pagina si mostra gli NFT recentementi listati. Per questa sezione:
		- se sei l'owner del NFT, puoi aggiornare i dati listati
		- se no, puoi comprare l'NFT
2. sell page:
	- in questa pagina si possono vendere gli NFT e quindi listare 
	- è possibile fare i withdraw
	
Inoltre viene creato un header standard per tutte le pagine. Per questo viene utilizzato web3uikit che permette di creare il buttone per la connessione del wallet.
Infine viene utilizzato tailwindcss (https://tailwindcss.com/docs/guides/nextjs) per definire fare un pò di format del sito.
(TODO: rivedere 1:03:40:19 buyitem => ```"Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="Transaction reverted: trying to deploy a contract whose code is too large", method="estimateGas"```)

### TheGraph: 
Allo scopo di creare questa dApp e creare la lista degli NFT listati vengono utilizzati  **utilizzato gli eventi (emit nel contratto) e TheGraph**.
TheGraph è un sistema decentralizzato che ci permette di di registrare gli eventi. Per maggiori dettagli far riferimento alla corretta directory