use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

/// Resolve market with encrypted computation
pub fn resolve_market(
    ctx: Context<ResolveMarket>,
    computation_offset: u64,
    actual_outcome: u8,
) -> Result<()> {
    let market = &ctx.accounts.market;
    let clock = Clock::get()?;
    
    // Verify market can be resolved
    require!(clock.unix_timestamp >= market.end_time, MarketError::MarketNotEnded);
    require!(!market.resolved, MarketError::MarketAlreadyResolved);
    require!(actual_outcome <= 1, MarketError::InvalidPrediction);
    
    // Only creator can resolve
    require!(
        ctx.accounts.resolver.key() == market.creator,
        MarketError::Unauthorized
    );
    
    // In a real Arcium integration:
    // 1. Collect all encrypted bets
    // 2. Queue resolution computation
    // 3. MPC network calculates totals and payout ratios
    
    msg!("Market {} resolution queued", market.market_id);
    msg!("Actual outcome: {}", actual_outcome);
    
    Ok(())
}

/// Callback for market resolution
pub fn resolve_market_callback(
    ctx: Context<ResolveMarketCallback>,
    resolution_data: Vec<u8>,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let resolution = &mut ctx.accounts.resolution;
    let clock = Clock::get()?;
    
    // Parse resolution data from MPC
    require!(resolution_data.len() >= 40, MarketError::InvalidEncryptedData);
    
    let winning_side = resolution_data[0];
    let total_pool = u64::from_le_bytes(resolution_data[1..9].try_into().unwrap());
    let winning_pool = u64::from_le_bytes(resolution_data[9..17].try_into().unwrap());
    let payout_ratio = u64::from_le_bytes(resolution_data[17..25].try_into().unwrap());
    
    // Update market state
    market.resolved = true;
    market.winning_side = Some(winning_side);
    
    // Store resolution details
    resolution.market_id = market.market_id;
    resolution.winning_side = winning_side;
    resolution.total_pool = total_pool;
    resolution.winning_pool = winning_pool;
    resolution.payout_ratio = payout_ratio;
    resolution.resolved_at = clock.unix_timestamp;
    resolution.bump = ctx.bumps.resolution;
    
    msg!("Market {} resolved!", market.market_id);
    msg!("Winning side: {}", winning_side);
    msg!("Payout ratio: {}x (scaled)", payout_ratio);
    
    Ok(())
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    pub resolver: Signer<'info>,
    
    /// Additional Arcium accounts would be here
}

#[derive(Accounts)]
pub struct ResolveMarketCallback<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        init,
        payer = resolver,
        space = 8 + Resolution::INIT_SPACE,
        seeds = [Resolution::SEED_PREFIX, &market.market_id.to_le_bytes()],
        bump
    )]
    pub resolution: Account<'info, Resolution>,
    
    #[account(mut)]
    pub resolver: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
