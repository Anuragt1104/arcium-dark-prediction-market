'use client'

import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Shield, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  const { connected } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden font-bold gradient-text sm:inline-block">
              Dark Prediction Market
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/explore"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Create Market
            </Link>
            {connected && (
              <Link
                href="/my-bets"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                My Bets
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-white !rounded-md !h-10 !px-4" />
          </nav>
        </div>
      </div>
    </header>
  )
}

