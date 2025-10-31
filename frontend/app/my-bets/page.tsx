'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWallet } from '@solana/wallet-adapter-react'
import { TrendingUp, TrendingDown, Lock, Trophy, Clock, Wallet } from 'lucide-react'
import Link from 'next/link'
import { formatSol } from '@/lib/utils'

interface UserBet {
  betId: bigint
  marketId: bigint
  marketQuestion: string
  side: 'YES' | 'NO'
  amount: number // SOL
  timestamp: Date
  marketEndTime: Date
  resolved: boolean
  won: boolean | null
  payout: number | null
  claimed: boolean
}

export default function MyBetsPage() {
  const { connected, publicKey } = useWallet()
  const [bets, setBets] = useState<UserBet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'won' | 'lost'>('all')

  useEffect(() => {
    if (!connected || !publicKey) {
      setLoading(false)
      return
    }

    const loadBets = async () => {
      setLoading(true)
      
      // Simulate loading user's bets
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock bets data
      const mockBets: UserBet[] = [
        {
          betId: BigInt(1),
          marketId: BigInt(1),
          marketQuestion: 'Will Bitcoin reach $100k by end of October 2025?',
          side: 'YES',
          amount: 5.0,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          marketEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          resolved: false,
          won: null,
          payout: null,
          claimed: false
        },
        {
          betId: BigInt(2),
          marketId: BigInt(3),
          marketQuestion: 'Will the next US Fed rate be above 5%?',
          side: 'NO',
          amount: 3.5,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          marketEndTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          resolved: true,
          won: true,
          payout: 5.02,
          claimed: false
        },
        {
          betId: BigInt(3),
          marketId: BigInt(2),
          marketQuestion: 'Will Solana TVL surpass $5B this quarter?',
          side: 'YES',
          amount: 2.0,
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          marketEndTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          resolved: false,
          won: null,
          payout: null,
          claimed: false
        }
      ]
      
      setBets(mockBets)
      setLoading(false)
    }
    
    loadBets()
  }, [connected, publicKey])

  const handleClaimWinnings = async (betId: bigint) => {
    console.log('Claiming winnings for bet:', betId.toString())
    // Here we would call the claim_winnings instruction
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update the bet as claimed
    setBets(bets.map(bet => 
      bet.betId === betId ? { ...bet, claimed: true } : bet
    ))
  }

  const filteredBets = bets.filter(bet => {
    if (filter === 'active') return !bet.resolved
    if (filter === 'won') return bet.won === true
    if (filter === 'lost') return bet.won === false
    return true
  })

  const totalBets = bets.length
  const activeBets = bets.filter(b => !b.resolved).length
  const wonBets = bets.filter(b => b.won === true).length
  const totalWinnings = bets.filter(b => b.won && !b.claimed).reduce((sum, b) => sum + (b.payout || 0), 0)

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container max-w-5xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to view your bets and winnings
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-5xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Bets</h1>
            <p className="text-lg text-muted-foreground">
              Track your encrypted bets and claim your winnings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{totalBets}</div>
                <div className="text-sm text-muted-foreground">Total Bets</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-500">{activeBets}</div>
                <div className="text-sm text-muted-foreground">Active Bets</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-500">{wonBets}</div>
                <div className="text-sm text-muted-foreground">Bets Won</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold gradient-text">
                  {totalWinnings.toFixed(2)} SOL
                </div>
                <div className="text-sm text-muted-foreground">To Claim</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Bets
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              <Clock className="mr-1 h-4 w-4" />
              Active
            </Button>
            <Button
              variant={filter === 'won' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('won')}
            >
              <Trophy className="mr-1 h-4 w-4" />
              Won
            </Button>
            <Button
              variant={filter === 'lost' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('lost')}
            >
              Lost
            </Button>
          </div>

          {/* Bets List */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBets.length > 0 ? (
            <div className="space-y-4">
              {filteredBets.map((bet) => (
                <Card key={bet.betId.toString()} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {!bet.resolved ? (
                            <Badge variant="outline">Active</Badge>
                          ) : bet.won ? (
                            <Badge variant="success">Won</Badge>
                          ) : (
                            <Badge variant="destructive">Lost</Badge>
                          )}
                          {bet.won && !bet.claimed && (
                            <Badge className="bg-yellow-500">Claimable</Badge>
                          )}
                        </div>
                        
                        <Link 
                          href={`/market/${bet.marketId}`}
                          className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                        >
                          {bet.marketQuestion}
                        </Link>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {bet.side === 'YES' ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span>Bet on {bet.side}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Lock className="h-4 w-4" />
                            <span>{bet.amount} SOL (encrypted)</span>
                          </div>
                          
                          <span className="text-xs">
                            {bet.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {bet.won && !bet.claimed && bet.payout && (
                          <div className="text-right mr-4">
                            <div className="text-2xl font-bold text-green-500">
                              +{bet.payout.toFixed(2)} SOL
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((bet.payout / bet.amount - 1) * 100).toFixed(1)}% profit
                            </div>
                          </div>
                        )}
                        
                        {bet.won && !bet.claimed ? (
                          <Button
                            onClick={() => handleClaimWinnings(bet.betId)}
                            className="shrink-0"
                          >
                            <Trophy className="mr-2 h-4 w-4" />
                            Claim
                          </Button>
                        ) : bet.claimed ? (
                          <Badge variant="secondary">Claimed</Badge>
                        ) : (
                          <Button variant="outline" asChild className="shrink-0">
                            <Link href={`/market/${bet.marketId}`}>
                              View Market
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bets found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filter === 'all' 
                    ? 'You haven\'t placed any bets yet'
                    : 'No bets match this filter'
                  }
                </p>
                <Button asChild>
                  <Link href="/explore">Explore Markets</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

