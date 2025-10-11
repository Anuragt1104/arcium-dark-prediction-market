# Arcium Integration Guide

This document provides detailed information about how this project integrates with Arcium's encrypted compute platform.

## Overview

Arcium enables **confidential computing** on Solana through Multi-Party Computation (MPC). This allows computations to be performed on encrypted data without ever decrypting it.

## Integration Architecture

### 1. Encrypted Instructions (MPC Side)

Located in `encrypted-ixs/`, these Rust files define operations that run in Arcium's MPC network:

```rust
#[encrypted]
mod circuits {
    use arcis_imports::*;
    
    #[instruction]
    pub fn place_encrypted_bet(
        input_ctxt: Enc<Shared, BetInput>
    ) -> Enc<Shared, BetReceipt> {
        // Computation on encrypted data
        let input = input_ctxt.to_arcis();
        let result = process_encrypted(input);
        input_ctxt.owner.from_arcis(result)
    }
}
```

**Key Points:**
- `#[encrypted]` marks the module as MPC code
- `#[instruction]` marks entry points callable from Solana
- `Enc<Shared, T>` represents encrypted data with shared secret
- Operations happen on encrypted values - no node sees plaintext

### 2. Solana Program (Blockchain Side)

The Solana program (`programs/dark-prediction-market/`) orchestrates the encrypted computations:

**Queueing a Computation:**
```rust
use arcium_sdk::*;

pub fn place_bet(
    ctx: Context<PlaceBet>,
    computation_offset: u64,
    ciphertext_bet_amount: [u8; 32],
    ciphertext_prediction: [u8; 32],
    pub_key: [u8; 32],
    nonce: u128,
) -> Result<()> {
    // Build arguments for encrypted instruction
    let args = vec![
        Argument::ArcisPubkey(pub_key),
        Argument::PlaintextU128(nonce),
        Argument::EncryptedU64(ciphertext_bet_amount),
        Argument::EncryptedU8(ciphertext_prediction),
    ];
    
    // Queue computation via CPI to Arcium program
    queue_computation(
        ctx.accounts,
        computation_offset,
        args,
        None, // No callback server (output fits in tx)
        vec![PlaceBetCallback::callback_ix(&[])],
    )?;
    
    Ok(())
}
```

**Callback Handler:**
```rust
#[arcium_callback(encrypted_ix = "place_encrypted_bet")]
pub fn place_bet_callback(
    ctx: Context<PlaceBetCallback>,
    output: ComputationOutputs,
) -> Result<()> {
    // Extract result from MPC computation
    let result = match output {
        ComputationOutputs::Success(data) => data,
        _ => return Err(ErrorCode::AbortedComputation.into()),
    };
    
    // Store encrypted result on-chain
    ctx.accounts.bet.encrypted_data = result.ciphertexts;
    
    Ok(())
}
```

### 3. Client-Side Encryption (TypeScript)

The `app/arcium-client.ts` handles encryption before submission:

```typescript
import { RescueCipher, x25519 } from '@arcium-hq/client';

// Generate ephemeral keypair
const privateKey = x25519.utils.randomSecretKey();
const publicKey = x25519.getPublicKey(privateKey);

// Derive shared secret with MXE
const sharedSecret = x25519.getSharedSecret(
    privateKey, 
    mxePublicKey
);

// Encrypt data
const cipher = new RescueCipher(sharedSecret);
const ciphertext = cipher.encrypt([value], nonce);

// Submit to Solana
await program.methods.placeBet(
    computationOffset,
    Array.from(ciphertext),
    Array.from(publicKey),
    nonce
).rpc();
```

## Data Flow

### Placing a Bet (Complete Flow)

```
1. USER
   ├─ Generate x25519 keypair
   ├─ Derive shared secret with MXE
   ├─ Encrypt bet amount & prediction
   └─ Submit tx to Solana

2. SOLANA PROGRAM
   ├─ Receive encrypted data
   ├─ Validate market state
   ├─ Build MPC arguments
   └─ Queue computation (CPI to Arcium)

3. ARCIUM MPC NETWORK
   ├─ Receive computation request
   ├─ Split encrypted data into shares
   ├─ Distribute to Arx nodes
   ├─ Each node processes share
   ├─ Combine results
   └─ Return encrypted output

4. CALLBACK INSTRUCTION
   ├─ Arcium invokes callback
   ├─ Receive encrypted result
   ├─ Store on-chain
   └─ Emit event
```

## Account Structure

### Required Accounts for MPC Operations

When calling `queue_computation`, you need:

```rust
#[queue_computation_accounts("place_encrypted_bet", payer)]
#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    // Arcium-required accounts (auto-added by macro)
    // - mxe_account: The MXE program data account
    // - comp_def_pda: Computation definition PDA
    // - cluster_pda: Cluster coordinator PDA
    // - mempool_pda: Memory pool PDA
    // - arcium_program: Arcium system program
    // - clock: Solana clock sysvar
    // - system_program: Solana system program
}
```

