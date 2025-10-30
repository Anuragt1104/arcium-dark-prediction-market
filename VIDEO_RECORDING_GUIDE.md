# 🎥 Video Recording Guide for Hackathon Submission

This guide will help you create a professional demo video showcasing your Dark Prediction Market project.

## 📋 Before You Record

### Prerequisites
- ✅ Frontend running (`cd frontend && npm run dev`)
- ✅ Solana wallet installed (Phantom recommended)
- ✅ Some devnet SOL in your wallet
- ✅ Screen recording software (OBS, Loom, or QuickTime)
- ✅ Microphone for voiceover
- ✅ Script prepared (see below)

### Recommended Settings
- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30fps or 60fps
- **Duration**: 3-5 minutes (max 10 minutes)
- **Format**: MP4 (H.264)
- **Audio**: Clear voiceover explaining features

## 🎬 Video Structure

### Opening (30 seconds)
1. **Hook** (5 seconds)
   - Show the homepage with the tagline
   - "Dark Prediction Market - Privacy-First Predictions on Solana"

2. **Problem Statement** (10 seconds)
   - Explain the issue with traditional prediction markets
   - "Traditional markets expose all bets, enabling front-running and manipulation"

3. **Solution** (15 seconds)
   - Introduce Arcium MPC integration
   - "We use Arcium's encrypted compute to keep bets private until resolution"

### Demo Flow (3-4 minutes)

#### 1. Homepage Tour (30 seconds)
**What to show:**
- Hero section with gradient text
- Feature cards (Encrypted Bets, No Front-Running, etc.)
- Stats section
- How It Works section
- Smooth scroll through the page

**What to say:**
> "Our platform combines Solana's speed with Arcium's privacy. Here's how we ensure fair markets..."

#### 2. Explore Markets (30 seconds)
**What to show:**
- Navigate to /explore
- Show the filter buttons (All, Active, Ended, Resolved)
- Search for a market
- Hover over market cards showing hover effects

**What to say:**
> "Users can browse all available markets. Each market shows the encrypted pool status..."

#### 3. Connect Wallet (20 seconds)
**What to show:**
- Click wallet button
- Connect Phantom wallet
- Show connected state with address

**What to say:**
> "Let's connect our Solana wallet. The app supports Phantom, Solflare, and other popular wallets."

#### 4. View Market Details (40 seconds)
**What to show:**
- Click on a market
- Show market details page
- Point out:
  - Encrypted pool indicator
  - Time remaining
  - Privacy guarantee sidebar
  - Recent activity

**What to say:**
> "Each market has full details. Notice the encrypted pool - no one can see individual bet amounts until resolution."

#### 5. Place Encrypted Bet (60 seconds)
**What to show:**
- Click "Place Encrypted Bet" button
- Show the betting dialog
- Select YES or NO
- Enter bet amount (use preset buttons)
- Show encryption notice
- Submit bet
- Show transaction confirmation

**What to say:**
> "When placing a bet, we encrypt your data client-side using Arcium's MPC technology. 
> Your bet amount and prediction remain completely private. 
> The encrypted data is then submitted to Solana..."

#### 6. My Bets Page (40 seconds)
**What to show:**
- Navigate to /my-bets
- Show dashboard with stats
- Filter by Active/Won
- Point out encrypted amounts
- Show claimable winnings (if any)

**What to say:**
> "Users can track all their bets here. Notice each bet shows as 'encrypted' 
> until the market resolves. Winners can claim their payouts while maintaining privacy."

#### 7. Create Market (40 seconds)
**What to show:**
- Navigate to /create
- Fill out the form:
  - Question: "Will ETH reach $5k by end of year?"
  - Category: Crypto
  - End date: Pick a future date
  - Description: Add some context
- Show preview
- Show privacy guarantee notice

**What to say:**
> "Anyone can create a market. The form includes a live preview and ensures 
> all privacy guarantees are communicated clearly."

### Technical Highlights (30 seconds)

**What to show:**
- Open browser developer console
- Show network requests
- Point out encrypted data in transaction

**What to say:**
> "From a technical perspective, all sensitive data is encrypted before 
> leaving the browser. Arcium's MPC network processes bets without 
> ever seeing plaintext values."

### Closing (20 seconds)

**What to show:**
- Return to homepage
- Show footer with links

**What to say:**
> "Dark Prediction Market demonstrates how Arcium's encrypted compute 
> can bring true privacy to prediction markets on Solana. 
> No front-running, no manipulation, just fair markets powered by MPC."

## 🎙️ Recording Tips

### Audio
- ✅ Use a good microphone (even AirPods work better than laptop mic)
- ✅ Record in a quiet room
- ✅ Speak clearly and at moderate pace
- ✅ Add background music (low volume, royalty-free)

