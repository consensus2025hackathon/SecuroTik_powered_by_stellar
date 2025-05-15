'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css'; // We'll create this later
import { PasskeyKit } from 'passkey-kit';

// Helper function to convert base64url string to ArrayBuffer
function base64urlToArrayBuffer(base64urlString) {
  const padding = '='.repeat((4 - base64urlString.length % 4) % 4);
  const base64 = (base64urlString + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

// Helper function to convert ArrayBuffer to base64url string
function arrayBufferToBase64url(arrayBuffer) {
  const byteArray = new Uint8Array(arrayBuffer);
  let byteString = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  const base64 = window.btoa(byteString);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Placeholder environment variables (replace with actual .env values)
const PUBLIC_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';
const PUBLIC_NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';
const PUBLIC_FACTORY_CONTRACT_ID = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ID || 'CDL3HLH5AAND2B2LUDKNUWJ2AASXPKWXBYJNUPCI3XLA25E6DGT3QYIS'; // Example factory, replace if you have a specific one

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState(null); // To store user's public key after login
  const [userHandle, setUserHandle] = useState(null); // To store user handle for registration/login
  const [isInitializing, setIsInitializing] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Use a ref for passkeyKitInstance to ensure it's stable across re-renders
  const passkeyKitRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!passkeyKitRef.current) {
        passkeyKitRef.current = new PasskeyKit({
          rpcUrl: PUBLIC_RPC_URL,
          networkPassphrase: PUBLIC_NETWORK_PASSPHRASE,
          factoryContractId: PUBLIC_FACTORY_CONTRACT_ID,
          appName: 'NFT Ticket Platform',
          // appOrigin might be needed depending on PasskeyKit version and strictness
          // appOrigin: window.location.origin 
        });
        console.log('PasskeyKit initialized');
      }
      setIsInitializing(false);
    }
  }, []);

  const handleRegister = async () => {
    if (isInitializing || !passkeyKitRef.current) {
      setStatusMessage('PasskeyKit is not initialized yet.');
      alert('PasskeyKit is not initialized yet.');
      return;
    }
    setStatusMessage('Starting registration...');
    try {
      const username = prompt("Please enter a username for registration (this will be public):");
      if (!username) {
        setStatusMessage('Registration cancelled by user.');
        return;
      }

      console.log(`Attempting Passkey registration for ${username}...`);
      setStatusMessage(`Fetching registration options for ${username}...`);

      // 1. Get registration options from your backend
      const optionsResponse = await fetch('/api/passkey/register-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || `Failed to get registration options: ${optionsResponse.statusText}`);
      }
      const creationOptions = await optionsResponse.json();
      console.log('Received creation options:', creationOptions);
      setStatusMessage('Received registration options. Waiting for you to create a passkey...');

      // Convert challenge and user.id from base64url to ArrayBuffer
      creationOptions.challenge = base64urlToArrayBuffer(creationOptions.challenge);
      creationOptions.user.id = base64urlToArrayBuffer(creationOptions.user.id);
      // If pubKeyCredParams alg values are strings in JSON, ensure they are numbers if necessary
      // (though typically they are numbers from the start if the backend sets them correctly)

      // 2. Create the credential using WebAuthn API
      const credential = await navigator.credentials.create({ publicKey: creationOptions });
      console.log('Credential created:', credential);
      setStatusMessage('Passkey created! Verifying with server...');

      // 3. Send the credential to the backend for verification and storage
      const attestationResponse = {
        id: credential.id, // This is the credential ID, often stored
        rawId: arrayBufferToBase64url(credential.rawId), // rawId is the one usually used as credential ID
        response: {
          clientDataJSON: arrayBufferToBase64url(credential.response.clientDataJSON),
          attestationObject: arrayBufferToBase64url(credential.response.attestationObject),
          // authenticatorData: arrayBufferToBase64url(credential.response.getAuthenticatorData()), // If needed separately
          // transports: credential.response.getTransports && credential.response.getTransports(), // If needed
        },
        type: credential.type,
        // authenticatorAttachment: credential.authenticatorAttachment, // if available and needed by server
      };

      // Call the verification endpoint
      const verificationResponse = await fetch('/api/passkey/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, credential: attestationResponse }), // Send username along
      });

      if (!verificationResponse.ok) {
        const errorData = await verificationResponse.json();
        throw new Error(errorData.error || `Verification failed: ${verificationResponse.statusText}`);
      }
      
      const verificationData = await verificationResponse.json();
      console.log('Verification data from server:', verificationData);

      if (verificationData.verified && verificationData.stellarPublicKey) {
        setPublicKey(verificationData.stellarPublicKey);
        setUserHandle(username);
        setIsLoggedIn(true);
        setStatusMessage(`Registration successful! Welcome, ${username}! Your Stellar Public Key: ${verificationData.stellarPublicKey}`);
        alert(`Registration successful! Your Stellar Public Key: ${verificationData.stellarPublicKey}`);
      } else {
        throw new Error(verificationData.message || 'Server verification failed.');
      }

    } catch (error) {
      console.error('Passkey registration error:', error);
      setStatusMessage(`Registration failed: ${error.message}`);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (isInitializing || !passkeyKitRef.current) {
      setStatusMessage('PasskeyKit is not initialized yet.');
      alert('PasskeyKit is not initialized yet.');
      return;
    }
    setStatusMessage('Starting login...');
    try {
      console.log('Attempting Passkey login...');
      setStatusMessage('Fetching login options...');

      // 1. Get login/assertion options from your backend
      const optionsResponse = await fetch('/api/passkey/login-options', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' }, // No body needed for this simple version
        // body: JSON.stringify({ username }), // Optionally send username if you want to scope credentials
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || `Failed to get login options: ${optionsResponse.statusText}`);
      }
      let assertionOptions = await optionsResponse.json();
      console.log('Received login options:', assertionOptions);
      setStatusMessage('Received login options. Waiting for you to select a passkey...');

      // Convert challenge and any allowCredentials IDs from base64url to ArrayBuffer
      assertionOptions.challenge = base64urlToArrayBuffer(assertionOptions.challenge);
      if (assertionOptions.allowCredentials && assertionOptions.allowCredentials.length > 0) {
        assertionOptions.allowCredentials = assertionOptions.allowCredentials.map(cred => ({
          ...cred,
          id: base64urlToArrayBuffer(cred.id),
        }));
      }

      // 2. Get the assertion using WebAuthn API
      const assertion = await navigator.credentials.get({ publicKey: assertionOptions });
      console.log('Assertion created:', assertion);
      setStatusMessage('Passkey selected! Verifying with server...');

      // 3. Send the assertion to the backend for verification
      // The assertion object needs to be converted to a JSON-friendly format.
      const assertionResponse = {
        id: assertion.id, // Credential ID
        rawId: arrayBufferToBase64url(assertion.rawId), // rawId is the credential ID
        response: {
          clientDataJSON: arrayBufferToBase64url(assertion.response.clientDataJSON),
          authenticatorData: arrayBufferToBase64url(assertion.response.authenticatorData),
          signature: arrayBufferToBase64url(assertion.response.signature),
          userHandle: assertion.response.userHandle ? arrayBufferToBase64url(assertion.response.userHandle) : null,
        },
        type: assertion.type,
        // clientExtensionResults: assertion.getClientExtensionResults(), // If needed
      };

      // Call the verification endpoint
      const verificationResponse = await fetch('/api/passkey/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assertion: assertionResponse }),
      });

      if (!verificationResponse.ok) {
         const errorData = await verificationResponse.json();
         throw new Error(errorData.error || `Login verification failed: ${verificationResponse.statusText}`);
      }
      
      const loginData = await verificationResponse.json();
      console.log('Login verification data from server:', loginData);

      if (loginData.verified) {
        setPublicKey(loginData.stellarPublicKey);
        setUserHandle(loginData.username);
        setIsLoggedIn(true);
        setStatusMessage(`Login successful! Welcome back, ${loginData.username}! Stellar PK: ${loginData.stellarPublicKey}`);
        alert(`Login successful! Welcome back, ${loginData.username}!`);
      } else {
        throw new Error(loginData.message || 'Server login verification failed.');
      }

    } catch (error) {
      console.error('Passkey login error:', error);
      setStatusMessage(`Login failed: ${error.message}`);
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleViewTickets = () => {
    console.log('Navigating to view tickets...');
    setStatusMessage('Ticket viewing not yet implemented.');
    alert('Ticket viewing not yet implemented.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPublicKey(null);
    setUserHandle(null);
    setStatusMessage('You have been logged out.');
    console.log('User logged out.');
  };

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
    <main className={styles.main}>
      <div className={styles.center}>
        {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
        {isLoggedIn ? (
          <div className={styles.loggedInContainer}>
            <h2>Welcome, {userHandle || 'User'}!</h2>
            {publicKey && <p className={styles.publicKeyText}>Your Stellar Public Key (Simulated): {publicKey}</p>}
            <button onClick={handleViewTickets} className={styles.button}>
              View My Tickets
            </button>
            <button onClick={handleLogout} className={`${styles.button} ${styles.logoutButton}`}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.loggedOutContainer}>
            <h1>Login or Register</h1>
            <p>Securely access your NFT tickets using Passkeys.</p>
            <button onClick={handleRegister} className={styles.button} disabled={isInitializing || !!statusMessage.includes('Waiting') || !!statusMessage.includes('Fetching') }>
              Register with Passkey
            </button>
            <button onClick={handleLogin} className={styles.button} disabled={isInitializing || !!statusMessage.includes('Waiting') || !!statusMessage.includes('Fetching') }>
              Login with Passkey
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
