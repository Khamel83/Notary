# 🧪 TESTING GUIDE - LA MOBILE NOTARY

## Complete End-to-End Testing for Production Readiness

This guide covers testing every feature of your platform to ensure everything works perfectly before going live.

---

## 📋 PRE-TESTING CHECKLIST

### ✅ Environment Setup
- [ ] All environment variables set in Railway
- [ ] Database connected and migrated (`railway run npx prisma db push`)
- [ ] Stripe test mode configured
- [ ] Resend API key active (email)
- [ ] Twilio trial account active (SMS)
- [ ] Platform deployed and accessible

### ✅ Test Accounts Created
- [ ] Stripe test account setup
- [ ] Resend account with API key
- [ ] Twilio trial account with phone number
- [ ] Test email address (use your real email)
- [ ] Test phone number (use your real phone)

---

## 🎯 TEST SCENARIOS

### Test 1: Basic Booking Flow (No Notifications)

**Objective**: Verify core booking and payment without email/SMS

**Steps**:
1. Go to homepage
2. Fill out booking form:
   - Signatures: 2
   - Address: 123 Test St
   - City: Los Angeles
   - ZIP: 90028
   - Date: Tomorrow
   - Time: 3:00 PM
   - Urgency: Standard
   - Name: Test User
   - Email: your-test@email.com
   - Phone: (555) 123-4567

3. Click "Book Appointment"
4. Verify confirmation page shows:
   - Correct appointment details
   - Correct pricing
   - Total amount
