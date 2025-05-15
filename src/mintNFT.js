// mintNftWithClient.js
import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const WASM_HASH =
  "686dfd0a069a826d19c3ccf441a984c7ddb666dbeb64dfed2db62df63ae7cb2f"; // e.g. bc7d436…7527f :contentReference[oaicite:0]{index=0}
const CONTRACT_ID = "CAWSIHRK6FF2R2AWQT6HRO7RJYV5SPFKTAUZFEXFWD5COPTEAAVK62QP"; // the deployed instance ID

// ─── MINT FUNCTION ─────────────────────────────────────────────────────────
export async function MINT_NFT(secretKey) {
  // 1️⃣ Load your keypair (must already be funded on testnet!)
  const sourceKeypair = Keypair.fromSecret(secretKey);
  console.log("asd");
  // 2️⃣ Prepare signer helper
  const { signTransaction } = basicNodeSigner(
    sourceKeypair,
    NETWORK_PASSPHRASE
  );

  // 3️⃣ Instantiate a Client for your existing contract
  const client = await Client.from({
    contractId: CONTRACT_ID,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    wasmHash: WASM_HASH,
    publicKey: sourceKeypair.publicKey(),
    signTransaction,
  });

  // 4️⃣ Call your `mint` method.
  //    Our Rust signature: fn mint(env, buyer: Address, metadata: Bytes, price: i128)
  const metadataStr = "VIP Ticket – Front Row";
  const priceStroops = BigInt(10_000_000); // 1 XLM = 10⁷ stroops

  const mintTx = await client.mint({
    issuer: sourceKeypair.publicKey(),
    metadata: Buffer.from(metadataStr, "utf8"),
    price: priceStroops,
  });

  // 5️⃣ Sign & send, await on‐chain confirmation
  const { result } = await mintTx.signAndSend();
  console.log("🎉 Mint successful, contract returned:", result);
}
