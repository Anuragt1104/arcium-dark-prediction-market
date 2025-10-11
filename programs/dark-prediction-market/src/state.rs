use anchor_lang::prelude::*;

/// Prediction market state
#[account]
#[derive(InitSpace)]
pub struct Market {
    pub market_id: u64,
    #[max_len(200)]
    pub question: String,
    pub creator: Pubkey,
    pub end_time: i64,
    pub total_bets: u64,
    pub resolved: bool,
    pub winning_side: Option<u8>,
    pub bump: u8,
}

/// Encrypted bet record
#[account]
#[derive(InitSpace)]
pub struct Bet {
    pub bet_id: u64,
    pub market_id: u64,
    pub bettor: Pubkey,
    // Encrypted data (32 bytes ciphertext each)
    pub encrypted_amount: [u8; 32],
    pub encrypted_prediction: [u8; 32],
    pub nonce: [u8; 16],
    pub pub_key: [u8; 32],
    pub timestamp: i64,
    pub claimed: bool,
    pub bump: u8,
}

/// Market resolution result
#[account]
#[derive(InitSpace)]
pub struct Resolution {
    pub market_id: u64,
    pub winning_side: u8,
    pub total_pool: u64,
    pub winning_pool: u64,
    pub payout_ratio: u64, // Scaled by 1e6
    pub resolved_at: i64,
    pub bump: u8,
}

impl Market {
    pub const SEED_PREFIX: &'static [u8] = b"market";
}

impl Bet {
    pub const SEED_PREFIX: &'static [u8] = b"bet";
}

impl Resolution {
    pub const SEED_PREFIX: &'static [u8] = b"resolution";
}
