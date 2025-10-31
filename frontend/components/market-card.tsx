'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Market } from '@/lib/types'
import { formatSol, truncateAddress } from '@/lib/utils'
import { Clock, TrendingUp, Users, Lock } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const isActive = !market.resolved && new Date() < market.endTime
  const timeText = isActive 
    ? `Ends ${formatDistanceToNow(market.endTime, { addSuffix: true })}`
    : market.resolved 
    ? 'Resolved'
    : 'Ended'

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              {market.question}
            </CardTitle>
          </div>
          <div className="flex-shrink-0" title="Encrypted Bets">
            <Lock className="h-4 w-4 text-primary" />
          </div>
        </div>
        {market.description && (
          <CardDescription className="line-clamp-2">
            {market.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeText}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{market.totalBets} {market.totalBets === 1 ? 'bet' : 'bets'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-semibold">Encrypted Pool</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Creator: {truncateAddress(market.creator.toBase58())}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/market/${market.marketId}`}>
            {isActive ? 'Place Bet' : 'View Market'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function MarketCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
            <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-6 bg-muted animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-muted animate-pulse rounded w-full"></div>
      </CardFooter>
    </Card>
  )
}

