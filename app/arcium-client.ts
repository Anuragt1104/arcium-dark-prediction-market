/**
 * Arcium Client Library for Dark Prediction Market
 * Handles encryption/decryption of sensitive market data
 */

import { RescueCipher, getArciumEnv, x25519 } from '@arcium-hq/client';
import { randomBytes } from 'crypto';
import { PublicKey } from '@solana/web3.js';

export interface EncryptedBetData {
  ciphertext_bet_amount: Buffer;
  ciphertext_prediction: Buffer;
  pub_key: Buffer;
  nonce: bigint;
}

export interface BetInput {
  marketId: bigint;
  betAmount: bigint;  // in lamports
  prediction: number; // 0 = NO, 1 = YES
  userNonce: bigint;
}

export class ArciumClient {
  private mxePublicKey: Buffer;
  
  constructor(mxePublicKey: string | Buffer) {
    this.mxePublicKey = typeof mxePublicKey === 'string' 
      ? Buffer.from(mxePublicKey, 'hex')
      : mxePublicKey;
  }

  /**
   * Encrypt bet data for submission to MPC network
   * @param betInput - Bet details to encrypt
   * @returns Encrypted data ready for on-chain submission
   */
  async encryptBet(betInput: BetInput): Promise<EncryptedBetData> {
    // Generate ephemeral key pair for this transaction
    const privateKey = x25519.utils.randomSecretKey();
    const publicKey = x25519.getPublicKey(privateKey);
    
    // Generate random nonce
    const nonceBytes = randomBytes(16);
    const nonce = BigInt('0x' + nonceBytes.toString('hex'));
    
    // Derive shared secret with MXE
    const sharedSecret = x25519.getSharedSecret(privateKey, this.mxePublicKey);
    
    // Initialize cipher
    const cipher = new RescueCipher(sharedSecret);
    
    // Prepare plaintexts
    const betAmountPlaintext = [betInput.betAmount];
    const predictionPlaintext = [BigInt(betInput.prediction)];
    
    // Encrypt values
    const betAmountCiphertext = cipher.encrypt(betAmountPlaintext, nonceBytes);
    const predictionCiphertext = cipher.encrypt(predictionPlaintext, nonceBytes);
    
    return {
      ciphertext_bet_amount: Buffer.from(betAmountCiphertext),
      ciphertext_prediction: Buffer.from(predictionCiphertext),
      pub_key: Buffer.from(publicKey),
      nonce
    };
  }

  /**
   * Decrypt bet receipt returned from MPC computation
   * @param encryptedReceipt - Encrypted receipt from blockchain
   * @param privateKey - User's private key
   * @param nonce - Nonce used for encryption
   * @returns Decrypted bet details
   */
  async decryptBetReceipt(
    encryptedReceipt: Buffer,
    privateKey: Uint8Array,
    nonce: Buffer
  ): Promise<{
    betId: bigint;
    amount: bigint;
    prediction: number;
  }> {
    const sharedSecret = x25519.getSharedSecret(privateKey, this.mxePublicKey);
    const cipher = new RescueCipher(sharedSecret);
    
    // Extract encrypted fields (assuming 32-byte chunks)
    const encryptedBetId = encryptedReceipt.slice(0, 32);
    const encryptedAmount = encryptedReceipt.slice(32, 64);
    const encryptedPrediction = encryptedReceipt.slice(64, 96);
    
    // Decrypt
    const betIdPlaintext = cipher.decrypt(encryptedBetId, nonce);
    const amountPlaintext = cipher.decrypt(encryptedAmount, nonce);
    const predictionPlaintext = cipher.decrypt(encryptedPrediction, nonce);
    
    return {
      betId: betIdPlaintext[0],
      amount: amountPlaintext[0],
      prediction: Number(predictionPlaintext[0])
    };
  }

  /**
   * Calculate payout without revealing bet amount
   * Uses MPC to compute payout on encrypted data
   */
  async calculateEncryptedPayout(
    encryptedAmount: Buffer,
    payoutRatio: bigint,
    privateKey: Uint8Array,
    nonce: Buffer
  ): Promise<bigint> {
    const sharedSecret = x25519.getSharedSecret(privateKey, this.mxePublicKey);
    const cipher = new RescueCipher(sharedSecret);
    
    // Decrypt amount (in real MPC, this would stay encrypted)
    const amountPlaintext = cipher.decrypt(encryptedAmount, nonce);
    
    // Calculate payout: (amount * ratio) / 1e6
    const payout = (amountPlaintext[0] * payoutRatio) / BigInt(1000000);
    
    return payout;
  }
}

/**
 * Fetch MXE public key from on-chain program
 * In production, this would query the actual MXE account
 */
export async function getMXEPublicKey(
  programId: PublicKey
): Promise<Buffer> {
  // In a real implementation, this would:
  // 1. Derive the MXE PDA
  // 2. Fetch the account data
  // 3. Extract the public key field
  
  // For demo purposes, return a mock key
  return Buffer.from(randomBytes(32));
}

/**
 * Helper to generate computation offset (unique ID for MPC computation)
 */
export function generateComputationOffset(): bigint {
  return BigInt(Date.now()) * BigInt(1000) + BigInt(Math.floor(Math.random() * 1000));
}