### Callback Accounts

```rust
#[callback_accounts]
#[derive(Accounts)]
pub struct PlaceBetCallback<'info> {
    #[account(init, payer = bettor, space = ...)]
    pub bet: Account<'info, Bet>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub bettor: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}
```

## Encryption Details

### RescueCipher

Arcium uses the **Rescue** symmetric cipher, optimized for MPC:

- **Block size**: 256 bits
- **Security level**: 128-bit security
- **MPC-friendly**: Efficient in secret-shared form

### x25519 Key Exchange

Ephemeral Diffie-Hellman key agreement:

- **Curve**: Curve25519 (fast, secure)
- **Key size**: 32 bytes
- **Properties**: Forward secrecy (each bet uses new keypair)

### Nonce Generation

```typescript
const nonce = randomBytes(16); // 128-bit nonce
```

- Must be unique per encryption
- Prevents replay attacks
- Provides semantic security

## Testing with Arcium

### Unit Tests (Encryption)

```typescript
it('Should encrypt and decrypt correctly', async () => {
    const plaintext = BigInt(5 * LAMPORTS_PER_SOL);
    const encrypted = await arciumClient.encryptBet({...});
    
    // Verify ciphertext properties
    expect(encrypted.ciphertext_bet_amount).to.have.length(32);
    expect(encrypted.pub_key).to.have.length(32);
});
```

### Integration Tests (With MPC Network)

```typescript
it('Should process bet via MPC', async () => {
    // Place bet (queues MPC computation)
    await program.methods.placeBet(...).rpc();
    
    // Wait for MPC processing
    await sleep(5000);
    
    // Verify callback was invoked
    const bet = await program.account.bet.fetch(betPda);
    expect(bet.encrypted_amount).to.not.be.empty;
});
```

## Deployment

### Testnet Deployment

1. **Deploy Solana Program**
   ```bash
   anchor build
   anchor deploy --provider.cluster devnet
   ```

2. **Initialize MXE**
   ```bash
   arcium mxe init --program-id <YOUR_PROGRAM_ID>
   ```

3. **Register Encrypted Instructions**
   ```bash
   arcium comp-def init place_encrypted_bet
   arcium comp-def init resolve_encrypted_market
   ```

### Mainnet Considerations

- **Node Selection**: Choose Arx nodes with high uptime
- **Computation Pricing**: Set appropriate priority fees
- **Error Handling**: Implement retry logic for MPC failures
- **Monitoring**: Track computation success rates

## Security Considerations

### What Arcium Protects

✅ **Bet amounts** - Encrypted until resolution  
✅ **Predictions** - Hidden from other participants  
✅ **Intermediate computations** - Never exposed  

### What Remains Public

⚠️ **Wallet addresses** - On-chain identity  
⚠️ **Transaction timing** - When bets were placed  
⚠️ **Bet count** - How many bets per market  

### Best Practices

1. **Key Management**: Never reuse ephemeral keys
2. **Nonce Uniqueness**: Use cryptographic RNG
3. **Validation**: Verify MPC outputs in callbacks
4. **Rate Limiting**: Prevent computation spam
5. **Monitoring**: Alert on failed computations

## Performance

### Computation Latency

| Operation | Typical Time |
|-----------|-------------|
| Encrypt bet data | <10ms |
| Queue computation | ~400ms (Solana tx) |
| MPC processing | 2-5 seconds |
| Callback execution | ~400ms (Solana tx) |
| **Total** | **~3-6 seconds** |

### Cost Analysis

| Component | Cost |
|-----------|------|
| Solana tx (place bet) | ~0.000005 SOL |
| MPC computation | Platform-dependent |
| Callback tx | ~0.000005 SOL |
| Storage rent | ~0.002 SOL/bet |

## Troubleshooting

### Common Issues

**1. Computation Timeout**
```
Error: MPC computation exceeded timeout
```
**Solution**: Increase timeout or reduce computation complexity

**2. Invalid Ciphertext**
```
Error: Failed to deserialize ciphertext
```
**Solution**: Ensure ciphertext is exactly 32 bytes

**3. Callback Not Invoked**
```
Error: Waiting for callback...
```
**Solution**: Check Arx node connectivity, verify callback server

### Debug Tools

```typescript
// Enable verbose logging
process.env.ARCIUM_LOG_LEVEL = 'debug';

// Check computation status
const status = await arcium.getComputationStatus(computationOffset);
console.log('MPC Status:', status);
```

## Resources

- [Arcium Docs](https://docs.arcium.com)
- [Arcis Framework](https://docs.arcium.com/developers/arcis)
- [MPC Explainer](https://www.arcium.com/articles/arciums-architecture)
- [Example Projects](https://github.com/arcium-hq/examples)

## Support

- **Discord**: [Arcium Community](https://discord.gg/arcium)
- **Email**: support@arcium.com
- **GitHub Issues**: [Report bugs](https://github.com/arcium-hq/arcium/issues)
