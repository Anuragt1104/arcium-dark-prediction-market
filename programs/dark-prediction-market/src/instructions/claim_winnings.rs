use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

/// Claim winnings after market resolution
pub fn claim_winnings(
    ctx: Context<ClaimWinnings>,
    bet_id: u64,
) -> Result<()> {
    let market = &ctx.accounts.market;
    let bet = &mut ctx.accounts.bet;
    let resolution = &ctx.accounts.resolution;
    
    // Verify market is resolved
    require!(market.resolved, MarketError::MarketNotResolved);
    require!(!bet.claimed, MarketError::BetAlreadyClaimed);
    require!(bet.bettor == ctx.accounts.bettor.key(), MarketError::Unauthorized);
    
    // In a real implementation with Arcium:
    // 1. Queue encrypted payout calculation
    // 2. MPC computes: (encrypted_bet_amount * payout_ratio) / 1e6
    // 3. Transfer computed amount to winner
    
    // For this demo, we mark as claimed
    bet.claimed = true;
    
    // In production, actual payout would happen here via:
    // - Decrypt the bet amount in MPC
    // - Calculate payout: amount * payout_ratio / 1e6
    // - Transfer SOL to bettor
    
    msg!("Winnings claimed for bet {}", bet_id);
    msg!("Payout ratio: {}", resolution.payout_ratio);
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(bet_id: u64)]
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        mut,
        seeds = [
            Bet::SEED_PREFIX,
            &market.market_id.to_le_bytes(),
            &bet_id.to_le_bytes()
        ],
        bump = bet.bump
    )]
    pub bet: Account<'info, Bet>,
    
    #[account(
        seeds = [Resolution::SEED_PREFIX, &market.market_id.to_le_bytes()],
        bump = resolution.bump
    )]
    pub resolution: Account<'info, Resolution>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
}
