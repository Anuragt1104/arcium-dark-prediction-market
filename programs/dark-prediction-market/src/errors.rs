use anchor_lang::prelude::*;

#[error_code]
pub enum MarketError {
    #[msg("Market has already ended")]
    MarketEnded,
    
    #[msg("Market has not ended yet")]
    MarketNotEnded,
    
    #[msg("Market is not resolved")]
    MarketNotResolved,
    
    #[msg("Market is already resolved")]
    MarketAlreadyResolved,
    
    #[msg("Bet has already been claimed")]
    BetAlreadyClaimed,
    
    #[msg("Invalid bet amount")]
    InvalidBetAmount,
    
    #[msg("Invalid prediction value")]
    InvalidPrediction,
    
    #[msg("Computation aborted")]
    AbortedComputation,
    
    #[msg("Invalid encrypted data")]
    InvalidEncryptedData,
    
    #[msg("Unauthorized")]
    Unauthorized,
}