### Video
- ✅ Clean desktop (hide unrelated tabs/windows)
- ✅ Full-screen browser (F11) or hide browser chrome
- ✅ Smooth cursor movements
- ✅ Use keyboard shortcuts to navigate faster
- ✅ Add zoom effects on important UI elements

### Editing
- ✅ Remove long loading times (speed up or cut)
- ✅ Add text overlays for key points
- ✅ Highlight important features with circles/arrows
- ✅ Add transitions between sections
- ✅ Include captions for accessibility

## 📝 Sample Script

```
[0:00] Opening
"Hi! This is Dark Prediction Market - the first privacy-preserving prediction market on Solana, 
powered by Arcium's encrypted compute."

[0:05] Problem
"Traditional prediction markets have a critical flaw: all bets are public. 
This enables front-running, market manipulation, and privacy loss."

[0:15] Solution
"We solve this using Arcium's Multi-Party Computation. Bets are encrypted client-side, 
processed in a distributed MPC network, and only aggregates are revealed."

[0:25] Homepage Demo
"The homepage highlights our key features: encrypted bets prevent front-running, 
MPC ensures fairness, and everything runs at Solana speed."

[0:45] Explore Markets
"Users can browse all available markets. Each card shows the question, 
time remaining, and bet count - but pool amounts stay encrypted."

[1:10] Connect Wallet
"Let's connect a Solana wallet. We support all major wallets through 
the Solana wallet adapter."

[1:30] Market Details
"Here's a market detail page. You can see when it ends, how many bets 
have been placed, but the total pool is encrypted."

[1:50] Place Bet
"Let's place a bet. I'll bet 5 SOL on YES. Notice the privacy notice - 
my bet gets encrypted using Arcium's x25519 and RescueCipher before 
submission to the blockchain."

[2:50] My Bets
"On the My Bets page, I can see all my positions. Even here, amounts 
show as encrypted until market resolution. This prevents others from 
copying successful strategies."

[3:30] Create Market
"Anyone can create a market. Just fill in the question, set an end time, 
and submit. The platform ensures all participants understand the privacy guarantees."

[4:10] Technical
"Under the hood, all sensitive data is encrypted before leaving the browser. 
Arcium's MPC network processes these encrypted values without ever seeing 
the actual amounts or predictions."

[4:30] Closing
"Dark Prediction Market shows how Arcium brings institutional-grade privacy 
to DeFi. Built for the Arcium Cypherpunk Hackathon. Thank you!"
```

## 🛠️ Recommended Tools

### Screen Recording
- **OBS Studio** (Free, professional)
  - Download: https://obsproject.com/
  - Settings: 1920x1080, 30fps, H.264
  
- **Loom** (Easy to use, web-based)
  - Website: https://www.loom.com/
  - Max 5 min on free plan
  
- **QuickTime** (Mac only)
  - Built-in, simple
  - File > New Screen Recording

### Video Editing
- **DaVinci Resolve** (Free, professional)
- **iMovie** (Mac, free, easy)
- **Shotcut** (Free, cross-platform)
- **CapCut** (Free, beginner-friendly)

### Background Music (Royalty-Free)
- YouTube Audio Library
- Epidemic Sound (paid)
- Artlist (paid)
- Uppbeat (free with attribution)

## ✅ Pre-Submission Checklist

Before uploading your video:

- [ ] Video plays correctly (no corruption)
- [ ] Audio is clear throughout
- [ ] All features demonstrated
- [ ] Privacy/encryption highlighted
- [ ] Arcium MPC mentioned
- [ ] Duration under 10 minutes
- [ ] Uploaded to YouTube (unlisted or public)
- [ ] Added to hackathon submission

## 📤 Where to Upload

1. **YouTube** (Recommended)
   - Upload as "Unlisted" or "Public"
   - Add title: "Dark Prediction Market - Arcium Hackathon Submission"
   - Add description with GitHub link
   - Add tags: solana, arcium, mpc, prediction-market, privacy

2. **Loom**
   - Share link in submission

3. **Google Drive**
   - Set to "Anyone with link can view"
   - Share link in submission

## 🎯 Success Criteria

Your video should demonstrate:
- ✅ Complete user journey (browse → bet → track)
- ✅ Privacy features clearly explained
- ✅ Arcium integration highlighted
- ✅ Professional presentation
- ✅ Working prototype (not mockups)
- ✅ Clear narration or captions

---

Good luck with your video! Remember: judges want to see a working demo that clearly shows 
how Arcium's encrypted compute provides value. Focus on the privacy benefits and smooth user experience.

