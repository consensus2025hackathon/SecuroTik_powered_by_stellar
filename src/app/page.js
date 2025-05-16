"use client";

import React from "react";
import styles from "./page.module.css"; // We'll create this later

import { PasskeyKit } from "passkey-kit";
import { useState, useEffect, useRef } from "react";
import { arrayBufferToBase64url, base64urlToArrayBuffer } from "./helper";

const PUBLIC_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
const PUBLIC_NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
  "Test SDF Network ; September 2015";
const PUBLIC_FACTORY_CONTRACT_ID =
  process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID ||
  "CDL3HLH5AAND2B2LUDKNUWJ2AASXPKWXBYJNUPCI3XLA25E6DGT3QYIS"; // Example factory, replace if you have a specific one

async function getClaimCodeFromGen() {
  const response = await fetch("https://testnet.launchtube.xyz/gen");
  let code = await response.json();
  return code[0];
}

async function claimToken(claimCode) {
  const url = "https://testnet.launchtube.xyz/claim";
  const body = JSON.stringify({ code: claimCode });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const html = await response.text();

  // Extract the JWT token from the HTML response
  const match = html.match(/Token:\s*([\w-]+\.[\w-]+\.[\w-]+)/i);
  const token = match ? match[1] : null;

  if (token) {
    console.log("✅ JWT Token:", token);
  } else {
    console.error("❌ Could not find JWT token in response.");
  }

  return token;
}

