# Architecture Deep Dive

## System Components

### 1. Client Layer (TypeScript)

**`app/arcium-client.ts`**
- Handles encryption/decryption using Arcium SDK
- Implements x25519 ECDH for key exchange
- Uses RescueCipher for symmetric encryption
- Manages shared secrets with MXE

**Key Functions:**
```typescript
encryptBet(input: BetInput): Promise<EncryptedBetData>
- Generates ephemeral keypair
- Derives shared secret with MXE
- Encrypts bet amount and prediction
- Returns ciphertexts + nonce for blockchain submission

decryptBetReceipt(receipt, privateKey, nonce)
- Reverses encryption to verify bet was recorded
- User can confirm their bet without revealing to others

calculateEncryptedPayout(encryptedAmount, ratio)
- Computes winnings on encrypted data (demo)
- In production, this happens entirely in MPC
```

### 2. Solana Program Layer (Rust/Anchor)

**`programs/dark-prediction-market/src/`**

#### State Management (`state.rs`)
```rust
pub struct Market {
    market_id: u64,
    question: String,
    creator: Pubkey,
    end_time: i64,
    total_bets: u64,
    resolved: bool,
    winning_side: Option<u8>,
}

pub struct Bet {
    bet_id: u64,
    market_id: u64,
    bettor: Pubkey,
    encrypted_amount: [u8; 32],      // Ciphertext
    encrypted_prediction: [u8; 32],  // Ciphertext
    nonce: [u8; 16],
    pub_key: [u8; 32],
    timestamp: i64,
    claimed: bool,
}

pub struct Resolution {
    market_id: u64,
    winning_side: u8,
    total_pool: u64,     // Revealed aggregate
    winning_pool: u64,   // Revealed aggregate
    payout_ratio: u64,   // Public calculation
}
```

#### Instruction Flow

**Place Bet:**
```
User → place_bet() → Queue MPC Computation
         ↓
    [Wait for MPC]
         ↓
Arcium → place_bet_callback() → Store encrypted receipt
```

**Resolve Market:**
```
Creator → resolve_market() → Queue MPC Computation
            ↓
       [MPC aggregates all encrypted bets]
            ↓
Arcium → resolve_market_callback() → Store resolution data
```

### 3. MPC Layer (Arcium Network)

**`encrypted-ixs/`** - Rust code compiled to MPC circuits

#### place_bet.rs
```rust
#[instruction]
pub fn place_encrypted_bet(
    input_ctxt: Enc<Shared, BetInput>
) -> Enc<Shared, BetReceipt>
```

**Execution:**
1. Input arrives as `Enc<Shared, BetInput>` - encrypted with shared secret
2. `to_arcis()` converts to MPC representation
3. Operations performed on secret-shared values across nodes
4. Output returned as `Enc<Shared, BetReceipt>` - still encrypted

**Privacy Property:** No single Arx node ever sees:
- The actual bet amount
- The prediction (YES/NO)
- The computed bet ID

#### resolve_market.rs
```rust
#[instruction]
pub fn resolve_encrypted_market(
    state_ctxt: Enc<Shared, MarketState>
) -> Enc<Shared, ResolutionResult>
```

**Execution:**
1. Aggregates `total_yes_bets` and `total_no_bets` (encrypted sums)
2. Determines winning side based on `actual_outcome`
3. Calculates `payout_ratio = (total_pool * 1e6) / winning_pool`
4. Returns result for on-chain storage

**Privacy Property:** While totals are revealed, individual bets stay encrypted

## Data Flow Diagrams

### Bet Placement Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└─────┬───────┘
      │ 1. User inputs: 5 SOL, YES
      ▼
┌─────────────────────────────────────┐
│  ArciumClient.encryptBet()          │
│  • Generate keypair (x25519)        │
│  • Derive shared secret with MXE   │
│  • Encrypt: 5 SOL → [32 bytes]     │
│  • Encrypt: YES → [32 bytes]       │
└─────┬───────────────────────────────┘
      │ 2. Submit encrypted data
      ▼
┌─────────────────────────────────────┐
│  Solana Program: place_bet()        │
│  • Validate market state            │
│  • Build MPC arguments              │
│  • CPI to Arcium program            │
└─────┬───────────────────────────────┘
      │ 3. Queue computation
      ▼
┌─────────────────────────────────────────┐
│  Arcium Network                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Node 1  │ │ Node 2  │ │ Node N  │  │
│  │ share_1 │ │ share_2 │ │ share_N │  │
│  └────┬────┘ └────┬────┘ └────┬────┘  │
│       └───────────┼───────────┘        │
│                   │ Execute MPC         │
│         place_encrypted_bet()           │
└───────────────────┬─────────────────────┘
      │ 4. Return encrypted receipt
      ▼
┌─────────────────────────────────────┐
│  Solana: place_bet_callback()        │
│  • Receive MPC output                │
│  • Create Bet account                │
│  • Store encrypted data              │
└─────────────────────────────────────┘
```

### Market Resolution Flow

```
┌─────────────┐
│   Creator   │
│  resolves   │
└─────┬───────┘
      │ 1. Outcome: YES
      ▼
