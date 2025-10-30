'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Lock, TrendingUp, TrendingDown } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import * as Dialog from '@radix-ui/react-dialog'
import { formatSol } from '@/lib/utils'
import { LAMPORTS_PER_SOL } from '@/lib/constants'
import { ArciumClient, generateComputationOffset } from '@/lib/arcium-client'

interface BetDialogProps {
  marketId: bigint
  marketQuestion: string
  onSuccess?: () => void
}

export function BetDialog({ marketId, marketQuestion, onSuccess }: BetDialogProps) {
  const { connected, publicKey } = useWallet()
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<'YES' | 'NO'>('YES')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePlaceBet = async () => {
    if (!connected || !publicKey || !amount) return

    setLoading(true)
    try {
      const betAmountLamports = BigInt(Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL))
      const prediction = side === 'YES' ? 1 : 0
      
      // Initialize Arcium client
      const arciumClient = new ArciumClient(Buffer.from(new Uint8Array(32).fill(1)))
      
      // Encrypt bet data
      const encryptedData = await arciumClient.encryptBet({
        marketId,
        betAmount: betAmountLamports,
        prediction,
        userNonce: BigInt(Date.now())
      })
      
      const computationOffset = generateComputationOffset()
      
      console.log('Placing encrypted bet:', {
        marketId: marketId.toString(),
        side,
        amount,
        encrypted: true
      })
      
      // Here we would call the Solana program's place_bet instruction
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      setOpen(false)
      setAmount('')
      onSuccess?.()
    } catch (error) {
      console.error('Error placing bet:', error)
      alert('Failed to place bet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isValid = amount && parseFloat(amount) > 0 && connected

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="lg" className="w-full">
          <Lock className="mr-2 h-4 w-4" />
          Place Encrypted Bet
        </Button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <Dialog.Title className="text-2xl font-bold mb-2">
                  Place Your Bet
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  {marketQuestion}
                </Dialog.Description>
              </div>

              {/* Side Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Prediction</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSide('YES')}
                    className={`
                      relative overflow-hidden rounded-lg border-2 p-4 transition-all
                      ${side === 'YES' 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-border hover:border-green-500/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">YES</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide('NO')}
                    className={`
                      relative overflow-hidden rounded-lg border-2 p-4 transition-all
                      ${side === 'NO' 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-border hover:border-red-500/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-500" />
                      <span className="font-semibold">NO</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bet Amount (SOL)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.00"
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-lg font-semibold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    SOL
                  </div>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs hover:bg-accent transition-colors"
                    >
                      {preset} SOL
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="flex gap-3 p-4">
                  <Lock className="h-5 w-5 text-primary shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Encrypted Bet</p>
                    <p className="text-muted-foreground text-xs">
                      Your bet amount and prediction will be encrypted using Arcium's MPC. 
                      No one can see your position until market resolution.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePlaceBet}
                  disabled={!isValid || loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? 'Encrypting & Submitting...' : `Bet ${amount || '0'} SOL on ${side}`}
                </Button>
                <Dialog.Close asChild>
                  <Button variant="outline" size="lg">
                    Cancel
                  </Button>
                </Dialog.Close>
              </div>
            </CardContent>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

