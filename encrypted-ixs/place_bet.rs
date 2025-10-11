// Encrypted instruction for placing private bets
// This runs in MPC across Arcium's Arx nodes
use arcis_imports::*;

#[encrypted]
mod circuits {
    use arcis_imports::*;

    /// Input values for placing a bet
    /// These remain encrypted throughout the computation
    pub struct BetInput {
        pub market_id: u64,
        pub bet_amount: u64,  // Encrypted bet amount in lamports
        pub prediction: u8,   // Encrypted prediction (0 = NO, 1 = YES)
        pub user_nonce: u64,  // For uniqueness
    }

    /// Output structure for bet placement
    /// Returns encrypted bet receipt
    pub struct BetReceipt {
        pub bet_id: u64,
        pub encrypted_amount: u64,
        pub encrypted_prediction: u8,
        pub timestamp: u64,
    }

    /// Main encrypted instruction for placing a bet
    /// Data stays encrypted - no node sees the actual values
    #[instruction]
    pub fn place_encrypted_bet(
        input_ctxt: Enc<Shared, BetInput>
    ) -> Enc<Shared, BetReceipt> {
        let input = input_ctxt.to_arcis();
        
        // All operations happen on encrypted data
        // Generate unique bet ID from inputs
        let bet_id = input.market_id * 1000000u64 + input.user_nonce;
        
        // Create encrypted receipt
        let receipt = BetReceipt {
            bet_id,
            encrypted_amount: input.bet_amount,
            encrypted_prediction: input.prediction,
            timestamp: 0u64, // Will be set by callback with actual block time
        };
        
        // Return encrypted receipt
        input_ctxt.owner.from_arcis(receipt)
    }
}
