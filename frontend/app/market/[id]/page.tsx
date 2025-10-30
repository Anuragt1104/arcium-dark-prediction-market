'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BetDialog } from '@/components/bet-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Market } from '@/lib/types'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Calendar, Clock, Users, Lock, TrendingUp, User, CheckCircle2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { truncateAddress } from '@/lib/utils'

export default function MarketDetailPage() {
  const params = useParams()
  const { publicKey } = useWallet()
  const [market, setMarket] = useState<Market | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMarket = async () => {
      setLoading(true)
      
      // Simulate loading from blockchain
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock market data
      const mockMarket: Market = {
        publicKey: new PublicKey('11111111111111111111111111111111'),
        marketId: BigInt(params.id as string),
        question: 'Will Bitcoin reach $100k by end of October 2025?',
        creator: new PublicKey('11111111111111111111111111111111'),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalBets: 24,
        resolved: false,
        winningSide: null,
        category: 'Crypto',
        description: 'This market will resolve to YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange (Binance, Coinbase, Kraken) before the end of October 2025. The closing price on October 31, 2025 at 23:59 UTC will be used for final resolution if the threshold hasn\'t been reached earlier.'
      }
      
      setMarket(mockMarket)
      setLoading(false)
    }
    
    loadMarket()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-5xl">
            <div className="space-y-6 animate-pulse">
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!market) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-5xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">Market Not Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This market doesn't exist or hasn't been created yet.
                </p>
                <Button asChild>
                  <a href="/explore">Browse Markets</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isActive = !market.resolved && new Date() < market.endTime
  const isCreator = publicKey && market.creator.equals(publicKey)
  const hasEnded = new Date() >= market.endTime && !market.resolved

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-5xl space-y-8">
          {/* Market Header */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : market.resolved ? (
                    <Badge variant="secondary">Resolved</Badge>
                  ) : (
                    <Badge variant="outline">Ended</Badge>
                  )}
                  {market.category && (
                    <Badge variant="outline">{market.category}</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {market.question}
                </h1>
                {market.description && (
                  <p className="text-muted-foreground text-lg">
                    {market.description}
                  </p>
                )}
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{market.totalBets}</div>
                      <div className="text-sm text-muted-foreground">Total Bets</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">Encrypted</div>
                      <div className="text-sm text-muted-foreground">Pool Amount</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-base font-bold">
                        {isActive 
                          ? formatDistanceToNow(market.endTime, { addSuffix: true })
                          : market.resolved
                          ? 'Resolved'
                          : 'Ended'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isActive ? 'Ends' : 'Status'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Betting Card */}
              {isActive && (
                <Card>
                  <CardHeader>
                    <CardTitle>Place Your Bet</CardTitle>
                    <CardDescription>
                      Your bet will be encrypted using Arcium's MPC technology
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BetDialog 
                      marketId={market.marketId}
                      marketQuestion={market.question}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Resolution for Creator */}
              {hasEnded && isCreator && (
                <Card className="border-yellow-500/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                      Ready to Resolve
                    </CardTitle>
                    <CardDescription>
                      The market has ended. You can now resolve it with the actual outcome.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Button className="flex-1" variant="outline">
                        Resolve as YES
                      </Button>
                      <Button className="flex-1" variant="outline">
                        Resolve as NO
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Market Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Creator</span>
                    </div>
                    <span className="font-mono text-sm">{truncateAddress(market.creator.toBase58())}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">End Date</span>
                    </div>
                    <span className="text-sm">{market.endTime.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Privacy</span>
                    </div>
                    <Badge variant="success">Fully Encrypted</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Privacy Info */}
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-primary" />
                    Privacy Guarantee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Encrypted Bets</div>
                      <div className="text-muted-foreground text-xs">
                        All bet amounts encrypted with Arcium MPC
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Hidden Positions</div>
                      <div className="text-muted-foreground text-xs">
                        Your prediction stays private until resolution
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Fair Resolution</div>
                      <div className="text-muted-foreground text-xs">
                        MPC computes payouts without revealing bets
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity (placeholder) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-muted-foreground">
                        Encrypted bet placed {i + 1}h ago
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
    </svg>
  )
}

