# SecuroTik: The Secret Sauce to Secure Ticket Transactions

The ticket resale market is a largely unregulated and often insecure field, populated with bad actors and scammers who defraud people of their money in attempting to buy tickets to their favorite concert or show. Once you approach an individual to buy a ticket, how do you verify that they will send you their ticket once payment is complete? How do you know that they even have a ticket? That’s where SecuroTik comes in.

SecuroTik aims to bring transparency and security to the ticket resale market, replacing traditional PDF/QR code tickets with NFT Tickets which can be sold between users with trust. NFT Tickets can be transacted using smart contracts, which automate the transfer of ticket ownership between users without allowing for scammers to withhold their end of the transaction. Once payment is received, the ticket is immediately transferred to the buyer! Easy as that! And due to the decentralization of NFT Tickets, any individual can see the ticket they are about to buy, including a full transaction history straight from the origin. 


## Pictures & Videos!
https://github.com/user-attachments/assets/2ceb33e3-2675-4e50-a852-79e9be460d7b


<img width="245" alt="Image" src="https://github.com/user-attachments/assets/e0402dda-101a-4c9a-a678-101932692851" />
<img width="245" alt="Image" src="https://github.com/user-attachments/assets/cda8e8c8-0610-4ebf-a9a8-b160c6da3c87" />
<img width="245" alt="Image" src="https://github.com/user-attachments/assets/2a045118-01ad-4db6-a4c1-49a86ccfe1ee" />
<img width="245" alt="Image" src="https://github.com/user-attachments/assets/3bd06c35-4a65-41c5-98d6-224d5062bd64" />

----------------------------------------------------------------------------------------------------------
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

## 🔗 The Passkey System 

Our method of authenticating users and signing transactions, as documented by Stellar! Our secret sauce to ensuring the smoothest user experience possible, a smooth and easy transaction approval system which doesn't require emails, passwords, or any pesky 2 step authorization. The Stellar Passkey allowed us to greatly speed up the transaction signing process by eliminating the need to connect to a wallet, rather, instantiating a wallet upon initial passkey registration and saving locally onto a user's device. 

---

## ✅ Links!


Stellar Developer Docs : https://developers.stellar.org/

Presentation slides : https://www.canva.com/design/DAGlwOQ7U-k/3AZU1fcIiz6qfhmwpOQ-Hw/edit?utm_content=DAGlwOQ7U-k&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

Twitter thread : https://x.com/pramay07_/status/1916258393859248542


