# Quick Start Guide

Get your LA Mobile Notary platform running in 5 minutes!

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/notary"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-key"
```

### 3. Set Up Database
```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Deploy to Production

### Option 1: Railway (Recommended)
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway add --database postgres
railway up
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### Option 2: Vercel + External Database
```bash
npx vercel
```

Add PostgreSQL from:
- [Supabase](https://supabase.com) (Free tier)
- [Neon](https://neon.tech) (Free tier)
- [PlanetScale](https://planetscale.com)

## Getting API Keys

### Stripe (Required for Payments)
1. Sign up at [stripe.com](https://stripe.com)
2. Get test keys from Dashboard → Developers → API keys
3. Enable Afterpay: Settings → Payment methods → Afterpay

### Google Maps (Required for Distance)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project
3. Enable: Maps JavaScript API, Geocoding API, Distance Matrix API
4. Create API key

## Testing

### Test Card Numbers (Stripe)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Test Afterpay
- Phone: `+15555555555` (success)
- Phone: `+15555555556` (decline)

### Test Booking
1. Go to home page
2. Fill in appointment details
3. See real-time price calculation
4. Click "Book Appointment"
5. Complete payment with test card

## Configuration

### Business Settings
Edit `.env`:
```env
NOTARY_NAME="Your Business Name"
NOTARY_EMAIL="your@email.com"
NOTARY_PHONE="+1-555-0100"
NOTARY_COMMISSION_NUMBER="12345678"
```

### Pricing Adjustments
Edit `lib/pricing.ts` to change:
- Base fees
- Travel charges
- Surcharges
- Service area

### Service Area
Edit `lib/pricing.ts`:
```typescript
export const BASE_LOCATION = {
  lat: 34.0978,  // Your latitude
  lng: -118.2930, // Your longitude
  zip: '90027',   // Your ZIP code
  name: 'Thai Town, Los Angeles',
};
```

## Database Management

### View Data
```bash
npx prisma studio
```

Opens visual database editor at [http://localhost:5555](http://localhost:5555)

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run:
```bash
npx prisma db push
npx prisma generate
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check PostgreSQL is running
# For Railway: verify DATABASE_URL is set
railway variables
```

### Stripe Not Working
1. Check API keys are correct
2. Verify test mode is enabled
3. Check browser console for errors

### Pricing Not Calculating
1. Verify all form fields are filled
2. Check browser console
3. Ensure date/time are valid

## File Structure

```
├── app/
│   ├── page.tsx              # Home + booking form
│   ├── dashboard/            # Operator dashboard
│   ├── services/             # Services page
│   ├── pricing/              # Pricing calculator
│   └── api/                  # API routes
├── lib/
│   ├── pricing.ts            # Pricing logic ⚙️
│   ├── prisma.ts             # Database client
│   └── stripe.ts             # Payment config
├── prisma/
│   └── schema.prisma         # Database schema 📊
└── .env                      # Your secrets 🔐
```

## Next Steps

1. ✅ Get it running locally
2. 📝 Customize business details
3. 🎨 Adjust colors/branding (see `app/globals.css`)
4. 💰 Test payment flow
5. 🚀 Deploy to Railway
6. 🔐 Add live Stripe keys
7. 📱 Share with first client!

## Key Features

### For Clients
- ⚡ Instant online booking
- 💵 Real-time pricing
- 💳 Pay now or Afterpay
- 📱 Mobile-friendly

### For You
- 📊 Dashboard to manage appointments
- 💰 Automatic pricing
- 📝 CA-compliant journal
- 💳 Secure payments via Stripe

## Support

- 📖 Full docs: [README.md](./README.md)
- 🚀 Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 Issues: Create GitHub issue
- 💬 Questions: Open discussion

---

**You're ready to run your mobile notary business!** 🎉
