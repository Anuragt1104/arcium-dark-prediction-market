'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Shield, Lock, Zap, TrendingUp, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const features = [
    {
      icon: Lock,
      title: "Encrypted Bets",
      description: "Your bet amounts and predictions stay completely private using Arcium's MPC technology"
    },
    {
      icon: Shield,
      title: "No Front-Running",
      description: "Encrypted data prevents others from seeing and copying your positions"
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      description: "Fast, fair resolution powered by Solana's high-performance blockchain"
    },
    {
      icon: EyeOff,
      title: "Zero Knowledge",
      description: "Market resolution without revealing individual bet details"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "Connect Wallet",
      description: "Connect your Solana wallet to get started"
    },
    {
      step: "2",
      title: "Choose or Create Market",
      description: "Browse existing markets or create your own prediction question"
    },
    {
      step: "3",
      title: "Place Encrypted Bet",
      description: "Your bet is encrypted client-side before hitting the blockchain"
    },
    {
      step: "4",
      title: "MPC Resolution",
      description: "Arcium's network calculates results without seeing your bet"
    },
    {
      step: "5",
      title: "Claim Winnings",
      description: "Winners claim their payouts while privacy is maintained"
    }
  ]

  const stats = [
    { label: "Total Markets", value: "12", trend: "+3 this week" },
    { label: "Total Volume", value: "1,245 SOL", trend: "+156 SOL" },
    { label: "Active Bettors", value: "342", trend: "+45 new" },
    { label: "Privacy Rate", value: "100%", trend: "Always encrypted" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl text-center"
            >
              <Badge className="mb-4" variant="outline">
                <Shield className="mr-1 h-3 w-3" />
                Powered by Arcium MPC
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                Privacy-First{" "}
                <span className="gradient-text">
                  Prediction Markets
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Keep your bets private. Make markets fair. Built with Arcium's encrypted compute on Solana.
                <br />
                <span className="font-semibold text-foreground">No front-running. No manipulation. Just privacy.</span>
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/explore">
                    Explore Markets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/create">Create Market</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="mt-1 text-xs text-green-500">{stat.trend}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Why Dark Prediction Market?
              </h2>
              <p className="text-lg text-muted-foreground">
                The first prediction market that truly protects your privacy using Multi-Party Computation
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/50 py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Privacy-preserving predictions in 5 simple steps
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="space-y-8">
                {howItWorks.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className="ml-5 border-l-2 border-dashed border-border h-8 -mb-8"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              <CardContent className="relative p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join the privacy revolution in prediction markets. Your bets, your privacy, your edge.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild>
                    <Link href="/explore">
                      Browse Markets
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/create">Create Your Market</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
