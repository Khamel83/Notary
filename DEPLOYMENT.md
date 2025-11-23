# Deployment Guide - LA Mobile Notary Platform

This guide walks you through deploying your mobile notary platform to production.

## Quick Start with Railway

Railway is the recommended hosting platform for this application. It provides:
- Easy PostgreSQL database setup
- Automatic HTTPS
- Zero-config deployments
- Environment variable management
- Automatic scaling

### Deploy to Railway (5 minutes)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link to your repo
   railway init
   ```

3. **Add PostgreSQL Database**
   ```bash
   railway add --database postgres
   ```

   Railway will automatically set `DATABASE_URL` for you.

4. **Set Environment Variables**
   ```bash
   # Required variables
   railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
   railway variables set NEXTAUTH_URL="https://your-app.up.railway.app"
   railway variables set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
   railway variables set STRIPE_SECRET_KEY="sk_live_..."
   railway variables set STRIPE_WEBHOOK_SECRET="whsec_..."
   railway variables set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"

   # Business configuration
   railway variables set NOTARY_NAME="LA Mobile Notary"
   railway variables set NOTARY_EMAIL="your@email.com"
   railway variables set NOTARY_PHONE="+1-555-0100"
   railway variables set NOTARY_COMMISSION_NUMBER="12345678"
   railway variables set BASE_LOCATION_ZIP="90027"
   railway variables set BASE_LOCATION_LAT="34.0978"
   railway variables set BASE_LOCATION_LNG="-118.2930"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Run Database Migrations**
   ```bash
   railway run npx prisma db push
   ```

7. **Get Your URL**
   ```bash
   railway open
   ```

Your site is now live! 🎉

## Stripe Setup

### 1. Create Stripe Account
- Sign up at [stripe.com](https://stripe.com)
- Complete business verification

### 2. Enable Afterpay
1. Go to Stripe Dashboard → **Settings** → **Payment methods**
2. Find **Afterpay / Clearpay**
3. Click **Enable**
4. No additional setup required!

### 3. Get API Keys
1. Go to **Developers** → **API keys**
2. Copy your publishable key (starts with `pk_`)
3. Copy your secret key (starts with `sk_`)
4. Add to Railway environment variables

### 4. Set Up Webhooks
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-app.up.railway.app/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret
6. Add to Railway: `STRIPE_WEBHOOK_SECRET`

### 5. Test Mode vs Live Mode
- Use test keys (`pk_test_...` and `sk_test_...`) during development
- Switch to live keys (`pk_live_...` and `sk_live_...`) for production
- Test Afterpay with phone: `+15555555555`

## Google Maps Setup

### 1. Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing

### 2. Enable Required APIs
Enable these APIs:
- Maps JavaScript API
- Geocoding API
- Distance Matrix API
- Places API

### 3. Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API key**
3. Copy the API key

### 4. Restrict API Key (Security)
1. Click on your API key
2. Under **Application restrictions**:
   - Choose **HTTP referrers**
   - Add: `https://your-app.up.railway.app/*`
3. Under **API restrictions**:
   - Choose **Restrict key**
   - Select the 4 APIs enabled above
4. Click **Save**

### 5. Add to Railway
```bash
railway variables set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-api-key"
```

## Domain Setup (Optional)

### Using Custom Domain on Railway

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)

2. **Add domain in Railway**
   ```bash
   railway domain
   ```

3. **Update DNS settings**
   - Add CNAME record pointing to Railway domain
   - Wait for DNS propagation (5-30 minutes)

4. **Update environment variables**
   ```bash
   railway variables set NEXTAUTH_URL="https://yourdomain.com"
   ```

5. **Update Stripe webhook URL**
   - Change webhook endpoint to `https://yourdomain.com/api/webhooks/stripe`

## Environment Variables Reference

### Required
```env
DATABASE_URL                          # Auto-set by Railway PostgreSQL
NEXTAUTH_URL                          # Your app URL
NEXTAUTH_SECRET                       # Generate with: openssl rand -base64 32
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY    # From Stripe Dashboard
STRIPE_SECRET_KEY                     # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET                 # From Stripe Webhooks
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY       # From Google Cloud Console
```

