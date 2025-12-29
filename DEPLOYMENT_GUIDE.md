# Deployment Guide - GitHub to Server

This guide will help you deploy the Trustbit Advance Search app to GitHub and then install it on your ERPNext server.

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Git installed on your Mac
- [ ] Access to your ERPNext server (SSH)
- [ ] ERPNext version 13 or higher on server

---

## Part 1: Deploy to GitHub

### Step 1: Initialize Git Repository

Open Terminal and navigate to your project:

```bash
cd "/Users/warroom/Trustbit Software/Trustbit Apps/Projects/Trustbit Advance Search"

# Initialize git repository
git init

# Check status
git status
```

### Step 2: Create Initial Commit

```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: Trustbit Advance Search v0.0.1

- Added fuzzy search functionality
- Added barcode scanner support
- Support for Purchase Order, Purchase Invoice, Sales Order, Sales Invoice, Material Request
- Keyboard shortcuts Ctrl+K and Ctrl+B
- Complete documentation"

# Verify commit
git log
```

### Step 3: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Login** to your account
3. **Click** the `+` icon in top-right corner
4. **Select** "New repository"
5. **Fill in details**:
   - Repository name: `trustbit_advance_search`
   - Description: `Advanced item search with barcode support for ERPNext`
   - Visibility: `Public` or `Private` (your choice)
   - **DO NOT** initialize with README (we already have one)
   - **DO NOT** add .gitignore (we already have one)
   - **DO NOT** add license (we already have one)
6. **Click** "Create repository"

### Step 4: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/trustbit_advance_search.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

### Step 5: Verify Upload

1. **Refresh** your GitHub repository page
2. **Check** that all files are uploaded
3. **Verify** README.md is displayed nicely

**Your repository URL will be**: `https://github.com/YOUR_USERNAME/trustbit_advance_search`

---

## Part 2: Install on ERPNext Server

### Step 1: Connect to Your Server

```bash
# From your Mac, SSH into your server
ssh your-username@your-server-ip

# Example:
# ssh frappe@192.168.1.100
# or
# ssh frappe@erpnext.yourcompany.com
```

### Step 2: Navigate to Bench Directory

```bash
# Find your bench directory
cd ~/frappe-bench

# If not there, try:
# cd /home/frappe/frappe-bench
# or
# cd /opt/bench/frappe-bench

# Verify you're in the right place
ls
# Should see: apps, sites, env, config, logs, etc.
```

### Step 3: Get the App from GitHub

```bash
# Get the app (replace YOUR_USERNAME)
bench get-app https://github.com/YOUR_USERNAME/trustbit_advance_search.git

# You should see:
# Getting trustbit_advance_search
# Cloning into 'trustbit_advance_search'...
# Installing trustbit_advance_search
```

**If you get permission errors**:
```bash
# Try with sudo
sudo -H bench get-app https://github.com/YOUR_USERNAME/trustbit_advance_search.git
```

### Step 4: Verify App is Downloaded

```bash
# Check apps folder
ls apps/

# You should see trustbit_advance_search in the list

# Verify files
ls apps/trustbit_advance_search/
```

### Step 5: Install on Your Site

```bash
# List your sites
ls sites/

# Install on your site (replace 'site1.local' with your site name)
bench --site site1.local install-app trustbit_advance_search

# You should see:
# Installing trustbit_advance_search...
# Installed
```

**Common site names**:
- `site1.local`
- `erpnext.yourcompany.com`
- `localhost`

**To find your site name**:
```bash
ls sites/ | grep -v assets | grep -v common_site_config.json
```

### Step 6: Build Assets

```bash
# Build the app assets
bench build --app trustbit_advance_search

# This will compile JavaScript and CSS
# Wait for it to complete (may take 1-2 minutes)
```

### Step 7: Clear Cache and Restart

```bash
# Clear cache
bench --site site1.local clear-cache

# Restart bench
bench restart

# If bench restart doesn't work, try:
sudo supervisorctl restart all
# or
sudo systemctl restart nginx
sudo service supervisor restart
```

### Step 8: Verify Installation

```bash
# Check if app is installed
bench --site site1.local list-apps

# You should see:
# frappe
# erpnext
# trustbit_advance_search
```

---

## Part 3: Test on Server

### Step 1: Open ERPNext in Browser

1. Open your browser
2. Go to your ERPNext URL: `http://your-server-ip` or `https://erpnext.yourcompany.com`
3. Login with your credentials

### Step 2: Test Purchase Order

1. **Go to**: Buying → Purchase Order
2. **Click**: New
3. **Look for**: New buttons in the form
   - You should see "Actions" dropdown
   - Click it and look for:
     - ✅ "Quick Add (Ctrl+K)"
     - ✅ "Scan Barcode (Ctrl+B)"

### Step 3: Test Quick Search

1. **Press**: `Ctrl+K` (or `Cmd+K` on Mac)
2. **Dialog should open**: "🔍 Trustbit Advance Search"
3. **Type**: Any item name (e.g., "steel")
4. **Results should appear**: In a table
5. **Click**: On any item
6. **Item details should load**
7. **Click**: "Add to Purchase Order"
8. **Item should be added** to the items table

### Step 4: Test Barcode Scanner

1. **Press**: `Ctrl+B`
2. **Dialog should open**: "📦 Scan Barcode"
3. **Type a barcode**: (if you have items with barcodes)
4. **Press**: Enter
5. **Item should be found** (if barcode exists)

### Step 5: Test Other Doctypes

