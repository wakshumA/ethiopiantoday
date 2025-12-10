# Google AdSense Complete Setup Guide

## ✅ What's Already Configured

Your AdSense is **95% set up correctly**:

- ✅ Script properly loaded in `<head>` with correct client ID: `ca-pub-9561015604678968`
- ✅ Metadata includes AdSense account verification
- ✅ AdSense component created with responsive ads
- ✅ AdBanner updated to use actual AdSense component
- ✅ Production-only check (no ads in development)
- ✅ Environment variables ready

## 🔴 What's Missing - Ad Slot IDs

Your ads won't display until you add your **Ad Slot IDs** to the code.

### Step 1: Get Your Ad Slot IDs from Google AdSense

1. Go to **[Google AdSense Dashboard](https://adsense.google.com)**
2. Navigate to **Ads** → **By Code** (or **Ad Units**)
3. Click **+ New Ad Unit** to create new ads
4. Create ads for these positions:
   - **Top Banner** (728x90, 970x90, or responsive)
   - **Between Sections** (300x250 or responsive)
   - **Bottom Banner** (728x90 or responsive)

Each ad will give you a `data-ad-slot` value that looks like: `1234567890` (10 digits)

### Step 2: Add Your Slot IDs to the Code

Open `/src/components/AdBanner.tsx` and update:

```tsx
const slots: Record<string, string> = {
  top: '1234567890',      // <- Replace with your actual slot ID
  sidebar: '1234567891',  // <- Replace with your actual slot ID
  bottom: '1234567892',   // <- Replace with your actual slot ID
}
```

Replace the numbers with your actual Google AdSense slot IDs.

### Step 3: (Optional) Add More Ad Placements

You can add more ad units in different places:

**In `/src/app/page.tsx` between sections:**
```tsx
import AdSense from '@/components/AdSense'

// Between major sections
<AdSense 
  slot="YOUR_SLOT_ID_HERE"
  format="auto"
  responsive={true}
/>
```

**In sidebar (if you add one):**
```tsx
<AdSense 
  slot="YOUR_SIDEBAR_SLOT_ID"
  format="vertical"
  responsive={true}
/>
```

## 🎯 Ad Format Options

```tsx
// Responsive (recommended) - adapts to screen size
<AdSense slot="1234567890" format="auto" responsive={true} />

// Specific formats
<AdSense slot="1234567890" format="rectangle" />   // 300x250
<AdSense slot="1234567890" format="horizontal" />  // 728x90
<AdSense slot="1234567890" format="vertical" />    // 300x600
```

## 📊 Current Ad Placements

Your ads are already placed in these locations via `<AdBanner>`:

1. **Top** - Between hero and main content
2. **Bottom** - At the end of page

View `/src/app/page.tsx` to see where ads are rendered:
```tsx
<AdBanner position="top" />    // Line ~XX
<AdBanner position="bottom" /> // Line ~XX
```

## ⚠️ Important Notes

1. **Ads take 24-48 hours to appear** after first setup
2. **Only visible in production** - use `npm run build && npm run start` to test
3. **Don't click your own ads** - violates AdSense policy
4. **Maintain user experience** - don't place too many ads
5. **Invalid traffic** - avoid excessive clicks/impressions

## 🚀 Deployment Checklist

- [ ] Get ad slot IDs from Google AdSense Dashboard
- [ ] Update slot IDs in `/src/components/AdBanner.tsx`
- [ ] Test in production (`npm run build && npm run start`)
- [ ] Deploy to Azure/production
- [ ] Monitor AdSense Dashboard for clicks/earnings
- [ ] Wait 24-48 hours for ads to appear

## 📈 Next Steps

After getting AdSense working:

1. **Add more ad units** for better coverage
2. **Implement premium features** (ads-free membership)
3. **Add affiliate links** for remittance services
4. **Monitor ad performance** in AdSense Dashboard
5. **Optimize ad placement** based on user behavior

## 💡 Best Practices

- ✅ Place ads between natural content breaks
- ✅ Use responsive "auto" format for flexibility
- ✅ Don't place too many ads above the fold
- ✅ Monitor bounce rate - excessive ads hurt UX
- ✅ Test on mobile (where most traffic comes from)
- ✅ Keep ads away from interactive elements

## 🔗 Resources

- [Google AdSense Documentation](https://support.google.com/adsense)
- [AdSense Policy Center](https://support.google.com/adsense/answer/48182)
- [Ad Code Generator](https://adsense.google.com/start/)

---

**Status:** Ready for production once slot IDs are added ✅
