# 🔒 Dark Prediction Market

**Privacy-Preserving Prediction Markets using Arcium Encrypted Compute on Solana**

[![Solana](https://img.shields.io/badge/Solana-14F195?style=flat&logo=solana&logoColor=white)](https://solana.com)
[![Arcium](https://img.shields.io/badge/Arcium-MPC-purple)](https://arcium.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **⚡ Quick Start:** `cd frontend && npm run dev` → http://localhost:3000

## 🎯 Overview

Dark Prediction Market is a privacy-first prediction market platform built on Solana that leverages **Arcium's Multi-Party Computation (MPC)** network to keep bet amounts and predictions completely encrypted until market resolution. This prevents front-running, market manipulation, and provides true privacy for participants.

### The Problem

Traditional on-chain prediction markets suffer from:
- 💔 **Transparency Paradox**: All bets are visible, enabling manipulation
- 🎯 **Front-Running**: Large bets influence market before execution
- 📊 **Market Manipulation**: Observing bets allows strategic exploitation
- 🔓 **Privacy Loss**: Everyone can see your positions and amounts

### Our Solution

Using Arcium's encrypted supercomputer:
- 🔐 **Encrypted Bets**: Amounts and predictions stay secret
- ⚡ **MPC Resolution**: Fair payout calculation without decryption
- 🛡️ **Zero Trust**: No single party can see or manipulate data
- 🚀 **Solana Speed**: Fast, low-cost transactions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Application                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Arcium Client Library (@arcium-hq/client)           │  │
│  │  - Encrypts bet data using x25519 + RescueCipher     │  │
│  │  - Derives shared secrets with MXE                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Encrypted Data
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Solana Program (Anchor)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Instructions:                                        │  │
│  │  • initialize_market()                                │  │
│  │  • place_bet() → Queue computation                    │  │
│  │  • place_bet_callback() ← MPC result                  │  │
│  │  • resolve_market() → Queue computation               │  │
│  │  • resolve_market_callback() ← MPC result             │  │
│  │  • claim_winnings()                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ CPI to Arcium Program
                      ▼
┌─────────────────────────────────────────────────────────────┐
│            Arcium MPC Network (Arx Nodes)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Arx Node 1 │  │  Arx Node 2 │  │  Arx Node N │        │
│  │  (secret    │  │  (secret    │  │  (secret    │        │
│  │   share 1)  │  │   share 2)  │  │   share N)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
│  Encrypted Instructions:                                    │
│  • place_encrypted_bet() - Process bet in MPC               │
│  • resolve_encrypted_market() - Calculate payouts           │
│  • calculate_payout() - Individual winnings                 │
│  • generate_random() - Fair randomness                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 How Arcium Integration Works

### 1. **Encrypted Bet Placement**

```typescript
// Client-side: Encrypt bet data
const arciumClient = new ArciumClient(mxePublicKey);
const encrypted = await arciumClient.encryptBet({
  marketId: 1n,
  betAmount: 5_000_000_000n, // 5 SOL
  prediction: 1, // YES
  userNonce: Date.now()
});

// Submit encrypted data to Solana program
await program.methods.placeBet(
  computationOffset,
  encrypted.ciphertext_bet_amount,  // ← Encrypted!
  encrypted.ciphertext_prediction,  // ← Encrypted!
  encrypted.pub_key,
  encrypted.nonce
).rpc();
```

**What happens:**
1. Data encrypted using x25519 ECDH + RescueCipher
2. Solana program queues computation to Arcium
3. MPC nodes process encrypted data (no node sees plaintext)
4. Result stored on-chain, still encrypted

### 2. **MPC Computation** (`encrypted-ixs/place_bet.rs`)

```rust
#[encrypted]
mod circuits {
    #[instruction]
    pub fn place_encrypted_bet(
        input_ctxt: Enc<Shared, BetInput>
    ) -> Enc<Shared, BetReceipt> {
        let input = input_ctxt.to_arcis();
        
        // All operations on ENCRYPTED data!
        let bet_id = input.market_id * 1000000u64 + input.user_nonce;
        
        let receipt = BetReceipt {
            bet_id,
            encrypted_amount: input.bet_amount,      // Still encrypted
            encrypted_prediction: input.prediction,  // Still encrypted
            timestamp: 0u64,
        };
        
        input_ctxt.owner.from_arcis(receipt)
    }
}
```

**Key Features:**
- `Enc<Shared, T>` = Data encrypted with shared secret
- Operations happen on ciphertext (MPC magic!)
- No single Arx node ever sees plaintext

### 3. **Market Resolution with Privacy**

```rust
#[instruction]
pub fn resolve_encrypted_market(
    state_ctxt: Enc<Shared, MarketState>
) -> Enc<Shared, ResolutionResult> {
    let state = state_ctxt.to_arcis();
    
    // Calculate on encrypted data
    let total_pool = state.total_yes_bets + state.total_no_bets;
    let winning_pool = if state.actual_outcome == 1u8 {
        state.total_yes_bets
    } else {
        state.total_no_bets
    };
    
    let payout_ratio = (total_pool * 1000000u64) / winning_pool;
    
    // Return result (revealed to all)
    ResolutionResult { ... }
}
```

**Privacy Properties:**
- Individual bets remain encrypted
- Only aggregated totals revealed
- Payout ratios calculated without exposing individual amounts

## 📁 Project Structure

```
arcium-dark-prediction-market/
├── programs/
│   └── dark-prediction-market/
│       ├── src/
│       │   ├── lib.rs                    # Main program entry
│       │   ├── state.rs                  # Market, Bet, Resolution accounts
│       │   ├── errors.rs                 # Custom error types
│       │   └── instructions/
│       │       ├── initialize_market.rs  # Create new market
│       │       ├── place_bet.rs         # Queue encrypted bet
│       │       ├── resolve_market.rs    # Resolve with MPC
│       │       └── claim_winnings.rs    # Claim payouts
│       └── Cargo.toml
├── encrypted-ixs/                        # Arcium MPC circuits
│   ├── place_bet.rs                     # Encrypted bet processing
│   ├── resolve_market.rs                # Encrypted resolution logic
│   └── generate_randomness.rs           # MPC-based RNG
├── app/
│   ├── arcium-client.ts                 # Encryption/decryption library
│   └── index.ts                         # Demo application
├── tests/
│   └── dark-prediction-market.test.ts   # Integration tests
├── Arcium.toml                          # Arcium configuration
├── Anchor.toml                          # Anchor configuration
├── package.json                         # Dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or Bun
- **Solana Wallet** (Phantom, Solflare, etc.)
- (Optional) Rust 1.75+ and Solana CLI for program development

### Quick Start - Frontend Only

```bash
# Clone the repository
git clone https://github.com/Anuragt1104/arcium-dark-prediction-market
cd arcium-dark-prediction-market

# Install and run frontend
cd frontend
npm install
npm run dev

# Open http://localhost:3000
```

### Full Development Setup

```bash
# 1. Install all dependencies
npm install
cd frontend && npm install && cd ..

# 2. Build Solana program (optional - for development)
anchor build

# 3. Run tests
npm test

# 4. Start frontend
cd frontend
npm run dev
```

### Running the CLI Demo

```bash
# Original CLI demo (without frontend)
npm run start
```

Expected output:
```
🚀 Dark Prediction Market - Arcium Integration Demo
============================================================
Wallet: 8xZy...

📊 Step 1: Create Prediction Market
------------------------------------------------------------
📊 Creating prediction market...
  Market ID: 1
  Question: Will Bitcoin reach $100k by end of October 2025?
  Ends at: 2025-10-18T12:00:00.000Z
✅ Market created: 5Hx9...

🔐 Step 2: Place Encrypted Bets
------------------------------------------------------------
Alice places bet:
🔐 Encrypting bet data...
  Bet amount: 5 SOL (encrypted)
  Prediction: YES (encrypted)
📤 Submitting encrypted bet to Arcium network...
✅ Bet placed successfully!
   Your bet is now being processed by Arcium MPC nodes
   No one can see your bet amount or prediction until market resolves
...
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Test specific file
bun test tests/dark-prediction-market.test.ts
```

## 🔒 Privacy Features

### What Stays Private

✅ **Individual bet amounts** - Encrypted until resolution  
✅ **Prediction choices** - Hidden from other participants  
✅ **User positions** - No one knows who bet on what  
✅ **Bet timing** - Timestamps encrypted (optional)  

### What Gets Revealed

📊 **Market outcome** - YES or NO after resolution  
📊 **Total pool size** - Aggregate amount across all bets  
📊 **Payout ratios** - Winners' multiplier  
📊 **Winner status** - Who won (but not amounts until claimed)  

## 🎓 How Arcium MPC Works

### Multi-Party Computation in Action

1. **Secret Sharing**
   ```
   Original: bet_amount = 5 SOL
   ↓
   Split into shares:
   Node 1: share_1 = 0x4a3f...
   Node 2: share_2 = 0x7b2e...
   Node 3: share_3 = 0x9c1d...
   
   ✨ No single node knows the original value!
   ```

2. **Encrypted Operations**
   ```rust
   // This runs on CIPHERTEXT!
   let total = encrypted_bet_1 + encrypted_bet_2 + encrypted_bet_3;
   
   // Result is still encrypted, but mathematically correct
   ```

3. **Selective Revelation**
   ```rust
   // Only reveal what's needed
   payout_ratio.reveal()  // ← Revealed to all
   
   // Keep secrets secret
   individual_bet_amount  // ← Stays encrypted
   ```

## 🌟 Use Cases

This architecture enables:

- **🏦 Private Trading**: Dark pools without centralized custody
- **🎲 Hidden Information Games**: Poker, strategy games
- **🗳️ Confidential Voting**: Weighted votes without revealing amounts
- **💰 Anonymous Auctions**: Sealed bid auctions on-chain
- **📊 Opinion Markets**: Private polls with skin in the game

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Solana Configuration
RPC_ENDPOINT=https://api.devnet.solana.com
PROGRAM_ID=5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ

# Arcium Configuration
ARCIUM_CLUSTER=testnet
MXE_PUBLIC_KEY=<your-mxe-public-key>

# Wallet
WALLET_PATH=~/.config/solana/id.json
```

### Arcium.toml

```toml
[toolchain]
arcium_version = "0.1.0"

[programs.testnet]
dark_prediction_market = "5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ"

[provider]
cluster = "Testnet"
wallet = "~/.config/solana/id.json"
```

## 📚 Learn More

### Arcium Resources
- 📖 [Arcium Documentation](https://docs.arcium.com)
- 🎨 [Purple Paper](https://www.arcium.com/articles/arcium-purplepaper)
- 🧑‍💻 [Developer Portal](https://www.arcium.com/testnet)
- 📝 [Blog: Privacy 2.0](https://www.helius.dev/blog/solana-privacy)

### MPC & Cryptography
- 📘 [What is MPC?](https://equilibrium.co/writing/do-all-roads-lead-to-mpc)
- 🔐 [MPC vs FHE vs TEE](https://www.arcium.com/articles/arciums-architecture)
- 🎓 [Research Papers](https://www.arcium.com/research)

### Solana & Anchor
- ⚡ [Solana Documentation](https://docs.solana.com)
- ⚓ [Anchor Framework](https://www.anchor-lang.com)

## 🏆 Hackathon Submission

**For the Arcium + Colosseum Cypherpunk Hackathon**

### Innovation
- First privacy-preserving prediction market using MPC on Solana
- Novel use of encrypted compute for fair market resolution
- Demonstrates Arcium's capability for DeFi privacy

### Technical Implementation
- ✅ Full Arcium MPC integration with encrypted instructions
- ✅ Solana program with computation queueing and callbacks
- ✅ TypeScript client library for encryption
- ✅ Complete market lifecycle (create → bet → resolve → claim)

### Impact
- Enables private prediction markets without centralized operators
- Prevents market manipulation through transparency
- Opens door for privacy-sensitive institutions to participate
- Template for other privacy-requiring DeFi applications

### Clarity
- Comprehensive documentation
- Annotated code with clear privacy guarantees
- Demo application showing complete flow
- Architecture diagrams and explanations

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **Arcium Team** - For building the encrypted supercomputer
- **Solana Foundation** - For the high-performance blockchain
- **Anchor** - For the amazing Solana framework
- **Colosseum** - For hosting the hackathon

## 📞 Contact

- **GitHub**: [@YourUsername](https://github.com/yourusername)
- **Twitter**: [@YourHandle](https://twitter.com/yourhandle)
- **Discord**: Join the [Arcium Discord](https://discord.com/invite/arcium)

---

**Built with 🔐 by [Alenka Media](https://github.com/alenkamedia) for the Arcium Cypherpunk Hackathon**

*"Privacy isn't about having something to hide. It's about having something to protect."*
