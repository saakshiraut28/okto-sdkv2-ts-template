/*
* This script explains how to use teh Okto TS SDK
*/

import { OktoClient } from "@okto_web3/core-js-sdk";
import type { Hash, Hex } from "@okto_web3/core-js-sdk/types";
import { getAccount, getPortfolio, getChains, getTokens, getPortfolioActivity, getPortfolioNFT, getNftCollections, getOrdersHistory } from "@okto_web3/core-js-sdk/explorer";
import { tokenTransfer, nftTransfer } from "@okto_web3/core-js-sdk/userop";


import dotenv from 'dotenv';
dotenv.config();

const main = async () => {
    // Initialize OktoClient
    type Env = 'staging' | 'sandbox';
    const googleIdToken = process.env.GOOGLE_ID_TOKEN as string;
    console.log("env: ", process.env.OKTO_ENVIRONMENT)
    

    const oktoClient = new OktoClient({
        environment: process.env.OKTO_ENVIRONMENT as Env,
        clientPrivateKey: process.env.OKTO_CLIENT_PRIVATE_KEY as Hash,
        clientSWA: process.env.OKTO_CLIENT_SWA as Hex,
    });

    // Log in using Google OAuth and Okto Client
    const user = await oktoClient.loginUsingOAuth({
        idToken: googleIdToken,
        provider: 'google',
    })
    console.log('User: ', user);

    // Verify login
    const isLoggedIn = await oktoClient.verifyLogin()
    console.log('Is Logged In: ', isLoggedIn);

    // Generate authorization token
    const authToken = await oktoClient.getAuthorizationToken()
    console.log('Auth Token: ', authToken);

    //printing oktoclient details
    console.log('Okto Client: ', oktoClient);

    // Get your wallets
    const wallets = await getAccount(oktoClient)
    console.log('Wallets: ', wallets);

    // Check your portfolio
    const portfolio = await getPortfolio(oktoClient)
    console.log('Portfolio: ', portfolio);

    // Get all supported chains
    const chains = await getChains(oktoClient)
    console.log('Supported Chains: ', chains);

    // Get all supported tokens
    const tokens = await getTokens(oktoClient)
    console.log('Supported Tokens: ', tokens);

    // Get portfolio activity
    const portfolioActivity = await getPortfolioActivity(oktoClient)
    console.log('Portfolio Activity: ', portfolioActivity);

    // Get NFT portfolio
    const nftPortfolio = await getPortfolioNFT(oktoClient)
    console.log('NFT Portfolio: ', nftPortfolio);

    // Get NFT Collections
    const nftCollections = await getNftCollections(oktoClient)
    console.log('NFT Collections: ', nftCollections);

    // Transfer tokens
    const transferTokensUserOp = await tokenTransfer(oktoClient, {
        amount: 0,
        recipient: '0x0000000000000000000000000000000000000000',
        token: '',
        caip2Id: 'eip155:137',
    })
    console.log('Transfer Tokens UserOp: ', transferTokensUserOp);

    const signedTransferTokensUserOp = await oktoClient.signUserOp(transferTokensUserOp)
    console.log('Signed Transfer Tokens UserOp: ', signedTransferTokensUserOp);

    const jobId = await oktoClient.executeUserOp(signedTransferTokensUserOp)
    console.log('Job ID: ', jobId);

    // Transfer NFT
    const transferNFTUserOp = await nftTransfer(oktoClient, {
        caip2Id: 'eip155:137',
        collectionAddress: '0x0000000000000000000000000000000000000000',
        nftId: '1',
        recipientWalletAddress: '0x0x0000000000000000000000000000000000000000',
        amount: 1,
        nftType: 'ERC721',
    })
    console.log('Transfer NFT UserOp: ', transferNFTUserOp);

    const signedTransferNFTUserOp = await oktoClient.signUserOp(transferNFTUserOp)
    console.log('Signed Transfer NFT UserOp: ', signedTransferNFTUserOp);

    const jobId2 = await oktoClient.executeUserOp(signedTransferNFTUserOp)
    console.log('Job ID: ', jobId2);

    //Get Order History
    const orderHistory = await getOrdersHistory(oktoClient)
    console.log('Order History: ', orderHistory);

    // Use signMessage() for simple message signing (EIP-191)
    const data = "Hello Okto";
    const signedMessage_response = await oktoClient.signMessage(data);
    console.log('Signed Message:', signedMessage_response);

    // Use signTypedData() for structured, secure signing (EIP-712)
    const typedData = `{
        "types": {
            "EIP712Domain": [
                { "name": "name", "type": "string" },
                { "name": "chainId", "type": "uint256" }
            ],
            "Test": [
                { "name": "message", "type": "string" }
            ]
        },
        "primaryType": "Test",
        "domain": {
            "name": "OktoTest",
            "chainId": 1
        },
        "message": {
            "message": "Test message"
        }
    }`;
    const signedTypedData_response = await oktoClient.signTypedData(typedData);
    console.log('Signed Typed Data:', signedTypedData_response);
};

main();
