// Encrypted instruction for MPC-based fair randomness
// Used for random market selection or tiebreakers
use arcis_imports::*;

#[encrypted]
mod circuits {
    use arcis_imports::*;

    /// Input for randomness generation
    pub struct RandomInput {
        pub seed1: u64,
        pub seed2: u64,
        pub seed3: u64,
        pub modulus: u64,
    }

    /// Generate fair random number using MPC
    /// No single node can predict or manipulate the output
    #[instruction]
    pub fn generate_random(
        input_ctxt: Enc<Shared, RandomInput>
    ) -> u64 {
        let input = input_ctxt.to_arcis();
        
        // Combine seeds using operations in MPC
        let combined = (input.seed1 ^ input.seed2) + input.seed3;
        
        // Apply modulus if specified
        let random_value = if input.modulus > 0u64 {
            combined % input.modulus
        } else {
            combined
        };
        
        // Return as plaintext (revealed after MPC)
        random_value.reveal()
    }

    /// Generate random boolean (for coin flips)
    #[instruction]
    pub fn random_boolean(
        seed_ctxt: Enc<Shared, u64>
    ) -> u8 {
        let seed = seed_ctxt.to_arcis();
        let result = (seed % 2u64) as u8;
        result.reveal()
    }
}
