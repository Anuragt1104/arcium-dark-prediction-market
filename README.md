# Dark Prediction Market

**A privacy-first prediction market on Solana powered by Arcium's encrypted compute**

Built for the Arcium \<encrypted\> Side Track at Colosseum's Cypherpunk Hackathon

---

## The Problem

Traditional prediction markets on public blockchains have a fundamental flaw: everything is visible. When you place a bet, everyone can see your position, amount, and timing. This creates several serious issues:

- **Front-running**: Bots can see large bets in the mempool and race to position themselves first
- **Market manipulation**: Whales can manipulate sentiment by revealing large positions
- **Privacy invasion**: Your financial decisions and beliefs become public record
- **Strategic disadvantage**: Sophisticated traders can exploit visible order books

On Solana, transactions are blazingly fast, but they're also completely transparent. Every bet, every amount, every prediction is public the moment it hits the chain.

## The Solution

Dark Prediction Market uses **Arcium's encrypted compute** to bring true privacy to prediction markets. When you place a bet:

1. Your bet amount is encrypted before leaving your wallet
2. Your prediction (YES or NO) is encrypted
3. The encrypted data is processed by Arcium's MPC (Multi-Party Computation) network
4. No single node can see your actual bet or prediction
5. Results are calculated in encrypted space
6. Only the final resolution reveals the outcome

Think of it as a dark pool for prediction markets. All the fairness of blockchain settlement, with the privacy of traditional finance.

## Why This Matters

This isn't just about hiding numbers. Privacy enables entirely new use cases:

- **Professional traders** can enter large positions without moving the market
- **Institutional participants** can maintain confidential strategies
- **Regular users** can bet without fear of their decisions being used against them
- **Market integrity** is preserved through prevention of front-running and manipulation

With Arcium, we're not just building a better prediction market. We're building a prediction market that couldn't exist before on a public blockchain.

## Key Features

### Privacy-First Design
- Encrypted bet amounts until market resolution
- Hidden predictions prevent manipulation
- Front-running protection built into the protocol
- MPC ensures no single party can decrypt user data

### Fair and Transparent Resolution
- Markets resolve using encrypted computation
- Payout ratios calculated without revealing individual bets
- Winners claim proportional shares from the total pool
- All logic is verifiable on-chain

### Provably Fair Randomness
- MPC-generated randomness for special cases
- No single entity can predict or manipulate outcomes
- Useful for tiebreakers or random market selection

### Solana Speed, Arcium Privacy
- Fast transaction finality
- Low fees
- Encrypted compute at Solana scale
- Best of both worlds

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Rust and Cargo
- Solana CLI tools
- Anchor Framework 0.30.1
- Arcium CLI (for encrypted instructions)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd arcium-dark-prediction-market

# Install dependencies
npm install

# Build the Solana program
anchor build

# Run tests
anchor test
```

### Running the Demo

```bash
# Run the interactive demo
npm start

# This will:
# 1. Create a sample prediction market
# 2. Place several encrypted bets
# 3. Resolve the market using MPC
# 4. Calculate and claim winnings
```

### Local Development

```bash
# Start local validator
solana-localnet

# Deploy program (separate terminal)
anchor deploy

# Start frontend (optional)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the web interface.

## Project Structure

```
arcium-dark-prediction-market/
├── programs/
│   └── dark-prediction-market/
│       ├── src/
│       │   ├── lib.rs                    # Program entry point
│       │   ├── state.rs                  # Account structures
│       │   ├── errors.rs                 # Custom errors
│       │   └── instructions/
│       │       ├── initialize_market.rs  # Create new markets
│       │       ├── place_bet.rs          # Queue encrypted bets
│       │       ├── resolve_market.rs     # Resolve with MPC
│       │       └── claim_winnings.rs     # Claim payouts
│       └── Cargo.toml
│
├── encrypted-ixs/                        # Arcium encrypted instructions
│   ├── place_bet.rs                      # MPC bet processing
│   ├── resolve_market.rs                 # MPC resolution logic
│   └── generate_randomness.rs            # MPC random generation
│
├── app/
│   ├── index.ts                          # Demo application
│   └── arcium-client.ts                  # Arcium integration
│
├── frontend/                             # Web interface (Next.js)
│   ├── app/                              # Pages and routes
│   ├── components/                       # React components
│   └── lib/                              # Utils and types
│
├── tests/
│   └── dark-prediction-market.test.ts    # Integration tests
│
├── Anchor.toml                           # Anchor configuration
├── Arcium.toml                           # Arcium configuration
└── package.json
```

## How It Works

### Market Creation

Anyone can create a prediction market with a question and end time. Markets are stored on-chain in standard Solana accounts.

### Placing Bets (The Private Part)

When a user wants to bet:

