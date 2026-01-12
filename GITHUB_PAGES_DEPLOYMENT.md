# GitHub Pages Deployment Guide

## NOVA Landing Page Deployment Instructions

This guide explains how to deploy the NOVA landing page to GitHub Pages.

### What's Been Created

✅ **index.html** - Production-ready landing page for RideWire's NOVA service
- Professional purple gradient design
- 5 AI models showcase (Claude, GPT, Gemini, Perplexity, Synthesis AI)
- 3-tier pricing structure ($10K Standard, $15K Rush, $20K Emergency)
- Responsive mobile-friendly design
- Contact integration via mailto links

### Deployment Steps

#### Option 1: Deploy to STEPHENIESGEM.github.io

The simplest way to deploy this page is to create a separate repository:

1. **Create a new repository** named `STEPHENIESGEM.github.io` on GitHub
   - Go to https://github.com/new
   - Repository name: `STEPHENIESGEM.github.io`
   - Make it Public
   - Check "Add a README file"

2. **Add the index.html file**
   - Click "Add file" → "Create new file"
   - Name it `index.html`
   - Copy the contents from this repo's `index.html`
   - Commit the file

3. **Access your site**
   - Your site will be live at: https://stepheniesgem.github.io
   - It may take 1-2 minutes to deploy

#### Option 2: Deploy from This Repository

If you want to deploy directly from this repository:

1. **Go to Settings** in this repository
2. **Click "Pages"** in the left sidebar
3. **Under "Source"**, select:
   - Branch: `copilot/create-repo-for-nova` (or `main`)
   - Folder: `/ (root)`
4. **Click "Save"**
5. **Your site will be at**: https://stepheniesgem.github.io/ridewire-ai-hub

### Custom Domain Setup (ridewire.tech)

To use the custom domain `ridewire.tech`:

#### In GitHub:
1. Go to repository Settings → Pages
2. Under "Custom domain", enter: `ridewire.tech`
3. Click "Save"
4. Check "Enforce HTTPS" (after DNS propagates)

#### In Hostinger (or your DNS provider):
Add these DNS records:

**A Records** (for apex domain):
```
Type: A    Name: @    Points to: 185.199.108.153
Type: A    Name: @    Points to: 185.199.109.153
Type: A    Name: @    Points to: 185.199.110.153
Type: A    Name: @    Points to: 185.199.111.153
```

**CNAME Record** (for www subdomain):
```
Type: CNAME    Name: www    Points to: stepheniesgem.github.io
```

**Note**: DNS changes can take 30-60 minutes to propagate globally.

### Verification

Once deployed, verify these elements are working:

- ✅ Header displays "RIDEWIRE.TECH" with purple gradient
- ✅ CTA buttons open email client with pre-filled subject
- ✅ All 5 AI model cards are visible
- ✅ Pricing tiers display correctly
- ✅ Footer links are clickable
- ✅ Page is responsive on mobile devices

### Email Setup

All mailto links point to: **hello@ridewire.tech**

Make sure this email account is set up and monitored to receive:
- Customer inquiries
- Sample requests
- Pricing questions

### Next Steps

After deployment:
1. Test all email links work correctly
2. Verify the page displays properly on mobile
3. Check DNS propagation: https://www.whatsmydns.net/#A/ridewire.tech
4. Monitor email inbox for customer inquiries
5. Consider setting up analytics (Google Analytics, Plausible, etc.)

### Troubleshooting

**Issue**: Page not showing after deployment
- **Solution**: Wait 2-3 minutes, clear browser cache, check repository Settings → Pages

**Issue**: Custom domain not working
- **Solution**: Verify DNS records are correct, wait for propagation (up to 48 hours)

**Issue**: HTTPS not working
- **Solution**: After DNS propagates, enable "Enforce HTTPS" in GitHub Pages settings

**Issue**: Email links not opening
- **Solution**: Ensure a default email client is configured in your browser/OS

---

## File Structure

```
ridewire-ai-hub/
├── index.html                      # NOVA landing page (GitHub Pages)
├── README.md                       # Main project documentation
├── GITHUB_PAGES_DEPLOYMENT.md      # This file
├── frontend/                       # React dashboard (separate from landing page)
├── server.js                       # Backend server (not used for static site)
└── ...other files
```

**Note**: The `index.html` is a standalone static page designed for GitHub Pages. It's separate from the React dashboard in the `frontend/` folder.

---

## Support

For questions about deployment:
- Open an issue in this repository
- Contact: hello@ridewire.tech
- Check GitHub Pages documentation: https://docs.github.com/en/pages

---

**Last Updated**: December 30, 2024