┌─────────────────────────────────────┐
│  Solana: resolve_market()            │
│  • Verify: market ended              │
│  • Verify: creator only              │
│  • Queue resolution computation      │
└─────┬───────────────────────────────┘
      │ 2. Trigger MPC
      ▼
┌───────────────────────────────────────────┐
│  Arcium MPC: resolve_encrypted_market()   │
│                                           │
│  Fetch all encrypted bets:                │
│  • Bet 1: [encrypted] 5 SOL, YES         │
│  • Bet 2: [encrypted] 3.5 SOL, NO        │
│  • Bet 3: [encrypted] 7.2 SOL, YES       │
│                                           │
│  Aggregate (on encrypted data):           │
│  • total_yes_bets = E(5) + E(7.2)        │
│  • total_no_bets = E(3.5)                │
│                                           │
│  Reveal aggregates:                       │
│  • Total YES: 12.2 SOL                   │
│  • Total NO: 3.5 SOL                     │
│  • Total pool: 15.7 SOL                  │
│                                           │
│  Calculate payout:                        │
│  • Outcome = YES → winners = YES pool    │
│  • ratio = 15.7 / 12.2 = 1.287x          │
└───────────────────┬───────────────────────┘
      │ 3. Return resolution
      ▼
┌─────────────────────────────────────┐
│  Solana: resolve_market_callback()   │
│  • Store resolution result           │
│  • Mark market as resolved           │
│  • Enable claims                     │
└─────────────────────────────────────┘
```

## Security Properties

### Confidentiality
- **Bet amounts**: Encrypted from submission until claim
- **Predictions**: Hidden from participants and observers
- **User strategies**: Cannot be front-run or copied

### Integrity
- **Tamper-proof**: On-chain data is immutable
- **Verifiable**: All computations can be verified
- **Byzantine fault tolerance**: MPC tolerates malicious nodes

### Fairness
- **No information leakage**: MPC reveals nothing beyond output
- **Equal treatment**: All bets processed identically
- **Time-lock**: Can't change bet after seeing others

## Cryptographic Primitives

### x25519 ECDH (Key Exchange)
```
Client generates: sk_client
Client derives: pk_client = x25519(sk_client)

MXE has: pk_mxe (published on-chain)

Shared secret: s = x25519(sk_client, pk_mxe)
             = x25519(sk_mxe, pk_client)
```

### RescueCipher (Symmetric Encryption)
```
Plaintext: [bet_amount] = [5_000_000_000]  // 5 SOL in lamports
Key: s (shared secret from ECDH)
Nonce: random 16 bytes

Ciphertext = RescueCipher.encrypt([5_000_000_000], nonce, s)
           = [32 random-looking bytes]

Decrypt: RescueCipher.decrypt(ciphertext, nonce, s)
       = [5_000_000_000]
```

### Multi-Party Computation
```
Secret Sharing (Shamir-style):
  value = 5 SOL
  → share_1, share_2, share_3
  
  Property: No subset < threshold reveals value
  
Addition on shares:
  Enc(a) + Enc(b) = Enc(a + b)
  
  share_1(a) + share_1(b) = share_1(a+b)
  share_2(a) + share_2(b) = share_2(a+b)
  share_3(a) + share_3(b) = share_3(a+b)
  
  Reconstruct → a + b (but never see a or b individually)
```

## Performance Considerations

### On-Chain Costs
- **Market creation**: ~0.002 SOL (account rent)
- **Place bet**: ~0.005 SOL (bet account + MPC queue)
- **Market resolution**: ~0.003 SOL (resolution account)
- **Claim winnings**: ~0.001 SOL (mark claimed)

### MPC Latency
- **Computation time**: 1-3 seconds (testnet)
- **Node coordination**: Byzantine agreement overhead
- **Network dependent**: Improves with more nodes

### Scalability
- **Bets per market**: Unlimited (read all for resolution)
- **Markets per program**: Unlimited (unique PDAs)
- **Concurrent markets**: No cross-market dependencies

## Future Enhancements

### Planned Features
1. **Confidential SPL tokens** - Use encrypted tokens for bets
2. **Private oracle integration** - Encrypted outcome feeds
3. **AMM-style pricing** - Dynamic odds based on encrypted flows
4. **Multi-outcome markets** - > 2 choices with encrypted tallying
5. **Delayed reveal** - Gradually reveal data post-resolution

### Research Directions
1. **FHE integration** - Fully homomorphic for complex calculations
2. **ZK proofs** - Prove correctness without revealing computation
3. **Cross-chain MPC** - Bets from multiple chains
4. **Private governance** - DAO votes on market validity

## References

- Arcium Purple Paper: https://www.arcium.com/articles/arcium-purplepaper
- Arcis Framework Docs: https://docs.arcium.com/developers
- MPC Protocols: https://www.arcium.com/research
- Solana Program Library: https://docs.solana.com