export default function SecuroTikUI() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState(null); // To store user's public key after login
  const [privateKey, setPrivateKey] = useState(null); // To store user's public key after login
  const [userHandle, setUserHandle] = useState(null); // To store user handle for registration/login
  const [isInitializing, setIsInitializing] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const passkeyKitRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!passkeyKitRef.current) {
        passkeyKitRef.current = new PasskeyKit({
          rpcUrl: PUBLIC_RPC_URL,
          networkPassphrase: PUBLIC_NETWORK_PASSPHRASE,
          factoryContractId: PUBLIC_FACTORY_CONTRACT_ID,
          appName: "NFT Ticket Platform",
          // appOrigin might be needed depending on PasskeyKit version and strictness
          // appOrigin: window.location.origin
        });
        console.log("PasskeyKit initialized");
        if (
          localStorage.getItem("public") !== null &&
          localStorage.getItem("public") != "null"
        ) {
          window.location.href = "/dashboard/my";
        } else {
        }
      }
      setIsInitializing(false);
    }
  }, []);

  const handleRegister = async () => {
    if (isInitializing || !passkeyKitRef.current) {
      setStatusMessage("PasskeyKit is not initialized yet.");
      alert("PasskeyKit is not initialized yet.");
      return;
    }
    setStatusMessage("Starting registration...");
    try {
      const claimCode = await getClaimCodeFromGen();
      const token = await claimToken(claimCode);
      localStorage.setItem("jwtToken", token);
    } catch (err) {
      console.error("🚨 Signup failed:", err.message);
    }
    try {
      const username = prompt(
        "Please enter a username for registration (this will be public):"
      );
      if (!username) {
        setStatusMessage("Registration cancelled by user.");
        return;
      }

      console.log(`Attempting Passkey registration for ${username}...`);
      setStatusMessage(`Fetching registration options for ${username}...`);

      // 1. Get registration options from your backend
      const optionsResponse = await fetch("/api/passkey/register-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(
          errorData.error ||
            `Failed to get registration options: ${optionsResponse.statusText}`
        );
      }
      const creationOptions = await optionsResponse.json();
      console.log("Received creation options:", creationOptions);
      setStatusMessage(
        "Received registration options. Waiting for you to create a passkey..."
      );

      // Convert challenge and user.id from base64url to ArrayBuffer
      creationOptions.challenge = base64urlToArrayBuffer(
        creationOptions.challenge
      );
      creationOptions.user.id = base64urlToArrayBuffer(creationOptions.user.id);
      // If pubKeyCredParams alg values are strings in JSON, ensure they are numbers if necessary
      // (though typically they are numbers from the start if the backend sets them correctly)

      // 2. Create the credential using WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: creationOptions,
      });
      console.log("Credential created:", credential);
      setStatusMessage("Passkey created! Verifying with server...");

      // 3. Send the credential to the backend for verification and storage
      const attestationResponse = {
        id: credential.id, // This is the credential ID, often stored
        rawId: arrayBufferToBase64url(credential.rawId), // rawId is the one usually used as credential ID
        response: {
          clientDataJSON: arrayBufferToBase64url(
            credential.response.clientDataJSON
          ),
          attestationObject: arrayBufferToBase64url(
            credential.response.attestationObject
          ),
          // authenticatorData: arrayBufferToBase64url(credential.response.getAuthenticatorData()), // If needed separately
          // transports: credential.response.getTransports && credential.response.getTransports(), // If needed
        },
        type: credential.type,
        // authenticatorAttachment: credential.authenticatorAttachment, // if available and needed by server
      };

      // Call the verification endpoint
      const verificationResponse = await fetch("/api/passkey/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, credential: attestationResponse }), // Send username along
      });

      if (!verificationResponse.ok) {
        const errorData = await verificationResponse.json();
        throw new Error(
          errorData.error ||
            `Verification failed: ${verificationResponse.statusText}`
        );
      }

      const verificationData = await verificationResponse.json();
      console.log("Verification data from server:", verificationData);

      if (verificationData.verified && verificationData.stellarPublicKey) {
        setPublicKey(verificationData.stellarPublicKey);
        setPrivateKey(verificationData.stellarPrivateKey);
        setUserHandle(username);
        setIsLoggedIn(true);
        setStatusMessage(
          `Registration successful! Welcome, ${username}! Your Stellar Public Key: ${verificationData.stellarPublicKey}`
        );
        alert(
          `Registration successful! Your Stellar Public Key: ${verificationData.stellarPublicKey}`
        );
        window.location.href = "/dashboard/my";
      } else {
        throw new Error(
          verificationData.message || "Server verification failed."
        );
      }
    } catch (error) {
      console.error("Passkey registration error:", error);
      setStatusMessage(`Registration failed: ${error.message}`);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (isInitializing || !passkeyKitRef.current) {
      setStatusMessage("PasskeyKit is not initialized yet.");
      alert("PasskeyKit is not initialized yet.");
      return;
    }
    setStatusMessage("Starting login...");
    try {
      console.log("Attempting Passkey login...");
      setStatusMessage("Fetching login options...");

      // 1. Get login/assertion options from your backend
      const optionsResponse = await fetch("/api/passkey/login-options", {
        method: "POST",
        // headers: { 'Content-Type': 'application/json' }, // No body needed for this simple version
        // body: JSON.stringify({ username }), // Optionally send username if you want to scope credentials
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(
          errorData.error ||
            `Failed to get login options: ${optionsResponse.statusText}`
        );
      }
      let assertionOptions = await optionsResponse.json();
      console.log("Received login options:", assertionOptions);
      setStatusMessage(
        "Received login options. Waiting for you to select a passkey..."
      );

      // Convert challenge and any allowCredentials IDs from base64url to ArrayBuffer
      assertionOptions.challenge = base64urlToArrayBuffer(
        assertionOptions.challenge
      );
      if (
        assertionOptions.allowCredentials &&
        assertionOptions.allowCredentials.length > 0
      ) {
        assertionOptions.allowCredentials =
          assertionOptions.allowCredentials.map((cred) => ({
            ...cred,
            id: base64urlToArrayBuffer(cred.id),
          }));
      }

      // 2. Get the assertion using WebAuthn API
      const assertion = await navigator.credentials.get({
        publicKey: assertionOptions,
      });
      console.log("Assertion created:", assertion);
      setStatusMessage("Passkey selected! Verifying with server...");

      // 3. Send the assertion to the backend for verification
      // The assertion object needs to be converted to a JSON-friendly format.
      const assertionResponse = {
        id: assertion.id, // Credential ID
        rawId: arrayBufferToBase64url(assertion.rawId), // rawId is the credential ID
        response: {
          clientDataJSON: arrayBufferToBase64url(
            assertion.response.clientDataJSON
          ),
          authenticatorData: arrayBufferToBase64url(
            assertion.response.authenticatorData
          ),
          signature: arrayBufferToBase64url(assertion.response.signature),
          userHandle: assertion.response.userHandle
            ? arrayBufferToBase64url(assertion.response.userHandle)
            : null,
        },
        type: assertion.type,
        // clientExtensionResults: assertion.getClientExtensionResults(), // If needed
      };

      // Call the verification endpoint
      const verificationResponse = await fetch("/api/passkey/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assertion: assertionResponse }),
      });

      if (!verificationResponse.ok) {
        const errorData = await verificationResponse.json();
        throw new Error(
          errorData.error ||
            `Login verification failed: ${verificationResponse.statusText}`
        );
      }

      const loginData = await verificationResponse.json();
      console.log("Login verification data from server:", loginData);

      if (loginData.verified) {
        setPublicKey(loginData.stellarPublicKey);
        setUserHandle(loginData.username);
        setIsLoggedIn(true);
        setStatusMessage(
          `Login successful! Welcome back, ${loginData.username}! Stellar PK: ${loginData.stellarPublicKey}`
        );
        alert(`Login successful! Welcome back, ${loginData.username}!`);
        window.location.href = "/dashboard/my";
      } else {
        throw new Error(
          loginData.message || "Server login verification failed."
        );
      }
    } catch (error) {
      console.error("Passkey login error:", error);
      setStatusMessage(`Login failed: ${error.message}`);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleViewTickets = () => {
    console.log("Navigating to view tickets...");
    setStatusMessage("Ticket viewing not yet implemented.");
    alert("Ticket viewing not yet implemented.");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPublicKey(null);
    setUserHandle(null);
    setStatusMessage("You have been logged out.");
    console.log("User logged out.");
  };

  useEffect(() => {
    localStorage.setItem("public", publicKey);
    localStorage.setItem("private", privateKey);
    console.log(publicKey, privateKey);

    localStorage.setItem(
      "public",
      "GCW7S25BRU5URFZSEKW7ZOXUBDUQLUMBEKSSW3ED4LJ6A36F4KIN5EOT"
    );
    localStorage.setItem(
      "private",
      "SBAM6WCH6R7NF6ZJXOQ7DKTEMIMCVG4L2MFOVQFRHFJ46ONCFDDGMFMF"
    );
  }, [publicKey, privateKey]);

  if (isInitializing) {
    return (
      <main className={styles.main}>
        <div className={styles.center}>
          <p>Initializing Passkey Service...</p>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">SecuroTik</h1>

      <div className="bg-white rounded-2xl drop-shadow-2xl p-6 w-full max-w-md mb-8">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Login or Register
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Securely access your NFT tickets using passkeys
        </p>
        <button
          className="cursor-pointer w-full py-3 mb-3 bg-blue-500 focus:bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          onClick={handleLogin}
        >
          <span>🔑</span> Login with passkey
        </button>
        <button
          className="cursor-pointer w-full py-3 bg-yellow-400 focus:bg-yellow-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          onClick={handleRegister}
        >
          <span>🔑</span> Signup with passkey
        </button>
      </div>
      <div className="flex w-full gap-3">
        <button className="text-blue-500 text-2xl cursor-pointer">
          <svg
            width="23"
            height="63"
            viewBox="0 0 23 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
              fill="#0A85FF"
            />
          </svg>
        </button>

        <div className="flex flex-col bg-white rounded-2xl drop-shadow-xl p-3 gap-[10px] w-full max-w-md mb-8">
          <div className="w-full h-60 overflow-hidden rounded-2xl">
            <img
              src="/images/hozier.png"
              alt="Hozier Tour Poster"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-normal">
              <span className="font-extrabold text-2xl">Toronto</span> ・ Rogers
              Stadium
            </h3>
            <p className=" text-gray-600 mb-4">
              Hozier – Unreal Unearth Tour 2025
            </p>
            <button className="bg-blue-500 focus:bg-blue-600 w-full text-white font-semibold px-4 py-2 rounded-full">
              Buy tickets
            </button>
          </div>
        </div>
        <button className="text-blue-500 text-2xl cursor-pointer">
          <svg
            style={{ transform: "rotate(180deg)" }}
            width="23"
            height="63"
            viewBox="0 0 23 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
              fill="#0A85FF"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
