## Project Info
This repo contains: 
<br />

######  Web App 
Web app to generate new assets through user prompt and mint or trade them for your virtual world <br/>

###### AR App
A Mixed Reality environment to interact with your on-chain assets

###### Smart Contract Methods
Contains the following methods:
mintAsset - mints a newly generated asset on-chain <br/>
sell - selling assets on the marketplace <br/>
buy - buying assets on the marketplace <br/>
fetchAllAssets - fetches all the assets on the platform <br/>
fetchInventory - fetches user's inventory <br/>
bridge - bridges a particular asset from Amoy to Fuji <br/>
getPriceInUsd - fetches each asset's price from Matic to usd <br/>
apiCallMintAsset - calls backend API using chainlink functions to validate the user's latest generation on-chain and sets as URI to the minted asset <br/>

###### API Methods
The following methods are available on the API:
<br /><br />
updateContract - updates communication contract from which user's pinned asset is to be fetched <br/>
create - creates user record with his email and wallet address <br/>
syncPin - sets an asset's URI as a primary asset to interact in reality <br/>
updateLatestGeneration - updates the latest generation for a particular user <br/>
latestGeneration - fetches the latest generation of the current user to validate on-chain <br/>

<br />
<br />

[Demo Video](https://youtu.be/TjmJ6S2kj-0)