### Business Configuration
```env
NOTARY_NAME="LA Mobile Notary"
NOTARY_EMAIL="hello@lamobilenotary.com"
NOTARY_PHONE="+1-555-0100"
NOTARY_COMMISSION_NUMBER="12345678"
BASE_LOCATION_ZIP="90027"
BASE_LOCATION_LAT="34.0978"
BASE_LOCATION_LNG="-118.2930"
```

## Database Management

### View Database
```bash
railway run npx prisma studio
```

### Run Migrations
```bash
railway run npx prisma db push
```

### Backup Database
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

### Seed Initial Data
Create `prisma/seed.ts` then:
```bash
railway run npx prisma db seed
```

## Monitoring & Logs

### View Logs
```bash
railway logs
```

### Monitor Performance
- Railway provides built-in metrics
- Access via Railway dashboard

### Error Tracking (Optional)
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for analytics

## Security Checklist

Before going live:

- [ ] Switch to Stripe live keys
- [ ] Restrict Google Maps API key
- [ ] Set up Stripe webhooks
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Review environment variables
- [ ] Test payment flow end-to-end
- [ ] Verify California compliance
- [ ] Set up email notifications
- [ ] Configure backup schedule
- [ ] Review privacy policy
- [ ] Set up SSL certificate monitoring

## Testing Production

### Test Checklist
1. **Booking Flow**
   - [ ] Enter appointment details
   - [ ] See correct pricing calculation
   - [ ] Complete payment with test card
   - [ ] Receive confirmation

2. **Afterpay**
   - [ ] Amount is $1-$4000
   - [ ] See Afterpay payment option
   - [ ] Complete Afterpay flow
   - [ ] Verify 4 installments shown

3. **Operator Dashboard**
   - [ ] View appointments
   - [ ] Update appointment status
   - [ ] See payment status
   - [ ] Filter by date

4. **Pricing Calculator**
   - [ ] Enter different scenarios
   - [ ] Verify surcharges apply correctly
   - [ ] Test different times/dates
   - [ ] Check distance calculations

## Performance Optimization

### Railway Auto-Scaling
Railway automatically scales based on traffic. No configuration needed!

### Database Optimization
```bash
# Add database indexes for common queries
railway run npx prisma db push --skip-generate
```

### Caching
Consider adding:
- Redis for session storage
- Vercel Edge for static assets
- CDN for images

## Troubleshooting

### Build Fails
```bash
# Check build logs
railway logs --build

# Common fixes:
# 1. Run Prisma generate
railway run npx prisma generate

# 2. Clear build cache
railway up --rebuild
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
railway variables

# Test connection
railway run npx prisma db push
```

### Stripe Webhook Not Working
1. Check webhook URL is correct
2. Verify `STRIPE_WEBHOOK_SECRET` is set
3. Check webhook event logs in Stripe Dashboard

### Google Maps Not Loading
1. Check API key is correct
2. Verify APIs are enabled
3. Check domain restrictions
4. View browser console for errors

## Costs

### Railway
- **Starter Plan**: $5/month
  - Includes PostgreSQL
  - 500 hours compute
  - Perfect for small business

### Stripe
- **Per transaction**: 2.9% + $0.30
- **Afterpay**: Additional 6% + $0.30
- No monthly fees

### Google Maps
- **Free tier**: $200/month credit
- Typically covers 10,000-40,000 requests
- More than enough for small business

### Total Estimated Monthly Cost
- Railway: $5
- Stripe: Variable (on transactions)
- Google Maps: $0 (within free tier)
- **Minimum**: ~$5/month

## Support

Need help deploying?
- Railway docs: [docs.railway.app](https://docs.railway.app)
- Stripe docs: [stripe.com/docs](https://stripe.com/docs)
- Create an issue on GitHub

## Next Steps

After deployment:
1. Test the entire booking flow
2. Add your business information
3. Configure email notifications
4. Set up appointment reminders
5. Add Google Analytics
6. Market your service!

---

**Ready to launch?** Follow this guide step-by-step and you'll have a working notary platform in under 30 minutes! 🚀
