use anchor_lang::prelude::*;

// Note: In a real Arcium project, these would be auto-generated from encrypted-ixs
// For this demo, we're showing the structure
mod state;
mod instructions;
mod errors;

use state::*;
use instructions::*;
use errors::*;

declare_id!("5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ");

#[program]
pub mod dark_prediction_market {
    use super::*;

    /// Initialize a new prediction market
    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        market_id: u64,
        question: String,
        end_time: i64,
    ) -> Result<()> {
        instructions::initialize_market(ctx, market_id, question, end_time)
    }

    /// Queue encrypted bet placement computation
    pub fn place_bet(
        ctx: Context<PlaceBet>,
        computation_offset: u64,
        ciphertext_bet_amount: [u8; 32],
        ciphertext_prediction: [u8; 32],
        pub_key: [u8; 32],
        nonce: u128,
    ) -> Result<()> {
        instructions::place_bet(
            ctx,
            computation_offset,
            ciphertext_bet_amount,
            ciphertext_prediction,
            pub_key,
            nonce,
        )
    }

    /// Callback for bet placement - invoked by Arcium after MPC computation
    pub fn place_bet_callback(
        ctx: Context<PlaceBetCallback>,
        encrypted_receipt: Vec<u8>,
    ) -> Result<()> {
        instructions::place_bet_callback(ctx, encrypted_receipt)
    }

    /// Queue market resolution computation
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        computation_offset: u64,
        actual_outcome: u8,
    ) -> Result<()> {
        instructions::resolve_market(ctx, computation_offset, actual_outcome)
    }

    /// Callback for market resolution
    pub fn resolve_market_callback(
        ctx: Context<ResolveMarketCallback>,
        resolution_data: Vec<u8>,
    ) -> Result<()> {
        instructions::resolve_market_callback(ctx, resolution_data)
    }

    /// Claim winnings after market resolution
    pub fn claim_winnings(
        ctx: Context<ClaimWinnings>,
        bet_id: u64,
    ) -> Result<()> {
        instructions::claim_winnings(ctx, bet_id)
    }
}
