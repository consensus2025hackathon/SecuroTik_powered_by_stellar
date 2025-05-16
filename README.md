# SecuroTik: The Secret Sauce to Secure Ticket Transactions

The ticket resale market is a largely unregulated and often insecure field, populated with bad actors and scammers who defraud people of their money in attempting to buy tickets to their favorite concert or show. Once you approach an individual to buy a ticket, how do you verify that they will send you their ticket once payment is complete? How do you know that they even have a ticket? That’s where SecuroTik comes in.

SecuroTik aims to bring transparency and security to the ticket resale market, replacing traditional PDF/QR code tickets with NFT Tickets which can be sold between users with trust. NFT Tickets can be transacted using smart contracts, which automate the transfer of ticket ownership between users without allowing for scammers to withhold their end of the transaction. Once payment is received, the ticket is immediately transferred to the buyer! Easy as that! And due to the decentralization of NFT Tickets, any individual can see the ticket they are about to buy, including a full transaction history straight from the origin.

## Pictures & Videos!


https://github.com/user-attachments/assets/8ab7e3e2-3479-4138-95aa-20d5b101111b

<img width="245" alt="Image" src="https://raw.githubusercontent.com/consensus2025hackathon/SecuroTik_powered_by_stellar/refs/heads/master/demo/images/login_register.png" />
<img width="245" alt="Image" src="https://github.com/consensus2025hackathon/SecuroTik_powered_by_stellar/blob/master/demo/images/passkey_login.png?raw=true" />
<img width="245" alt="Image" src="https://github.com/consensus2025hackathon/SecuroTik_powered_by_stellar/blob/master/demo/images/mytickets_information.png?raw=true" />
<img width="245" alt="Image" src="https://github.com/consensus2025hackathon/SecuroTik_powered_by_stellar/blob/master/demo/images/main_market.png?raw=true" />




---

# Our Project Components

## 🛠 The Smart Contract: `SmartSecuresSales.rs`

### What is it?

The Solana smart contract, written in Rust, is the method in which we secure and automate payment and ticket transfer between sellers and buyers. The contract initiates a transaction which transfers Lumens between users and exchanges ownership of the NFT Ticket upon completion. The method in which the Solana contract technology was integrated into the Stellar SDK allowed us to very easily integrate our contract functions to the rest of our project, and the SDK docs very clearly outlined how all the pieces of our project would fit together.

### Functions:

- Mint - Mints a new NFT Ticket
- Buy - Allows the purchase of a ticket
- Transfer - Transfers ticket between users
- List - Provides a list of all existing tickets for an event
- Owner_Of - Given a ticket ID, returns the current owner
- Get_Metadata - Given a ticket ID, returns the metadata
- Get_Price - Given a ticket ID, returns the current price

---

## 🔒 Key Security Features

- **LaunchTube Incorporation**:
  Utilized LaunchTube technology to authorize transactions!
- **Easily Auditable Transaction History**:  
  You always know where your ticket comes from!
- **Secure Resale**:  
  Ensures a payment always results in a ticket!
- **Decentralized Ticketing**:  
  No entity can take away your tickets! Your tickets are yours from now to forevermore!

---


## :) Try It!

https://silver-sunshine-6d8ed1.netlify.app/
---

## 🔗 The Passkey System

Our method of authenticating users and signing transactions, as documented by Stellar! Our secret sauce to ensuring the smoothest user experience possible, a smooth and easy transaction approval system which doesn't require emails, passwords, or any pesky 2 step authorization. The Stellar Passkey allowed us to greatly speed up the transaction signing process by eliminating the need to connect to a wallet, rather, instantiating a wallet upon initial passkey registration and saving locally onto a user's device.

---

## ✅ Links!

Stellar Developer Docs : https://developers.stellar.org/

The Narrative: https://docs.google.com/document/d/1pPCACbfzvb4Pk20OuzQjv7LpqjDwDNOg3IMG-R4cDV0/edit?usp=sharing

Technical Docs: https://docs.google.com/document/d/1oCxmS3MZI1_hYd6UiK-dwW7vn_K6dod1gBnFWA-VfDA/edit?usp=sharing

Contract ID Stellar Expert Link: https://stellar.expert/explorer/testnet/contract/CAWSIHRK6FF2R2AWQT6HRO7RJYV5SPFKTAUZFEXFWD5COPTEAAVK62QP

Contract ID: CAWSIHRK6FF2R2AWQT6HRO7RJYV5SPFKTAUZFEXFWD5COPTEAAVK62QP

Presentation slides : https://www.canva.com/design/DAGnnmmeRz4/4iBaAvog23e29RWs6Ym5cA/edit?utm_content=DAGnnmmeRz4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

