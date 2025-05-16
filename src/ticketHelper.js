import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
// const WASM_HASH =
//   "686dfd0a069a826d19c3ccf441a984c7ddb666dbeb64dfed2db62df63ae7cb2f"; // e.g. bc7d436…7527f :contentReference[oaicite:0]{index=0}
const WASM_HASH =
  "e65f5091a83f8d2f67e4c57ad8a8257f2a2d8c2ac271cc775615b2a7baa0ac52";
// const CONTRACT_ID = "CAWSIHRK6FF2R2AWQT6HRO7RJYV5SPFKTAUZFEXFWD5COPTEAAVK62QP"; // the deployed instance ID
const CONTRACT_ID = "CCS43GO23KAF77M2BR5OG5AW3MZIP5NZCIZVXAUQE6LSDFPRTVYR5JFK";
const blacklistTickets = [
  // 1n,
  // 2n,
  // 3n,
  // 4n,
  // 5n,
  // 6n,
  // 7n,
  // 8n,
  // 9n,
  // 10n,
  // 11n,
  // 12n,
  // 13n,
  // 14n,
  // 15n,
  // 16n,
  // 17n,
  // 18n,
  // 19n,
  // 20n,
  // 21n,
  // 22n,
  // 23n,
  // 24n,
  // 25n,
]; // the 'n' is for BigInt, so 1n is 1 in BigInt
const whitelistTickets = [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n]; // the 'n' is for BigInt, so 1n is 1 in BigInt
export class Ticket {
  constructor({ artistName, name, location, venueName, date, pictureSrc }) {
    this.name = name;
    this.artistName = artistName;
    this.location = location;
    this.venueName = venueName;
    this.date = date;
    this.pictureSrc = pictureSrc;
    this.price = null;
    this.id = null;
    this.owner = null;
  }

  setId(id) {
    this.id = id;
  }

  setPrice(price) {
    this.price = price;
  }

  setOwner(owner) {
    this.owner = owner;
  }

  getMetadata() {
    return JSON.stringify({
      artistName: this.artistName,
      name: this.name,
      location: this.location,
      venueName: this.venueName,
      date: this.date,
      pictureSrc: this.pictureSrc,
    });
  }

