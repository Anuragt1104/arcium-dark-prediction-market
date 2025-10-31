# Dark Prediction Market - Frontend

A beautiful, privacy-first prediction market interface built with Next.js 14, powered by Arcium's encrypted compute on Solana.

## Features

- 🔐 **Encrypted Betting** - All bets encrypted using Arcium MPC
- ⚡ **Solana Integration** - Fast, low-cost transactions
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- 👛 **Wallet Support** - Phantom, Solflare, Backpack, and more
- 📊 **Real-time Updates** - Live market data and statistics
- 🎯 **Privacy-First** - No front-running, no manipulation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Solana wallet (Phantom recommended)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── explore/           # Browse markets
│   ├── create/            # Create market
│   ├── market/[id]/       # Market details
│   └── my-bets/           # User's bets
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Footer
│   ├── market-card.tsx   # Market card component
│   └── bet-dialog.tsx    # Betting modal
└── lib/                   # Utilities
    ├── wallet.tsx         # Solana wallet provider
    ├── constants.ts       # App constants
    ├── types.ts           # TypeScript types
    └── utils.ts           # Helper functions
```

## Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Blockchain**: Solana Web3.js, Anchor
- **Wallet**: Solana Wallet Adapter
- **Privacy**: Arcium MPC

## Learn More

- [Arcium Documentation](https://docs.arcium.com)
- [Solana Documentation](https://docs.solana.com)
- [Next.js Documentation](https://nextjs.org/docs)
