import { PublicKey } from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || '5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ'
)

export const LAMPORTS_PER_SOL = 1_000_000_000

export const MARKET_CATEGORIES = [
  'Crypto',
  'Politics',
  'Sports',
  'Technology',
  'Entertainment',
  'Other'
] as const

export type MarketCategory = typeof MARKET_CATEGORIES[number]

export const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com'

