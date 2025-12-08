# Deployment Guide

## GitHub Actions Automated Deployment

Your repository is configured for automated deployment using GitHub Actions.

### Setup Steps

#### 1. **Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `wakshumA/EthiopianToday`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### 2. **Get Vercel Credentials**

In Vercel dashboard:
1. Go to **Settings** → **General**
2. Copy your **Project ID**
3. Go to your Vercel account settings
4. Navigate to **Tokens**
5. Create a new token (name it "GitHub Actions")
6. Copy the token

For Organization ID:
```bash
# Install Vercel CLI locally
npm i -g vercel

# Login and link project
vercel login
vercel link

# Get your org ID (it's in .vercel/project.json)
cat .vercel/project.json
```

#### 3. **Add GitHub Secrets**

Go to your GitHub repository:
`https://github.com/wakshumA/EthiopianToday/settings/secrets/actions`

Add these secrets:

**Vercel Secrets:**
- `VERCEL_TOKEN` - Your Vercel token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

**Application Secrets:**
- `GROQ_API_KEY` - Your Groq API key (from .env.local)
- `TWITTER_API_KEY` - Your Twitter API key
- `TWITTER_API_SECRET` - Your Twitter API secret
- `TWITTER_ACCESS_TOKEN` - Your Twitter access token
- `TWITTER_ACCESS_SECRET` - Your Twitter access secret
- `TWITTER_BOT_SECRET` - Your Twitter bot secret
- `CRON_SECRET` - Your cron secret
- `BLOG_GENERATION_SECRET` - Your blog generation secret
- `RATES_ADMIN_KEY` - Your rates admin key
- `NEXT_PUBLIC_ADSENSE_ID` - `ca-pub-9561015604678968`

#### 4. **Add Environment Variables in Vercel**

In Vercel dashboard → Settings → Environment Variables, add:

```
OFFICIAL_RATES_JSON_URL=/official-rates.json
PARALLEL_RATES_JSON_URL=/parallel-rates.json
AI_PROVIDER=groq
GROQ_API_KEY=[your-key]
TWITTER_API_KEY=[your-key]
TWITTER_API_SECRET=[your-secret]
TWITTER_ACCESS_TOKEN=[your-token]
TWITTER_ACCESS_SECRET=[your-secret]
TWITTER_BOT_SECRET=[your-secret]
CRON_SECRET=[your-secret]
BLOG_GENERATION_SECRET=[your-secret]
RATES_ADMIN_KEY=[your-key]
NEXT_PUBLIC_ADSENSE_ID=ca-pub-9561015604678968
```

**Important:** Mark `NEXT_PUBLIC_ADSENSE_ID` as available to all environments (Production, Preview, Development)

#### 5. **Push to Deploy**

```bash
# Add all changes
git add .

# Commit
git commit -m "Add GitHub Actions deployment workflow"

# Push to main branch (triggers deployment)
git push origin main
```

### Deployment Workflows

#### Main Deployment (`deploy.yml`)
- **Triggers:** Push to `main` branch or Pull Requests
- **Actions:**
  - Installs dependencies
  - Runs security audit
  - Builds the project
  - Deploys to Vercel production (main branch)
  - Deploys preview (pull requests)

#### CI Checks (`ci.yml`)
- **Triggers:** Push to `main`/`develop` or Pull Requests
- **Actions:**
  - Security audit
  - Dependency vulnerability check
  - Type checking
  - Linting
  - Build test

### Monitoring Deployments

1. **GitHub Actions:**
   - Go to: `https://github.com/wakshumA/EthiopianToday/actions`
   - View workflow runs and logs

2. **Vercel Dashboard:**
   - View deployments: `https://vercel.com/dashboard`
   - Check build logs
   - Monitor performance

### Custom Domain Setup (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain: `ethioexchangerate.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-10 minutes)

### Deployment URL

After first deployment, your site will be available at:
- **Production:** `https://ethiopian-today.vercel.app` (or your custom domain)
- **Preview:** `https://ethiopian-today-{branch}.vercel.app`

### Troubleshooting

**Build fails:**
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Check Vercel build logs

**Environment variables not working:**
1. Ensure variables are added in both GitHub Secrets AND Vercel
2. Redeploy after adding new variables

**Domain not working:**
1. Check DNS records are configured correctly
2. Wait for DNS propagation
3. Verify domain is added in Vercel

### Automatic Deployments

Every push to `main` will:
1. ✅ Run security checks
2. ✅ Build the project
3. ✅ Deploy to production automatically
4. ✅ Update your live site

Every pull request will:
1. ✅ Run CI checks
2. ✅ Create a preview deployment
3. ✅ Add deployment URL as comment

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

## Deployment Checklist

Before deploying:
- [ ] All environment variables added to GitHub Secrets
- [ ] All environment variables added to Vercel
- [ ] AdSense code verified
- [ ] Security tokens are strong (32+ characters)
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] Database directory exists: `mkdir -p data`
- [ ] Public assets exist: `official-rates.json`, `parallel-rates.json`

## Post-Deployment

After successful deployment:
1. Test all features on production
2. Submit site to Google AdSense
3. Set up Google Analytics
4. Configure custom domain
5. Monitor error logs in Vercel dashboard

## Continuous Deployment

Your workflow is now:
```
Code Change → Git Push → GitHub Actions → Build & Test → Deploy to Vercel → Live! 🚀
```

No manual steps needed - just push your code!
