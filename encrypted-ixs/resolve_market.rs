// Encrypted instruction for market resolution
// Determines winners without revealing individual bets
use arcis_imports::*;

#[encrypted]
mod circuits {
    use arcis_imports::*;

    /// Market state with all encrypted bets
    pub struct MarketState {
        pub market_id: u64,
        pub total_yes_bets: u64,
        pub total_no_bets: u64,
        pub bet_count: u32,
        pub actual_outcome: u8,  // 0 = NO, 1 = YES (encrypted until resolution)
    }

    /// Individual bet for resolution
    pub struct BetData {
        pub bet_id: u64,
        pub amount: u64,
        pub prediction: u8,
    }

    /// Resolution result
    pub struct ResolutionResult {
        pub market_id: u64,
        pub winning_side: u8,
        pub total_pool: u64,
        pub winning_pool: u64,
        pub payout_ratio: u64,  // Scaled by 1e6 for precision
    }

    /// Resolve market and calculate payouts
    /// This happens entirely in encrypted space
    #[instruction]
    pub fn resolve_encrypted_market(
        state_ctxt: Enc<Shared, MarketState>
    ) -> Enc<Shared, ResolutionResult> {
        let state = state_ctxt.to_arcis();
        
        // Calculate total pool
        let total_pool = state.total_yes_bets + state.total_no_bets;
        
        // Determine winning pool based on outcome
        let winning_pool = if state.actual_outcome == 1u8 {
            state.total_yes_bets
        } else {
            state.total_no_bets
        };
        
        // Calculate payout ratio (scaled by 1e6)
        // payout_ratio = (total_pool * 1e6) / winning_pool
        let payout_ratio = if winning_pool > 0u64 {
            (total_pool * 1000000u64) / winning_pool
        } else {
            1000000u64  // 1:1 if no winners
        };
        
        let result = ResolutionResult {
            market_id: state.market_id,
            winning_side: state.actual_outcome,
            total_pool,
            winning_pool,
            payout_ratio,
        };
        
        state_ctxt.owner.from_arcis(result)
    }

    /// Calculate individual payout for a bet
    #[instruction]
    pub fn calculate_payout(
        bet_ctxt: Enc<Shared, BetData>,
        outcome: u8,
        payout_ratio: u64
    ) -> Enc<Shared, u64> {
        let bet = bet_ctxt.to_arcis();
        
        // Check if bet won
        let won = bet.prediction == outcome;
        
        // Calculate payout: bet_amount * payout_ratio / 1e6
        let payout = if won {
            (bet.amount * payout_ratio) / 1000000u64
        } else {
            0u64
        };
        
        bet_ctxt.owner.from_arcis(payout)
    }
}
