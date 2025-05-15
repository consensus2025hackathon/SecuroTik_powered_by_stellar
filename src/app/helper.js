// Helper function to convert base64url string to ArrayBuffer
export function base64urlToArrayBuffer(base64urlString) {
  const padding = "=".repeat((4 - (base64urlString.length % 4)) % 4);
  const base64 = (base64urlString + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

// Helper function to convert ArrayBuffer to base64url string
export function arrayBufferToBase64url(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = "";
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  const base64 = window.btoa(byteString);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Placeholder environment variables (replace with actual .env values)
const PUBLIC_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
const PUBLIC_NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
  "Test SDF Network ; September 2015";
const PUBLIC_FACTORY_CONTRACT_ID =
  process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID ||
  "CDL3HLH5AAND2B2LUDKNUWJ2AASXPKWXBYJNUPCI3XLA25E6DGT3QYIS"; // Example factory, replace if you have a specific one
import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Account,
} from "@stellar/stellar-sdk";
import {
  getAddress,
  signTransaction,
  submitTransaction,
} from "@stellar/freighter-api";

export async function sendXLM(destinationPublicKey) {
  // 1. Get the Freighter wallet's public key
  const publicKey = await getAddress();
  console.log("Public Key:", publicKey);

  // 2. Get the sequence number manually via Horizon (API call)
  const res = await fetch(
    `https://horizon-testnet.stellar.org/accounts/${publicKey}`
  );
  const { sequence } = await res.json();

  // 3. Build source account object
  const sourceAccount = new Account(publicKey, sequence);

  // 4. Create transaction
  const tx = new TransactionBuilder(sourceAccount, {
    fee: "100", // base fee in stroops
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(), // XLM
        amount: "10", // amount of XLM
      })
    )
    .setTimeout(30)
    .build();

  // 5. Sign with Freighter
  const signedXDR = await signTransaction(tx.toXDR(), { network: "TESTNET" });

  // 6. Submit to Horizon
  const submitRes = await fetch(
    "https://horizon-testnet.stellar.org/transactions",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `tx=${encodeURIComponent(signedXDR)}`,
    }
  );

  const result = await submitRes.json();
  console.log("Transaction Result:", result);
}