Repeat Steps 2-4 for:
- ✅ Purchase Invoice
- ✅ Sales Order
- ✅ Sales Invoice
- ✅ Material Request

---

## Part 4: Troubleshooting

### Issue 1: Buttons Not Showing

**Solution**:
```bash
# SSH to server
ssh your-username@your-server-ip

# Navigate to bench
cd ~/frappe-bench

# Clear cache
bench --site site1.local clear-cache

# Rebuild with force
bench build --app trustbit_advance_search --force

# Restart
bench restart
```

Then in browser:
- Hard refresh: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

### Issue 2: JavaScript Errors

**Check console**:
1. Press `F12` in browser
2. Go to "Console" tab
3. Look for red errors

**If you see errors**:
```bash
# On server
cd ~/frappe-bench

# Rebuild
bench build --app trustbit_advance_search

# Clear cache
bench --site site1.local clear-cache

# Restart
bench restart
```

### Issue 3: "App not found" Error

**Solution**:
```bash
# Make sure you're in bench directory
cd ~/frappe-bench

# Try getting app again
bench get-app https://github.com/YOUR_USERNAME/trustbit_advance_search.git

# If error persists, check GitHub URL is correct
```

### Issue 4: Permission Denied

**Solution**:
```bash
# Fix permissions
cd ~/frappe-bench
sudo chown -R frappe:frappe apps/trustbit_advance_search

# Or if your user is different:
sudo chown -R $(whoami):$(whoami) apps/trustbit_advance_search

# Try installation again
bench --site site1.local install-app trustbit_advance_search
```

### Issue 5: Search Not Working

**Check**:
1. Make sure you have items in your database
2. Items should not be disabled
3. Items should not be templates

**Test API**:
```bash
# On server
cd ~/frappe-bench
bench --site site1.local console

# In console:
from trustbit_advance_search.api.item_search import fuzzy_search_items
fuzzy_search_items("test", 10)
# Should return list of items
```

### Issue 6: Build Fails

**Solution**:
```bash
# Check Node.js version
node --version
# Should be 14+ or 16+

# If build fails, try:
bench setup requirements

# Then build again
bench build --app trustbit_advance_search
```

---

## Part 5: Updating the App

### When You Make Changes

**On Your Mac**:
```bash
cd "/Users/warroom/Trustbit Software/Trustbit Apps/Projects/Trustbit Advance Search"

# Make your changes to files

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

**On Server**:
```bash
# SSH to server
ssh your-username@your-server-ip

# Navigate to app
cd ~/frappe-bench/apps/trustbit_advance_search

# Pull latest changes
git pull origin main

# Go back to bench
cd ~/frappe-bench

# Migrate (if database changes)
bench --site site1.local migrate

# Build
bench build --app trustbit_advance_search

# Clear cache
bench --site site1.local clear-cache

# Restart
bench restart
```

---

## Part 6: Complete Checklist

### GitHub Deployment ✅
- [ ] Git initialized
- [ ] Initial commit created
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

### Server Installation ✅
- [ ] SSH access to server works
- [ ] Bench directory located
- [ ] App downloaded from GitHub
- [ ] App installed on site
- [ ] Assets built successfully
- [ ] Cache cleared
- [ ] Server restarted

### Testing ✅
- [ ] Can access ERPNext in browser
- [ ] Buttons appear in Purchase Order
- [ ] Ctrl+K opens Quick Search
- [ ] Ctrl+B opens Barcode Scanner
- [ ] Search returns results
- [ ] Can add items to documents
- [ ] Tested all 5 doctypes
- [ ] No JavaScript errors in console

---

## Quick Reference Commands

### GitHub
```bash
# Initial setup
git init
git add .
git commit -m "Message"
git remote add origin https://github.com/USERNAME/trustbit_advance_search.git
git push -u origin main

# Updates
git add .
git commit -m "Message"
git push origin main
```

### Server
```bash
# Installation
cd ~/frappe-bench
bench get-app https://github.com/USERNAME/trustbit_advance_search.git
bench --site sitename install-app trustbit_advance_search
bench build --app trustbit_advance_search
bench --site sitename clear-cache
bench restart

# Updates
cd ~/frappe-bench/apps/trustbit_advance_search
git pull origin main
cd ~/frappe-bench
bench build --app trustbit_advance_search
bench --site sitename clear-cache
bench restart

# Troubleshooting
bench --site sitename clear-cache
bench build --app trustbit_advance_search --force
bench restart
# Hard refresh browser: Ctrl+F5
```

---

## Support URLs

- **GitHub Repository**: https://github.com/YOUR_USERNAME/trustbit_advance_search
- **Documentation**: Check README.md in repository
- **Issues**: https://github.com/YOUR_USERNAME/trustbit_advance_search/issues

---

## Tips

1. **Keep GitHub URL handy**: You'll need it for installation on multiple servers
2. **Test locally first**: If you have local ERPNext, test there before production
3. **Use branches**: Create feature branches for new features
4. **Backup before update**: Always backup your site before updating apps
5. **Monitor logs**: Check error logs after installation

**Error Logs Location**:
```bash
# On server
tail -f ~/frappe-bench/logs/web.error.log
tail -f ~/frappe-bench/logs/worker.error.log
```

---

## Next Steps

After successful deployment:
1. ✅ Star your GitHub repository
2. ✅ Add a good README (already done!)
3. ✅ Configure barcodes in Item master
4. ✅ Set up price lists
5. ✅ Train users on Ctrl+K and Ctrl+B shortcuts
6. ✅ Gather feedback and improve

---

**Ready to Deploy? Follow the steps above! 🚀**
