'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MarketCard, MarketCardSkeleton } from '@/components/market-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Market } from '@/lib/types'
import { Search, SlidersHorizontal, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { PublicKey } from '@solana/web3.js'

export default function ExplorePage() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'ended' | 'resolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for now - will be replaced with actual blockchain data
  useEffect(() => {
    const loadMarkets = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockMarkets: Market[] = [
        {
          publicKey: new PublicKey('11111111111111111111111111111111'),
          marketId: BigInt(1),
          question: 'Will Bitcoin reach $100k by end of October 2025?',
          creator: new PublicKey('11111111111111111111111111111111'),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          totalBets: 24,
          resolved: false,
          winningSide: null,
          category: 'Crypto',
          description: 'Bitcoin price prediction based on end-of-month closing price'
        },
        {
          publicKey: new PublicKey('22222222222222222222222222222222'),
          marketId: BigInt(2),
          question: 'Will Solana TVL surpass $5B this quarter?',
          creator: new PublicKey('22222222222222222222222222222222'),
          endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          totalBets: 18,
          resolved: false,
          winningSide: null,
          category: 'Crypto'
        },
        {
          publicKey: new PublicKey('33333333333333333333333333333333'),
          marketId: BigInt(3),
          question: 'Will the next US Fed rate be above 5%?',
          creator: new PublicKey('33333333333333333333333333333333'),
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          totalBets: 42,
          resolved: true,
          winningSide: 0,
          category: 'Politics'
        },
        {
          publicKey: new PublicKey('44444444444444444444444444444444'),
          marketId: BigInt(4),
          question: 'Will ETH merge to PoS be successful?',
          creator: new PublicKey('44444444444444444444444444444444'),
          endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          totalBets: 67,
          resolved: false,
          winningSide: null,
          category: 'Crypto',
          description: 'Ethereum merge to Proof of Stake without major issues'
        },
        {
          publicKey: new PublicKey('55555555555555555555555555555555'),
          marketId: BigInt(5),
          question: 'Will AI generate 50% of code by 2026?',
          creator: new PublicKey('55555555555555555555555555555555'),
          endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          totalBets: 31,
          resolved: false,
          winningSide: null,
          category: 'Technology'
        },
        {
          publicKey: new PublicKey('66666666666666666666666666666666'),
          marketId: BigInt(6),
          question: 'Will Apple release AR glasses in 2025?',
          creator: new PublicKey('66666666666666666666666666666666'),
          endTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          totalBets: 15,
          resolved: false,
          winningSide: null,
          category: 'Technology'
        },
      ]
      
      setMarkets(mockMarkets)
      setLoading(false)
    }
    
    loadMarkets()
  }, [])

  const filteredMarkets = markets.filter(market => {
    // Apply status filter
    if (filter === 'active' && (market.resolved || new Date() > market.endTime)) return false
    if (filter === 'ended' && (market.resolved || new Date() < market.endTime)) return false
    if (filter === 'resolved' && !market.resolved) return false
    
    // Apply search filter
    if (searchQuery && !market.question.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Explore Markets</h1>
            <p className="text-lg text-muted-foreground">
              Browse and bet on privacy-preserving prediction markets
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search markets..."
                  className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All Markets
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                >
                  <TrendingUp className="mr-1 h-4 w-4" />
                  Active
                </Button>
                <Button
                  variant={filter === 'ended' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('ended')}
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Ended
                </Button>
                <Button
                  variant={filter === 'resolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('resolved')}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Resolved
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredMarkets.length} {filteredMarkets.length === 1 ? 'market' : 'markets'}
            </div>
          </div>

          {/* Markets Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MarketCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredMarkets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMarkets.map((market) => (
                <MarketCard key={market.marketId.toString()} market={market} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No markets found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={() => {
                  setFilter('all')
                  setSearchQuery('')
                }}>
                  Clear Filters
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