  static fromBase64(base64String) {
    let object = null;
    try {
      object = JSON.parse(base64String);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "InvalidCharacterError"
      ) {
        return null;
      }
    }
    return new Ticket({
      artistName: object.artistName,
      name: object.name,
      location: object.location,
      venueName: object.venueName,
      date: object.date,
      pictureSrc: object.pictureSrc,
    });
  }

  async mint(secretKey) {
    // 1️⃣ Load your keypair (must already be funded on testnet!)
    const sourceKeypair = Keypair.fromSecret(secretKey);
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
    const metadataStr = this.getMetadata();
    const priceStroops = BigInt(this.price * 10_000_000); // 1 XLM = 10⁷ stroops

    const mintTx = await client.mint({
      issuer: sourceKeypair.publicKey(),
      metadata: Buffer.from(metadataStr, "utf8"),
      price: priceStroops,
    });

    // 5️⃣ Sign & send, await on‐chain confirmation
    const { result } = await mintTx.signAndSend();
    this.id = result;
    this.owner = sourceKeypair.publicKey();
    console.log("🎉 Mint successful, contract returned:", result);
    return this;
  }
  async buy(secretKey) {
    return await this.mint(secretKey);
  }

  static async listTickets() {
    // 2️⃣ build the Client
    const client = await Client.from({
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
      wasmHash: WASM_HASH,
      contractId: CONTRACT_ID,
    });

    // 3️⃣ call `.list()` and pull out the BigInt[] of ticket IDs
    let { result: ticketIds } = await client.list();
    console.log("All ticket IDs:", ticketIds);

    // 4️⃣ (optional) fetch owner & metadata for each
    ticketIds = ticketIds.filter((id) => !blacklistTickets.includes(id));
    ticketIds = whitelistTickets; // teehee
    const tickets = await Promise.all(
      ticketIds.map(async (id) => {
        // owner_of takes an object with your parameter names
        const { result: owner } = await client.owner_of({ ticket_id: id });
        const { result: metaBytes } = await client.get_metadata({
          ticket_id: id,
        });
        const { result: price } = await client.get_price({ ticket_id: id });
        // metaBytes is a Uint8Array or Buffer
        const metadata = Buffer.from(metaBytes).toString("utf8");
        const ticket = Ticket.fromBase64(metadata);
        if (!ticket) {
          console.error(
            `Ticket ${id} has invalid metadata, consider adding it to the blacklist`
          );
          return null;
        }
        ticket.setPrice(Number(price) / 10_000_000);
        ticket.setId(id);
        ticket.setOwner(owner);
        return ticket;
      })
    );

    console.log("Detailed tickets:", tickets);
    return tickets;
  }

  static async listTicketsByOwner(owner) {
    // 2️⃣ build the Client
    const client = await Client.from({
      rpcUrl: RPC_URL,
      networkPassphrase: NETWORK_PASSPHRASE,
      wasmHash: WASM_HASH,
      contractId: CONTRACT_ID,
    });

    // 3️⃣ call `.list()` and pull out the BigInt[] of ticket IDs
    let { result: ticketIds } = await client.list();
    console.log("All ticket IDs:", ticketIds);

    // 4️⃣ (optional) fetch owner & metadata for each
    ticketIds = ticketIds.filter((id) => !blacklistTickets.includes(id));
    let tickets = await Promise.all(
      ticketIds.map(async (id) => {
        // owner_of takes an object with your parameter names
        const { result: owner } = await client.owner_of({ ticket_id: id });
        const { result: metaBytes } = await client.get_metadata({
          ticket_id: id,
        });
        const { result: price } = await client.get_price({ ticket_id: id });
        // metaBytes is a Uint8Array or Buffer
        const metadata = Buffer.from(metaBytes).toString("utf8");
        const ticket = Ticket.fromBase64(metadata);
        if (!ticket) {
          console.error(
            `Ticket ${id} has invalid metadata, consider adding it to the blacklist`
          );
          return null;
        }
        ticket.setPrice(Number(price) / 10_000_000);
        ticket.setId(id);
        ticket.setOwner(owner);
        return ticket;
      })
    );

    console.log("Detailed tickets:", tickets);
    tickets = tickets.filter((ticket) => ticket.owner === owner);
    return tickets;
  }
  static async populateChain() {
    const demoConcerts = [
      new Ticket({
        artistName: "Taylor Swift",
        name: "Eras Tour",
        location: "Vancouver",
        venueName: "BC Place",
        date: "2025-07-15T00:00:00Z",
        pictureSrc: "/images/taylor.png",
      }),
      new Ticket({
        artistName: "Kendrick Lamar",
        name: "The Big Steppers Tour",
        location: "Montreal",
        venueName: "Bell Centre",
        date: "2025-08-20T00:00:00Z",
        pictureSrc: "/images/kendrick.png",
      }),
      new Ticket({
        artistName: "Coldplay",
        name: "Music of the Spheres World Tour",
        location: "New York City",
        venueName: "Madison Square Garden",
        date: "2025-09-10T00:00:00Z",
        pictureSrc: "/images/coldplay.png",
      }),
      new Ticket({
        artistName: "Beyoncé",
        name: "Renaissance Tour",
        location: "Los Angeles",
        venueName: "SoFi Stadium",
        date: "2025-10-01T00:00:00Z",
        pictureSrc: "/images/beyonce.png",
      }),
      new Ticket({
        artistName: "Arctic Monkeys",
        name: "AM Tour",
        location: "Chicago",
        venueName: "United Center",
        date: "2025-06-18T00:00:00Z",
        pictureSrc: "/images/arctic.png",
      }),
      new Ticket({
        artistName: "Doja Cat",
        name: "Planet Her Tour",
        location: "Atlanta",
        venueName: "State Farm Arena",
        date: "2025-07-22T00:00:00Z",
        pictureSrc: "/images/doja.png",
      }),
      new Ticket({
        artistName: "Drake",
        name: "It's All a Blur Tour",
        location: "Toronto",
        venueName: "Rogers Centre",
        date: "2025-08-05T00:00:00Z",
        pictureSrc: "/images/drake.png",
      }),
      new Ticket({
        artistName: "The Weeknd",
        name: "After Hours Til Dawn",
        location: "Las Vegas",
        venueName: "Allegiant Stadium",
        date: "2025-09-14T00:00:00Z",
        pictureSrc: "/images/weeknd.png",
      }),
      new Ticket({
        artistName: "Phoebe Bridgers",
        name: "Punisher Tour",
        location: "Austin",
        venueName: "Moody Center",
        date: "2025-10-28T00:00:00Z",
        pictureSrc: "/images/phoebe.png",
      }),
      new Ticket({
        artistName: "Laufey",
        name: "A Night at the Symphony",
        location: "Montreal",
        venueName: "Bell Centre",
        date: "2025-10-28T00:00:00Z",
        pictureSrc: "/images/laufey.png",
      }),
    ];

    // Set price and mint them
    for (const ticket of demoConcerts) {
      while (true) {
        try {
          ticket.setPrice(Math.floor(Math.random() * 100 + 20) / 100);
          const result = await ticket.mint(localStorage.getItem("private"));
          console.log(result);
          break;
        } catch (error) {
          continue;
        }
      }
    }
    console.log("All tickets minted successfully");
  }
}