1. **Client-side encryption**: The bet amount and prediction are encrypted using the Arcium SDK
2. **On-chain queuing**: The Solana program receives encrypted ciphertext (it can't read the values)
3. **MPC processing**: The encrypted instruction `place_bet.rs` runs across Arcium's node network
4. **Encrypted receipt**: A bet receipt is created and stored, still encrypted
5. **No reveal**: The bet details remain hidden until market resolution

### Market Resolution

When the market ends and the outcome is known:

1. The resolver submits the actual outcome
2. The `resolve_market.rs` encrypted instruction runs in MPC
3. All bets are aggregated in encrypted space
4. Winning pool and payout ratios are calculated
5. Only the final resolution data is revealed (not individual bets)

### Claiming Winnings

Winners can claim their payouts:

1. The program verifies they won based on the resolution
2. Payouts are proportional to bet size and total pools
3. Claims are processed atomically on-chain

For detailed architectural diagrams and flows, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Architecture & Documentation

This project includes comprehensive documentation:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, data flows, and account structures
- **[ARCIUM_INTEGRATION.md](./ARCIUM_INTEGRATION.md)** - Deep dive into encrypted compute integration
- **[CODE_GUIDE.md](./CODE_GUIDE.md)** - Detailed code walkthrough and implementation guide

## Testing

```bash
# Run all tests
anchor test

# Run specific test file
anchor test tests/dark-prediction-market.test.ts

# Run with logs
anchor test -- --nocapture
```

### Test Coverage

- Market creation and initialization
- Encrypted bet placement
- Multiple bets on same market
- Market resolution with MPC
- Winnings calculation and claims
- Error cases and edge conditions

## Technology Stack

### Blockchain Layer
- **Solana**: High-performance blockchain for fast, low-cost transactions
- **Anchor Framework**: Smart contract development framework
- **Rust**: Systems programming language for on-chain programs

### Privacy Layer
- **Arcium**: Encrypted compute platform using MPC
- **MPC (Multi-Party Computation)**: Cryptographic protocol for private computation
- **Encrypted Instructions**: Rust code that runs in encrypted space

### Client Layer
- **TypeScript/JavaScript**: Client application and demo
- **@arcium-hq/client**: SDK for Arcium integration
- **@solana/web3.js**: Solana JavaScript API
- **Next.js**: Modern React framework for the frontend

## Arcium Integration Highlights

This project demonstrates several key Arcium capabilities:

1. **Encrypted Data Processing**: Bet amounts and predictions processed without decryption
2. **MPC Computation**: Resolution logic runs across multiple nodes with no single point of data exposure
3. **Callback Pattern**: Asynchronous encrypted computation with on-chain callbacks
4. **Fair Randomness**: MPC-generated random numbers for unbiased outcomes
5. **Privacy Guarantees**: Mathematical proof that individual bets remain hidden

For a detailed explanation of how we integrate Arcium, see [ARCIUM_INTEGRATION.md](./ARCIUM_INTEGRATION.md).

## Real-World Applications

This dark prediction market architecture can be adapted for:

- **Sports Betting**: Private bets on sports outcomes
- **Political Predictions**: Confidential political forecasting
- **Financial Markets**: Private derivatives and options
- **Insurance**: Parametric insurance with private risk pools
- **Governance**: Anonymous voting with verifiable results
- **Research**: Confidential surveys and expert predictions

## Demo Video

[Coming soon]

## Deployed Addresses

### Devnet
- Program ID: `5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ`
- Frontend: [Coming soon]

### Testnet
- Program ID: `5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ`

## Security Considerations

### What's Private
- Individual bet amounts (encrypted until resolution)
- User predictions (encrypted until resolution)
- Bet timing details (masked via MPC processing)

### What's Public
- Market questions and end times
- Total number of bets (not amounts)
- Final market resolution results
- Payout ratios (not individual winnings)

### Trust Model
- No single Arcium node can decrypt user data
- Majority of nodes must collude to break privacy
- On-chain state is verifiable by anyone
- Smart contract logic is open source

## Limitations & Future Work

### Current Limitations
- Demo includes mock encrypted instructions (full MPC deployment requires Arcium mainnet)
- Frontend is a basic interface (can be enhanced with more features)
- Single bet per user per market (can be extended to multiple positions)

### Future Enhancements
- Order book style matching (encrypted limit orders)
- AMM-style pricing for continuous betting
- Multi-outcome markets (not just YES/NO)
- Time-weighted betting with dynamic odds
- Cross-market correlation analysis
- Mobile app for easier access

## Resources

### Arcium
- [Arcium Website](https://www.arcium.com)
- [Arcium Documentation](https://docs.arcium.com)
- [Arcium Testnet](https://www.arcium.com/testnet)
- [Arcium GitHub](https://github.com/arcium-hq)

### Solana
- [Solana Documentation](https://docs.solana.com)
- [Anchor Framework](https://www.anchor-lang.com)
- [Solana Cookbook](https://solanacookbook.com)

### This Project
- [Architecture Guide](./ARCHITECTURE.md)
- [Arcium Integration Deep Dive](./ARCIUM_INTEGRATION.md)
- [Code Walkthrough](./CODE_GUIDE.md)

## Contributing

This is a hackathon project, but feedback and suggestions are welcome! Feel free to:

- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share ideas for additional use cases

## License

MIT License - see [LICENSE](./LICENSE) for details

## Acknowledgments

Built with support from:
- **Arcium** for encrypted compute infrastructure
- **Solana** for the high-performance blockchain
- **Colosseum** for organizing the Cypherpunk Hackathon
- The broader Solana and crypto privacy community

## Contact

For questions about this submission:
- GitHub: [Repository issues](issues)
- Email: [Your contact for hackathon]

---

**Built for Arcium \<encrypted\> Side Track**

*Making prediction markets private, fair, and manipulation-resistant through encrypted compute on Solana.*

