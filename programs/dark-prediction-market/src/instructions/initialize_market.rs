use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

pub fn initialize_market(
    ctx: Context<InitializeMarket>,
    market_id: u64,
    question: String,
    end_time: i64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let clock = Clock::get()?;
    
    require!(end_time > clock.unix_timestamp, MarketError::MarketEnded);
    require!(question.len() <= 200, MarketError::InvalidEncryptedData);
    
    market.market_id = market_id;
    market.question = question;
    market.creator = ctx.accounts.creator.key();
    market.end_time = end_time;
    market.total_bets = 0;
    market.resolved = false;
    market.winning_side = None;
    market.bump = ctx.bumps.market;
    
    msg!("Market {} initialized: ending at {}", market_id, end_time);
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(market_id: u64)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Market::INIT_SPACE,
        seeds = [Market::SEED_PREFIX, &market_id.to_le_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
