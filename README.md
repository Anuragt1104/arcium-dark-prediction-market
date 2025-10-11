# 🔒 Dark Prediction Market - Arcium Encrypted Compute Demo

A **privacy-preserving prediction market** built on Solana using [Arcium](https://arcium.com)'s encrypted Multi-Party Computation (MPC) technology. This project demonstrates how to build applications where sensitive data remains encrypted throughout the entire computation lifecycle.

![Arcium MPC](https://img.shields.io/badge/Arcium-MPC-purple)
![Solana](https://img.shields.io/badge/Solana-Blockchain-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Project Overview

Traditional prediction markets expose all bets publicly, enabling:
- **Front-running**: Traders can see large orders and trade ahead
- **Market manipulation**: Whales can influence outcomes
- **Privacy leaks**: Everyone knows your positions and bet sizes

**Dark Prediction Market solves this** using Arcium's encrypted compute:

✅ **Hidden bet amounts** - No one sees how much you wagered  
✅ **Private predictions** - Your position stays secret until resolution  
✅ **Fair payouts** - MPC calculates winners without revealing individual bets  
✅ **No trust required** - Computation happens across decentralized Arx nodes  

## 🏗️ Architecture

### How It Works

```
┌─────────────┐
│   User      │ Encrypts bet data
│  (Client)   │ using x25519 + RescueCipher
└──────┬──────┘
       │
       │ Encrypted bet submission
       ▼
┌─────────────────────────────────────┐
│   Solana Program (On-chain)         │
│  - Stores encrypted bets            │
│  - Queues MPC computations          │
│  - Handles callbacks                │
└──────┬──────────────────────────────┘
       │
       │ Queue computation
       ▼
┌─────────────────────────────────────┐
│   Arcium MPC Network                │
│   ┌────────┐ ┌────────┐ ┌────────┐ │
│   │ Arx    │ │ Arx    │ │ Arx    │ │
│   │ Node 1 │ │ Node 2 │ │ Node N │ │
│   └────────┘ └────────┘ └────────┘ │
│   Processes encrypted data via MPC  │
│   No single node sees plaintext     │
└──────┬──────────────────────────────┘
       │
       │ Return encrypted result
       ▼
┌─────────────────────────────────────┐
│   Callback Instruction              │
│  - Store resolution result          │
│  - Enable payout claims             │
└─────────────────────────────────────┘
```

### Key Components

1. **Encrypted Instructions** (`encrypted-ixs/`)
   - Written in Arcis (Rust framework for MPC)
   - Marked with `#[encrypted]` and `#[instruction]` macros
   - Executed across Arcium's decentralized node network

2. **Solana Program** (`programs/dark-prediction-market/`)
   - Manages market lifecycle (create, bet, resolve, claim)
   - Queues encrypted computations
   - Handles MPC callbacks with results

3. **TypeScript Client** (`app/`)
   - `arcium-client.ts`: Encryption/decryption utilities
   - `index.ts`: High-level market interactions

## 🔐 Privacy Features

### What Stays Private?

| Data | Visibility |
|------|-----------|
| Bet Amount | 🔒 Encrypted until resolution |
| Prediction (YES/NO) | 🔒 Encrypted until resolution |
| User Identity | 🔓 Public (wallet address on-chain) |
| Market Question | 🔓 Public |
| Total Bets Count | 🔓 Public |
| Resolution Outcome | 🔓 Public after resolution |
| Payout Ratios | 🔓 Public after resolution |

### Encryption Process

```typescript
// 1. Generate ephemeral keypair
const privateKey = x25519.utils.randomSecretKey();
const publicKey = x25519.getPublicKey(privateKey);

// 2. Derive shared secret with MXE
const sharedSecret = x25519.getSharedSecret(privateKey, mxePublicKey);

// 3. Encrypt using RescueCipher
const cipher = new RescueCipher(sharedSecret);
const ciphertext = cipher.encrypt([betAmount], nonce);

// 4. Submit to Solana (ciphertext + pubkey)
// MPC nodes can compute on this without decryption!
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ or **Bun** v1.0+
- **Rust** 1.75+ with Solana toolchain
- **Anchor** 0.30.1+
- **Arcium CLI** (for full integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/arcium-dark-prediction-market
cd arcium-dark-prediction-market

# Install dependencies
bun install
# or: npm install

# Build the Solana program
anchor build

# Run tests
bun test
# or: npm test
```

### Running the Demo

```bash
# Start local Solana validator
solana-test-validator

# In another terminal, run the demo
bun run app/index.ts
```

**Expected output:**
```
🚀 Dark Prediction Market - Arcium Integration Demo

============================================================
📊 Step 1: Create Prediction Market
------------------------------------------------------------
Market ID: 1
Question: Will Bitcoin reach $100k by end of October 2025?
✅ Market created

🔐 Step 2: Place Encrypted Bets
------------------------------------------------------------
Alice places bet:
  Bet amount: 5.0 SOL (encrypted)
  Prediction: YES (encrypted)
✅ Bet placed successfully!

[... continues with full flow ...]
```

## 📁 Project Structure

```
arcium-dark-prediction-market/
├── encrypted-ixs/              # Arcium encrypted instructions (MPC)
│   ├── place_bet.rs            # Place encrypted bet
│   ├── resolve_market.rs       # Resolve market via MPC
│   └── generate_randomness.rs  # Fair RNG using MPC
│
├── programs/
│   └── dark-prediction-market/
│       ├── src/
│       │   ├── lib.rs          # Program entry point
│       │   ├── state.rs        # Account structures
│       │   ├── errors.rs       # Error codes
│       │   └── instructions/   # Instruction handlers
│       │       ├── initialize_market.rs
│       │       ├── place_bet.rs
│       │       ├── resolve_market.rs
│       │       └── claim_winnings.rs
│       └── Cargo.toml
│
├── app/
│   ├── arcium-client.ts        # Encryption/decryption library
│   └── index.ts                # Main application & demo
│
├── tests/
│   └── dark-prediction-market.test.ts
│
├── Arcium.toml                 # Arcium configuration
├── Anchor.toml                 # Anchor configuration
└── package.json
```

## 🔬 Technical Deep Dive

### Multi-Party Computation (MPC)

Arcium uses **MPC** to enable computation on encrypted data:

1. **Secret Sharing**: Data is split into "shares" distributed across nodes
2. **Distributed Computation**: Each node processes its share
3. **Result Reconstruction**: Shares are combined to produce the final result
4. **Zero Knowledge**: No single node ever sees the plaintext

### Encrypted Instruction Example

```rust
// encrypted-ixs/place_bet.rs
#[encrypted]
mod circuits {
    use arcis_imports::*;

    #[instruction]
    pub fn place_encrypted_bet(
        input_ctxt: Enc<Shared, BetInput>
    ) -> Enc<Shared, BetReceipt> {
        let input = input_ctxt.to_arcis();
        
        // All operations happen on ENCRYPTED data
        let bet_id = input.market_id * 1000000u64 + input.user_nonce;
        
        let receipt = BetReceipt {
            bet_id,
            encrypted_amount: input.bet_amount,  // Still encrypted!
            encrypted_prediction: input.prediction,
            timestamp: 0u64,
        };
        
        input_ctxt.owner.from_arcis(receipt)  // Returns encrypted
    }
}
```

### Solana Program Integration

```rust
// Queue computation to Arcium network
pub fn place_bet(ctx: Context<PlaceBet>, ...) -> Result<()> {
    let args = vec![
        Argument::ArcisPubkey(pub_key),
        Argument::PlaintextU128(nonce),
        Argument::EncryptedU64(ciphertext_bet_amount),
        Argument::EncryptedU8(ciphertext_prediction),
    ];
    
    queue_computation(
        ctx.accounts,
        computation_offset,
        args,
        None,
        vec![PlaceBetCallback::callback_ix(&[])],
    )?;
    
    Ok(())
}
```

## 🎓 Learning Resources

### Arcium Documentation
- 📖 [Official Docs](https://docs.arcium.com)
- 📄 [Purple Paper](https://www.arcium.com/articles/arcium-purplepaper)
- 🔬 [Research Papers](https://www.arcium.com/research)

### Understanding MPC
- [Crypto's New Whitespace: MPC, FHE, TEE](https://equilibrium.co/writing/do-all-roads-lead-to-mpc)
- [Privacy 2.0 (with Helius)](https://www.helius.dev/blog/solana-privacy)

### Related Examples
- [Arcium Examples Repository](https://github.com/arcium-hq/examples)
- [Hello World Tutorial](https://docs.arcium.com/developers/hello-world)

## 🏆 Hackathon Submission

This project was built for the **Colosseum Cypherpunk Hackathon** Arcium track.

### Innovation

✨ **Novel application of encrypted compute** - First private prediction market on Solana using MPC  
🔐 **Complete privacy preservation** - Bet amounts and predictions hidden until resolution  
⚡ **Fair and transparent** - Payouts calculated trustlessly via distributed computation  

### Technical Implementation

- ✅ Full integration with Arcium SDK
- ✅ Encrypted instructions using Arcis framework
- ✅ Proper callback handling for MPC results
- ✅ Client-side encryption with x25519 + RescueCipher
- ✅ Comprehensive test coverage
- ✅ Production-ready architecture

### Impact

**Unlocks new use cases:**
- Dark pools for DeFi trading
- Private voting systems
- Confidential auctions
- Secret strategy games

**Privacy benefits:**
- Prevents front-running
- Eliminates market manipulation
- Protects user financial privacy
- Enables fair price discovery

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arcium Team** for the incredible encrypted compute infrastructure
- **Solana Foundation** for the fast, low-cost blockchain
- **Colosseum** for organizing the Cypherpunk Hackathon

## 📞 Contact

Built with ❤️ by Alenka Media

- GitHub: [Your GitHub Profile]
- Twitter: [@YourHandle]
- Discord: YourDiscord#1234

---

**🔒 Encrypt Everything. Privacy is a Right, Not a Privilege.**

Learn more about Arcium: [arcium.com](https://arcium.com)
