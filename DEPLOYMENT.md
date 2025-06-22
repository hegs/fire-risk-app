# 🚀 Deployment Guide - Fire Risk Lookup Web App

This guide covers multiple deployment options for your Fire Risk Lookup Web App.

## 📋 Pre-Deployment Checklist

✅ **Project Structure Verified**
- `index.html` - Main entry point
- `src/` - All source files
- `README.md` - Documentation
- `.gitignore` - Git configuration

✅ **Dependencies**
- No build process required (pure HTML/CSS/JS)
- All external libraries loaded via CDN (Leaflet.js)
- No server-side dependencies for production

## 🌐 Deployment Options

### Option 1: Netlify (Recommended - Easiest)

#### Method A: Drag & Drop
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag your entire `fire-risk-app` folder to the deploy area
3. Your site is live instantly!
4. Customize your URL (e.g., `fire-risk-lookup.netlify.app`)

#### Method B: Git Integration
```bash
# Push to GitHub first
git remote add origin https://github.com/yourusername/fire-risk-app.git
git push -u origin main

# Then connect to Netlify
# 1. Go to Netlify dashboard
# 2. Click "New site from Git"
# 3. Connect your GitHub repository
# 4. Deploy settings: Build command (leave empty), Publish directory (leave as root)
```

**Pros:** Free, automatic HTTPS, custom domains, instant deployment

### Option 2: Vercel (Also Excellent)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
cd /Users/dhegarty/Cursor\ Apps/fire-risk-app
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? fire-risk-app
# - Directory? ./
# - Override settings? N
```

**Pros:** Free tier, excellent performance, automatic deployments

### Option 3: GitHub Pages (Free)

```bash
# 1. Push to GitHub
git remote add origin https://github.com/yourusername/fire-risk-app.git
git push -u origin main

# 2. Enable GitHub Pages
# Go to repository Settings > Pages
# Source: Deploy from a branch
# Branch: main
# Folder: / (root)
# Save

# 3. Your site will be available at:
# https://yourusername.github.io/fire-risk-app/
```

### Option 4: AWS S3 + CloudFront (Production)

```bash
# 1. Create S3 bucket
aws s3 mb s3://fire-risk-app

# 2. Enable static website hosting
aws s3 website s3://fire-risk-app --index-document index.html

# 3. Upload files
aws s3 sync . s3://fire-risk-app --exclude ".git/*" --exclude "*.pyc" --exclude "__pycache__/*"

# 4. Set bucket policy for public read access
# 5. Configure CloudFront for CDN
```

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. Add custom domain in your hosting platform
3. Update DNS records as instructed

### Environment Variables (If Needed)
Your app doesn't require environment variables as it uses public APIs.

## 🧪 Testing Your Deployment

After deployment, test these features:
- [ ] Address validation works
- [ ] Geocoding returns results
- [ ] Fire risk API queries successfully
- [ ] Map displays correctly
- [ ] Responsive design on mobile

## 📊 Performance Optimization

Your app is already optimized:
- ✅ Minimal dependencies
- ✅ CDN-loaded libraries
- ✅ No build process
- ✅ Efficient API calls

## 🔒 Security Considerations

- ✅ No sensitive data stored
- ✅ Uses public APIs only
- ✅ No server-side code in production
- ✅ CORS handled by APIs

## 🆘 Troubleshooting

### Common Issues:
1. **CORS errors**: Shouldn't occur as APIs support CORS
2. **Map not loading**: Check Leaflet.js CDN availability
3. **API failures**: Verify CAL FIRE API is accessible

### Support:
- Check browser console for errors
- Verify all files uploaded correctly
- Test with different addresses

## 🎉 Success!

Once deployed, your Fire Risk Lookup Web App will be accessible to users worldwide, providing valuable fire risk information for California addresses.

**Recommended Next Steps:**
1. Set up monitoring (optional)
2. Add analytics (optional)
3. Create user documentation
4. Plan for future enhancements 