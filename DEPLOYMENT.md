# 🚀 Deployment Guide

Complete guide to deploy Dark Prediction Market to production.

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Start frontend
cd frontend
npm run dev
# Open http://localhost:3000

# 3. (Optional) Start local Solana validator
solana-test-validator
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Prerequisites
- Vercel account (free tier works)
- GitHub repository

#### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "feat: Complete Arcium prediction market"
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Set root directory to `frontend`
- Add environment variables:
  ```
  NEXT_PUBLIC_SOLANA_NETWORK=devnet
  NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
  NEXT_PUBLIC_PROGRAM_ID=5ReKPSDBcvh8M5nyhVBJsNxdAzC6LfJ5R6wjuApjgLhQ
  ```
- Click "Deploy"

3. **Custom Domain (Optional)**
- Go to project settings → Domains
- Add your custom domain
- Update DNS records as instructed

### Option 2: Netlify

```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

### Option 3: Self-Hosted (VPS)

#### On Ubuntu/Debian VPS

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and build
git clone YOUR_REPO_URL
cd arcium-dark-prediction-market/frontend
npm install
npm run build

# Start with PM2
pm2 start npm --name "dark-market" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Solana Program Deployment

### Deploy to Devnet

```bash
# Set Solana CLI to devnet
solana config set --url devnet

# Check wallet balance
solana balance

# If needed, airdrop SOL
solana airdrop 2

# Build program
anchor build

# Deploy
anchor deploy

# Note the Program ID and update:
# - frontend/lib/constants.ts
# - Anchor.toml
# - Arcium.toml
```

### Deploy to Mainnet

⚠️ **Warning**: Only deploy to mainnet after thorough testing!

```bash
# Set to mainnet
solana config set --url mainnet-beta

# Ensure sufficient SOL for deployment (~5-10 SOL)
solana balance

# Build
anchor build

# Deploy
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show PROGRAM_ID
```

## Environment Variables

### Frontend (.env.local)

```bash
# Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Program
NEXT_PUBLIC_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID

# Arcium
NEXT_PUBLIC_ARCIUM_CLUSTER=testnet
NEXT_PUBLIC_MXE_PUBLIC_KEY=YOUR_MXE_KEY

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Dark Prediction Market

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

## Post-Deployment Checklist

### Frontend
- [ ] Site loads correctly
- [ ] Wallet connects successfully
- [ ] All pages render properly
- [ ] Images and assets load
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Analytics tracking (if enabled)

### Smart Contract
- [ ] Program deployed successfully
- [ ] Program ID updated in frontend
- [ ] Instructions callable
- [ ] Transactions confirm
- [ ] Account structure correct
- [ ] Error handling works

### Testing
- [ ] Create a market
- [ ] Place a bet
- [ ] View market details
- [ ] Browse markets
- [ ] Check My Bets page
- [ ] Test wallet connection/disconnection

## Monitoring & Maintenance

### Frontend Monitoring

#### Vercel Analytics
```typescript
// Already included in Next.js
// View at vercel.com/dashboard
```

#### Error Tracking with Sentry

```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Program Monitoring

```bash
# Check program logs
solana logs PROGRAM_ID

# Monitor account data
solana account MARKET_PDA
```

## Troubleshooting

### Build Fails

```bash
# Clear caches
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Wallet Connection Issues

- Ensure RPC endpoint is accessible
- Check browser console for errors
- Try different RPC provider
- Verify wallet adapter version compatibility

### Transaction Failures

- Check wallet has sufficient SOL
- Verify program ID is correct
- Ensure accounts are initialized
- Check compute unit limits

## Scaling Considerations

### Frontend
- Use CDN for static assets
- Enable caching headers
- Optimize images (next/image)
- Code splitting (already done by Next.js)

### Backend/RPC
- Use paid RPC provider (Helius, QuickNode)
- Implement rate limiting
- Cache blockchain data
- Use WebSocket for real-time updates

### Database (Future)
- Add PostgreSQL for indexing
- Store market snapshots
- Cache bet history
- Analytics dashboard

## Cost Estimates

### Vercel (Frontend)
- Free tier: 100GB bandwidth, unlimited requests
- Pro: $20/month for better performance

### Solana (Smart Contract)
- Devnet: Free (airdrop SOL)
- Mainnet: ~2-5 SOL for deployment + rent

### RPC Providers
- Free tier: Limited requests
- Paid: $50-200/month for production traffic

### Domain
- .com domain: ~$12/year

## Security Checklist

- [ ] Environment variables not committed
- [ ] API keys secure
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Wallet permissions reviewed
- [ ] Smart contract audited (for mainnet)

## Backup & Recovery

### Frontend
```bash
# Automated through Git
git push origin main
```

### Smart Contract
```bash
# Save program keypair securely
cp target/deploy/dark_prediction_market-keypair.json ~/backups/

# Export IDL
anchor idl fetch PROGRAM_ID > backups/idl.json
```

## Performance Optimization

### Frontend
```javascript
// next.config.ts
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Caching
```typescript
// Use SWR or React Query for data fetching
import useSWR from 'swr'

const { data } = useSWR('/api/markets', fetcher, {
  refreshInterval: 30000, // 30s
  revalidateOnFocus: false,
})
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          NEXT_PUBLIC_SOLANA_NETWORK: ${{ secrets.SOLANA_NETWORK }}
          NEXT_PUBLIC_PROGRAM_ID: ${{ secrets.PROGRAM_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Support & Resources

- **Vercel Docs**: https://nextjs.org/docs/deployment
- **Solana Deployment**: https://docs.solana.com/cli/deploy-a-program
- **Anchor Deployment**: https://www.anchor-lang.com/docs/cli
- **RPC Providers**: https://solana.com/rpc

Need help? Check the main README or create an issue on GitHub.