5. Click "Proceed to Payment"
6. Use Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/34
   CVC: 123
   ZIP: 12345
   ```
7. Complete payment
8. Verify success page shows:
   - Success message
   - Confirmation code
   - Appointment details
   - Receipt link

**Expected Results**:
- ✅ Form validation works
- ✅ Price calculator updates correctly
- ✅ Payment processes successfully
- ✅ Redirects to success page
- ✅ Database saves appointment (check Railway logs)

**Console Logs to Check**:
```
Railway logs should show:
✅ "Payment successful: { sessionId: cs_test_... }"
✅ "Appointment created: clx..."
📧 "Email disabled (no RESEND_API_KEY)" (if not configured)
📱 "SMS disabled (no Twilio config)" (if not configured)
```

---

### Test 2: Email Notifications

**Objective**: Verify email confirmations work

**Prerequisites**:
- Resend API key set in environment variables
- RESEND_FROM_EMAIL configured

**Steps**:
1. Complete a test booking (use Test 1 steps)
2. After payment completes, check your email inbox
3. Verify confirmation email received within 1-2 minutes

**Expected Email Content**:
- ✅ From: "LA Mobile Notary"
- ✅ Subject: "✅ Booking Confirmed - [Date]"
- ✅ Professional HTML email with:
  - Navy/gold branding
  - Success checkmark icon
  - Appointment details (date, time, location)
  - Total paid amount
  - Confirmation code
  - "View Receipt" button
  - "What to Prepare" checklist

**Console Logs**:
```
✅ Email sent successfully: [email-id]
```

**If Email Fails**:
- Check RESEND_API_KEY is correct
- Verify email address format
- Check Resend dashboard for errors
- Review Railway logs for error messages

---

### Test 3: SMS Notifications

**Objective**: Verify SMS confirmations work

**Prerequisites**:
- Twilio Account SID configured
- Twilio Auth Token configured
- Twilio phone number configured
- Use REAL phone number for testing

**Steps**:
1. Complete a test booking with your real phone number
2. After payment completes, check your phone
3. Verify SMS received within 1-2 minutes

**Expected SMS Content**:
```
LA Mobile Notary: Booking confirmed! [Date] at [Time].
Confirmation: [CODE]. Bring valid ID. Reply HELP for info.
```

**Console Logs**:
```
✅ SMS sent successfully: SM...
```

**If SMS Fails**:
- Verify phone number format (should be +1XXXXXXXXXX)
- Check Twilio trial credit balance
- Ensure phone number is verified in Twilio (trial accounts only send to verified numbers)
- Review Twilio console for error logs

---

### Test 4: Afterpay Payment Method

**Objective**: Verify Afterpay buy-now-pay-later works

**Steps**:
1. Create booking with total > $50 (Afterpay minimum)
   - Example: 5 signatures + same-day = ~$180
2. On Stripe checkout, select "Afterpay"
3. Use Afterpay test phone number:
   ```
   Phone: +15555555555 (success)
   or
   Phone: +15555555556 (decline - for testing failures)
   ```
4. Complete Afterpay flow
5. Verify redirects to success page

**Expected Results**:
- ✅ Afterpay shows in payment methods (if total > $50)
- ✅ Afterpay test flow works
- ✅ Payment marked as completed
- ✅ Email and SMS sent

---

### Test 5: Receipt Generation

**Objective**: Verify digital receipts work

**Steps**:
1. Complete a booking
2. On success page, click "View Receipt"
3. Verify receipt page shows:
   - Professional layout
   - Confirmation code
   - Customer details
   - Appointment details
   - Pricing breakdown
   - Total paid
   - Payment status
4. Click "Print Receipt"
5. Verify print-friendly format

**Expected Results**:
- ✅ Receipt loads successfully
- ✅ All details match booking
- ✅ Professional branding
- ✅ Print button works
- ✅ Print format is clean (no header/footer/navigation)

---

### Test 6: Database Persistence

**Objective**: Verify bookings save to database

**Steps**:
1. Complete 2-3 test bookings
2. Check database using Prisma Studio:
   ```bash
   railway run npx prisma studio
   ```
3. Open browser to http://localhost:5555
4. Check "Appointment" table
5. Verify all bookings are saved with:
   - Correct customer details
   - Appointment date/time
   - Payment status: COMPLETED
   - Total amount
   - Confirmation status

**Expected Results**:
- ✅ All appointments appear in database
- ✅ Payment status is COMPLETED
- ✅ All fields populated correctly
- ✅ Timestamps accurate

---

### Test 7: Error Handling

**Objective**: Verify graceful error handling

**Test 7A: Invalid Credit Card**
```
Card: 4000 0000 0000 0002 (declined card)
Expiry: 12/34
CVC: 123
```
**Expected**:
- Payment fails at Stripe
- Returns to booking form
- No appointment created

**Test 7B: Webhook Failure Simulation**
- Temporarily break database connection
- Complete booking
- Payment should succeed (money collected)
- Error logged but webhook returns 200
- Fix database and re-trigger webhook if needed

**Test 7C: Missing Environment Variables**
- Remove RESEND_API_KEY temporarily
- Complete booking
- Email should fail gracefully (log message)
- Booking still succeeds

---

### Test 8: Mobile Responsiveness

**Objective**: Verify mobile experience

**Devices to Test**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad/Tablet

**What to Test**:
1. Homepage booking form
   - All fields visible and tappable
   - Keyboard doesn't overlap fields
   - Price calculator visible
2. Confirmation page
   - Details readable
   - Buttons tappable (44px minimum)
3. Stripe checkout
   - Loads correctly
   - Form fields work
4. Success page
   - Message displays well
   - Receipt link works
5. Receipt page
   - Readable on mobile
   - Printable

**Expected Results**:
- ✅ All elements responsive
- ✅ Text readable (no tiny fonts)
- ✅ Buttons easy to tap
- ✅ No horizontal scroll
- ✅ Fast loading (<3 seconds)

---

### Test 9: Pricing Calculator

**Objective**: Verify all pricing scenarios

**Test Cases**:

**Case 1: Basic Booking**
- Signatures: 1
- Distance: 5 miles (within free zone)
- Time: 2:00 PM weekday
- Urgency: Standard
- **Expected**: $90 (Base $15 + Travel $75)

**Case 2: After Hours**
- Signatures: 2
- Time: 8:00 PM
- Day: Tuesday
- **Expected**: $90 base + $50 after hours = $140

**Case 3: Weekend**
- Signatures: 2
- Time: 2:00 PM
- Day: Saturday
- **Expected**: $90 base + $25 weekend = $115

**Case 4: Same-Day + After Hours + Weekend**
- Signatures: 3
- Distance: 15 miles
- Time: 7:00 PM Saturday
- Urgency: Same Day
- **Expected**:
  - Base: $45 (3 × $15)
  - Travel: $75
  - Distance: $2.50 (5 extra miles)
  - After hours: $50
  - Weekend: $25
  - Same day: $50
  - **Total**: $247.50

**Verification**:
- ✅ Calculator updates in real-time
- ✅ All surcharges apply correctly
- ✅ Breakdown shows each fee
- ✅ Total matches Stripe checkout

---

### Test 10: Stripe Webhook Events

**Objective**: Test all webhook scenarios

**Test in Stripe Dashboard**:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"

**Events to Test**:

**checkout.session.completed**
- Triggers: Appointment creation
- Expected: Database entry + Email + SMS

**payment_intent.succeeded**
- Triggers: Payment status update
- Expected: Status → COMPLETED

**payment_intent.payment_failed**
- Triggers: Failed payment handling
- Expected: Status → FAILED, Appointment → CANCELLED

**charge.refunded**
- Triggers: Refund processing
- Expected: Status → REFUNDED, Appointment → CANCELLED

**Verification**:
- ✅ All webhooks respond with 200
- ✅ Database updates correctly
- ✅ Logs show proper handling

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Emails not sending

**Check**:
1. Is RESEND_API_KEY set?
   ```bash
   railway variables
   ```
2. Is API key valid? (Check Resend dashboard)
3. Is domain verified? (Resend: only send from verified domains in production)

**Fix**:
- Use `onboarding@resend.dev` for testing
- Verify your domain in Resend for production
- Check Railway logs for specific error

---

### Issue: SMS not sending

**Check**:
1. Is phone number verified in Twilio? (Trial accounts requirement)
2. Is phone number format correct? (+1XXXXXXXXXX)
3. Is Twilio credit available?

**Fix**:
- Verify recipient phone in Twilio console
- Check phone number format in form
- Add trial credit or upgrade Twilio account

---

### Issue: Payment succeeds but no appointment

**Check**:
1. Check Railway logs for database errors
2. Verify DATABASE_URL is set
3. Run prisma migration:
   ```bash
   railway run npx prisma db push
   ```

**Fix**:
- Ensure database is connected
- Check Prisma schema matches database
- Review webhook logs for errors

---

### Issue: Webhook not firing

**Check**:
1. Is webhook URL correct in Stripe?
2. Is webhook secret set in environment?
3. Is site deployed and accessible?

**Fix**:
- Verify webhook URL: `https://your-app.railway.app/api/webhooks/stripe`
- Copy webhook secret from Stripe
- Test webhook using Stripe dashboard "Send test webhook"

