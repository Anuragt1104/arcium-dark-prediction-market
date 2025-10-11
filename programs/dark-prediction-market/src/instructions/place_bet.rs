use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

/// Place an encrypted bet
/// This queues a computation to Arcium's MPC network
pub fn place_bet(
    ctx: Context<PlaceBet>,
    computation_offset: u64,
    ciphertext_bet_amount: [u8; 32],
    ciphertext_prediction: [u8; 32],
    pub_key: [u8; 32],
    nonce: u128,
) -> Result<()> {
    let market = &ctx.accounts.market;
    let clock = Clock::get()?;
    
    // Verify market is still open
    require!(clock.unix_timestamp < market.end_time, MarketError::MarketEnded);
    require!(!market.resolved, MarketError::MarketAlreadyResolved);
    
    // In a real Arcium integration, here we would:
    // 1. Build arguments for the encrypted instruction
    // 2. Queue the computation via CPI to Arcium program
    // 3. Specify the callback instruction
    
    // Example structure (pseudo-code):
    /*
    let args = vec![
        Argument::ArcisPubkey(pub_key),
        Argument::PlaintextU128(nonce),
        Argument::EncryptedU64(ciphertext_bet_amount),
        Argument::EncryptedU8(ciphertext_prediction),
    ];
    
    queue_computation(
        ctx.accounts,
        computation_offset,
        args,
        None, // No callback server needed for small outputs
        vec![PlaceBetCallback::callback_ix(&[])],
    )?;
    */
    
    msg!("Bet queued for encrypted computation");
    msg!("Market: {}, Offset: {}", market.market_id, computation_offset);
    
    Ok(())
}

/// Callback invoked by Arcium after MPC computation completes
pub fn place_bet_callback(
    ctx: Context<PlaceBetCallback>,
    encrypted_receipt: Vec<u8>,
) -> Result<()> {
    let bet = &mut ctx.accounts.bet;
    let market = &mut ctx.accounts.market;
    let clock = Clock::get()?;
    
    // Parse encrypted receipt from MPC computation
    // In production, this would use the auto-generated output types
    require!(encrypted_receipt.len() >= 96, MarketError::InvalidEncryptedData);
    
    // Store encrypted bet data
    bet.bet_id = market.total_bets;
    bet.market_id = market.market_id;
    bet.bettor = ctx.accounts.bettor.key();
    bet.encrypted_amount.copy_from_slice(&encrypted_receipt[0..32]);
    bet.encrypted_prediction.copy_from_slice(&encrypted_receipt[32..64]);
    bet.nonce.copy_from_slice(&encrypted_receipt[64..80]);
    bet.pub_key.copy_from_slice(&encrypted_receipt[80..112]);
    bet.timestamp = clock.unix_timestamp;
    bet.claimed = false;
    bet.bump = ctx.bumps.bet;
    
    // Increment total bets
    market.total_bets = market.total_bets.checked_add(1).unwrap();
    
    msg!("Bet {} placed successfully (encrypted)", bet.bet_id);
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(computation_offset: u64)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    /// In a real Arcium integration, additional accounts would be here:
    /// - MXE program account
    /// - Computation definition PDA
    /// - Cluster PDA
    /// - Arcium program account
    /// etc.
}

#[derive(Accounts)]
pub struct PlaceBetCallback<'info> {
    #[account(
        init,
        payer = bettor,
        space = 8 + Bet::INIT_SPACE,
        seeds = [
            Bet::SEED_PREFIX,
            &market.market_id.to_le_bytes(),
            &market.total_bets.to_le_bytes()
        ],
        bump
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
