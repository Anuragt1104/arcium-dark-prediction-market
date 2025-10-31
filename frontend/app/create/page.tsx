'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Calendar, Info } from 'lucide-react'
import { MARKET_CATEGORIES } from '@/lib/constants'

export default function CreateMarketPage() {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    category: 'Crypto',
    endDate: '',
    endTime: '23:59'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) return
    
    setLoading(true)
    
    try {
      // Here we would:
      // 1. Combine endDate and endTime into Unix timestamp
      // 2. Call the Solana program's initialize_market instruction
      // 3. Wait for transaction confirmation
      // 4. Navigate to the new market page
      
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)
      const endTimeUnix = Math.floor(endDateTime.getTime() / 1000)
      
      console.log('Creating market:', {
        question: formData.question,
        endTime: endTimeUnix,
        creator: publicKey.toBase58()
      })
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock market ID
      const mockMarketId = Date.now()
      
      // Navigate to the new market
      router.push(`/market/${mockMarketId}`)
    } catch (error) {
      console.error('Error creating market:', error)
      alert('Failed to create market. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.question.trim().length > 0 && formData.endDate

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Prediction Market</h1>
            <p className="text-lg text-muted-foreground">
              Launch a privacy-preserving prediction market
            </p>
          </div>

          {!connected ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to connect your Solana wallet to create a market
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Details</CardTitle>
                  <CardDescription>
                    Define your prediction question and parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Question */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Question *
                    </label>
                    <input
                      type="text"
                      placeholder="Will Bitcoin reach $100k by end of year?"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      required
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.question.length}/200 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Add more context about how this market will be resolved..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {MARKET_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Date & Time */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        End Date *
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        End Time *
                      </label>
                      <input
                        type="time"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Info */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="flex gap-3 p-4">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Privacy Guaranteed</p>
                    <p className="text-muted-foreground">
                      All bets on this market will be encrypted using Arcium's MPC technology. 
                      Individual bet amounts and predictions remain private until resolution.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              {formData.question && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge>{formData.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{formData.question}</h3>
                    {formData.description && (
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    )}
                    {formData.endDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Ends on {new Date(`${formData.endDate}T${formData.endTime}`).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={!isFormValid || loading}
                >
                  {loading ? (
                    <>Creating Market...</>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Market
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/explore')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

