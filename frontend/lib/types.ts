import { PublicKey } from '@solana/web3.js'

export interface Market {
  publicKey: PublicKey
  marketId: bigint
  question: string
  creator: PublicKey
  endTime: Date
  totalBets: number
  resolved: boolean
  winningSide: number | null
  category?: string
  description?: string
}

export interface Bet {
  publicKey: PublicKey
  betId: bigint
  marketId: bigint
  bettor: PublicKey
  encryptedAmount: Uint8Array
  encryptedPrediction: Uint8Array
  nonce: Uint8Array
  pubKey: Uint8Array
  timestamp: Date
  claimed: boolean
}

export interface Resolution {
  publicKey: PublicKey
  marketId: bigint
  winningSide: number
  totalPool: bigint
  winningPool: bigint
  payoutRatio: bigint
  resolvedAt: Date
}

export type PredictionSide = 'YES' | 'NO'

export interface MarketStats {
  totalMarkets: number
  activeMarkets: number
  totalVolume: bigint
  totalBets: number
}

