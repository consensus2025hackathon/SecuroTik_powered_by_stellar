// lib/listNfts.js
import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const WASM_HASH =
  "686dfd0a069a826d19c3ccf441a984c7ddb666dbeb64dfed2db62df6...2f";
const CONTRACT_ID = "CAWSIHRK6FF2R2AWQT6HRO7RJYV5SPFKTAUZFEXFWD5COPTEAAVK62QP";

/**
 * Fetches all minted ticket IDs, plus owner & metadata for each.
 * @param {string} secretKey  Your Soroban account's secret (must be funded)
 */
export async function listNfts(secretKey) {
  // 1️⃣ load keypair & signer
  const keypair = Keypair.fromSecret(secretKey);
  const signer = basicNodeSigner(keypair, NETWORK_PASSPHRASE);

  // 2️⃣ build the Client
  const client = await Client.from({
    rpcUrl: RPC_URL,
    networkPassphrase: NETWORK_PASSPHRASE,
    wasmHash: WASM_HASH,
    contractId: CONTRACT_ID,
    publicKey: keypair.publicKey(),
    signTransaction: signer.signTransaction,
  });

  // 3️⃣ call `.list()` and pull out the BigInt[] of ticket IDs
  const { result: ticketIds } = await client.list();
  console.log("All ticket IDs:", ticketIds);

  // 4️⃣ (optional) fetch owner & metadata for each
  const tickets = await Promise.all(
    ticketIds.map(async (id) => {
      // owner_of takes an object with your parameter names
      const { result: owner } = await client.owner_of({ ticket_id: id });
      const { result: metaBytes } = await client.get_metadata({
        ticket_id: id,
      });
      // metaBytes is a Uint8Array or Buffer
      const metadata = Buffer.from(metaBytes).toString("utf8");
      return { id, owner, metadata };
    })
  );

  console.log("Detailed tickets:", tickets);
  return { ticketIds, tickets };
}