---

## ✅ PRODUCTION READINESS CHECKLIST

Before switching to LIVE mode:

### Stripe
- [ ] Switch from test to live API keys
- [ ] Create live webhook endpoint
- [ ] Test with real $1 payment
- [ ] Verify funds appear in Stripe balance

### Email/SMS
- [ ] Verify Resend domain (if using custom domain)
- [ ] Test from actual business email
- [ ] Verify SMS from Twilio number
- [ ] Ensure professional messaging

### Database
- [ ] Backup database (Railway: automatic)
- [ ] Test database queries work
- [ ] Verify data retention policies

### Monitoring
- [ ] Set up error alerts (optional)
- [ ] Monitor Railway logs daily (first week)
- [ ] Check Stripe dashboard for payments
- [ ] Review Resend/Twilio usage

---

## 📊 TEST RESULT TRACKING

Use this checklist to track your testing progress:

```
Basic Functionality:
[ ] Test 1: Basic booking flow
[ ] Test 2: Email notifications
[ ] Test 3: SMS notifications
[ ] Test 4: Afterpay payments
[ ] Test 5: Receipt generation
[ ] Test 6: Database persistence

Edge Cases:
[ ] Test 7: Error handling
[ ] Test 8: Mobile responsiveness
[ ] Test 9: Pricing calculator
[ ] Test 10: Stripe webhooks

Production Ready:
[ ] All tests passed
[ ] Switched to live keys
[ ] Verified with $1 real payment
[ ] Monitoring setup complete
```

---

## 🚀 DEPLOYMENT TESTING FLOW

**Recommended Order**:

1. **Deploy to staging** (Railway test environment)
2. **Run Tests 1-6** (core functionality)
3. **Run Tests 7-10** (edge cases)
4. **Fix any issues found**
5. **Re-test failed scenarios**
6. **Switch to production** (live Stripe keys)
7. **Test with $1 real payment**
8. **Monitor first 5 real bookings closely**
9. **Gather customer feedback**
10. **Iterate and improve**

---

## 💡 TIPS FOR EFFECTIVE TESTING

1. **Test in incognito mode** - Avoids cached data
2. **Use real email/phone** - Verify notifications actually arrive
3. **Test on real devices** - Desktop + mobile
4. **Check all logs** - Railway, Stripe, Resend, Twilio
5. **Document issues** - Screenshot errors for troubleshooting
6. **Test edge cases** - Unusual inputs, max values, special characters
7. **Simulate failures** - Test error handling works
8. **Ask friends to test** - Fresh eyes catch issues

---

## 🎯 SUCCESS CRITERIA

Your platform is ready for production when:

- ✅ All 10 tests pass
- ✅ Emails deliver within 2 minutes
- ✅ SMS deliver within 2 minutes
- ✅ Payments process correctly
- ✅ Database saves all bookings
- ✅ Mobile experience is smooth
- ✅ Error handling works gracefully
- ✅ Receipts generate correctly
- ✅ $1 real payment test succeeds
- ✅ You're confident in the system

---

**Ready to test? Start with Test 1 and work your way through!**

*Last Updated: November 23, 2025*
*For issues: Check Railway logs first, then review this guide*
