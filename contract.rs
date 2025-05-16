//! NFT Ticket Contract for Soroban
#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, Symbol, Vec};

#[contract]
pub struct NftContract;

#[contracttype]
pub struct Ticket {
    id: u64,
    issuer: Address,
    metadata: Bytes,
    price: i128,
}

pub trait NFT {
    fn init(env: Env, admin: Address, payment_token: Address);
    fn mint(env: Env, buyer: Address, metadata: Bytes, price: i128);
    fn buy(env: Env, buyer: Address, ticket_id: u64);
    fn transfer(env: Env, from: Address, to: Address, ticket_id: u64);
    fn list(env: Env) -> Vec<u64>;
    fn owner_of(env: Env, ticket_id: u64) -> Address;
    fn get_metadata(env: Env, ticket_id: u64) -> Bytes;
    fn get_price(env: Env, ticket_id: u64) -> i128;
}

#[contractimpl]
impl NFT for NftContract {
    fn init(env: Env, admin: Address, payment_token: Address) {
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("counter"), &0u64);
        env.storage().instance().set(&symbol_short!("token"), &payment_token);
    }

    fn mint(env: Env, buyer: Address, metadata: Bytes, price: i128) {
        let counter: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("counter"))
            .unwrap_or(0);

        let next_id = counter + 1;

        env.storage().instance().set(&(symbol_short!("owner"), next_id), &buyer);
        env.storage().instance().set(&(symbol_short!("meta"), next_id), &metadata);
        env.storage().instance().set(&(symbol_short!("price"), next_id), &price);
        env.storage().instance().set(&symbol_short!("counter"), &next_id);
    }

    fn buy(env: Env, buyer: Address, ticket_id: u64) {
        let token: Address = env
            .storage()
            .instance()
            .get(&symbol_short!("token"))
            .expect("token not set");

        let owner_key = (symbol_short!("owner"), ticket_id);
        let price_key = (symbol_short!("price"), ticket_id);

        let owner: Address = env.storage().instance().get(&owner_key).expect("owner not found");
        let price: i128 = env.storage().instance().get(&price_key).expect("price not found");

        soroban_sdk::token::Client::new(&env, &token).transfer(&buyer, &owner, &price);

        env.storage().instance().set(&owner_key, &buyer);
    }
    fn transfer(env: Env, from: Address, to: Address, ticket_id: u64) {
        let owner_key = (symbol_short!("owner"), ticket_id);
        let owner: Address = env.storage().instance().get(&owner_key).expect("owner not found");

        let invoker = env.transaction().source_account().unwrap();

        if invoker != owner || from != owner {
                    panic!("Unauthorized transfer");
        }

        env.storage().instance().set(&owner_key, &to);
    }

    fn list(env: Env) -> Vec<u64> {
        let count: u64 = env
            .storage()
            .instance()
            .get(&symbol_short!("counter"))
            .unwrap_or(0);

        let mut ids = Vec::new(&env);
        for id in 1..=count {
            ids.push_back(id);
        }
        ids
    }

    fn owner_of(env: Env, ticket_id: u64) -> Address {
        env.storage()
            .instance()
            .get(&(symbol_short!("owner"), ticket_id))
            .expect("owner not found")
    }

    fn get_metadata(env: Env, ticket_id: u64) -> Bytes {
        env.storage()
            .instance()
            .get(&(symbol_short!("meta"), ticket_id))
            .expect("metadata not found")
    }

    fn get_price(env: Env, ticket_id: u64) -> i128 {
        env.storage()
            .instance()
            .get(&(symbol_short!("price"), ticket_id))
            .expect("price not found")
    }
}