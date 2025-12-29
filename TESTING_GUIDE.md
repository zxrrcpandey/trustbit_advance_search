# Testing Guide - Trustbit Advance Search

## 🧪 How to Test This App

This guide will help you test the Trustbit Advance Search app before and after installation.

---

## ✅ Pre-Installation Checks

### 1. Verify File Structure

```bash
cd "/Users/warroom/Trustbit Software/Trustbit Apps/Projects/Trustbit Advance Search"

# Check all files are present
find . -type f -not -path "./.claude/*" | wc -l
# Should show: 25 files

# Check Python files
find . -name "*.py" -not -path "./.claude/*"
# Should show 8 Python files

# Check JavaScript files
find . -name "*.js" -not -path "./.claude/*"
# Should show 6 JavaScript files
```

### 2. Verify Configuration Files

```bash
# Check hooks.py has doctype_js configured
grep -A 7 "doctype_js = {" trustbit_advance_search/hooks.py

# Check app version
cat trustbit_advance_search/__init__.py

# Check setup.py
cat setup.py
```

### 3. Check Code Syntax (Optional)

```bash
# Install Python syntax checker (if not already installed)
pip install pyflakes

# Check Python files for syntax errors
find . -name "*.py" -exec pyflakes {} \;

# For JavaScript, you can use Node.js if installed
# node -c trustbit_advance_search/public/js/*.js
```

---

## 🚀 Installation Testing

### Step 1: Find Your Bench Directory

```bash
# Common locations:
ls ~/frappe-bench
# or
ls /home/frappe/frappe-bench
# or
which bench  # This tells you where bench is installed
```

### Step 2: Install the App

```bash
# Navigate to your bench
cd ~/frappe-bench

# List your sites
bench --site all list-apps

# Get the app (use full path)
bench get-app "/Users/warroom/Trustbit Software/Trustbit Apps/Projects/Trustbit Advance Search"

# Verify app is in apps folder
ls apps/ | grep trustbit
```

### Step 3: Install on Site

```bash
# Replace 'your-site-name' with your actual site name
# (You can find it by running: ls sites/)

bench --site your-site-name install-app trustbit_advance_search

# You should see:
# - Installing trustbit_advance_search...
# - Installed
```

### Step 4: Build and Restart

```bash
# Clear cache
bench --site your-site-name clear-cache

# Build assets
bench build --app trustbit_advance_search

# Restart
bench restart
```

### Step 5: Verify Installation

```bash
# Check if app is installed
bench --site your-site-name list-apps

# Should show:
# frappe
# erpnext
# trustbit_advance_search
```

---

## 🧪 Functional Testing

### Test 1: Visual Check

1. **Login to ERPNext**
   - Open your browser
   - Go to your ERPNext site
   - Login with your credentials

2. **Open Purchase Order**
   - Go to: **Buying → Purchase Order**
   - Click **New**

3. **Check for New Buttons**
   - Look in the toolbar
   - You should see **Actions** dropdown
   - Click it, you should see:
     - ✅ "Quick Add (Ctrl+K)" (in blue/primary color)
     - ✅ "Scan Barcode (Ctrl+B)"

4. **Check Console**
   - Press F12 to open browser console
   - Look for: `Trustbit Advance Search Loaded for Purchase Order`
   - No errors should appear

### Test 2: Quick Search (Ctrl+K)

1. **Open the Dialog**
   - Press `Ctrl+K` (or `Cmd+K` on Mac)
   - OR click "Quick Add (Ctrl+K)" button

2. **Verify Dialog Opened**
   - Dialog title: "🔍 Trustbit Advance Search - Purchase Order"
   - Search field should be focused
   - You should see placeholder text

3. **Test Search**
   - Type a partial item name (e.g., "steel")
   - Wait for results (auto-search after 500ms)
   - Results should appear in a table

4. **Test Item Selection**
   - Click on any item row
   - Item details should populate
   - Rate should auto-fill (if price list exists)

5. **Test Adding Item**
   - Adjust quantity
   - Click "✓ Add to Purchase Order"
   - Dialog closes
   - Item should appear in the items table

### Test 3: Barcode Scanner (Ctrl+B)

1. **Open Barcode Dialog**
   - Press `Ctrl+B`
   - OR click "Scan Barcode (Ctrl+B)" button

2. **Verify Dialog**
   - Title: "📦 Scan Barcode - Trustbit Advance Search"
   - Barcode field should be focused

3. **Test Barcode Search** (if you have barcodes configured)
   - Type a barcode
   - Press Enter
   - Item should be found and displayed

4. **Test Item Not Found**
   - Type a non-existent barcode: "NOTFOUND123"
   - Press Enter
   - Should show "Item Not Found" message

### Test 4: Test All Doctypes

Repeat Tests 2 & 3 for:
- ✅ Purchase Order
- ✅ Purchase Invoice (Accounts → Purchase Invoice → New)
- ✅ Sales Order (Selling → Sales Order → New)
- ✅ Sales Invoice (Accounts → Sales Invoice → New)
- ✅ Material Request (Stock → Material Request → New)

### Test 5: Keyboard Shortcuts

1. **Test Ctrl+K in each doctype**
   - Should open Quick Search dialog
   - Search should work

2. **Test Ctrl+B in each doctype**
   - Should open Barcode dialog
   - Barcode search should work

3. **Test Esc**
   - Opens any dialog
   - Press Esc
   - Dialog should close

### Test 6: Search Functionality

1. **Fuzzy Search Test**
   - Search for: "steel pipe"
   - Should match: "Pipe Steel", "Steel Round Pipe", etc.

2. **Word Order Test**
   - Search for: "pipe steel"
   - Should return same results as "steel pipe"

3. **Partial Word Test**
   - Search for: "stee pip"
   - Should still find "Steel Pipe"

4. **Minimum Characters**
   - Type only 1 character
   - Should not search yet
   - Type 2nd character
   - Should auto-search

### Test 7: Pricing Test

1. **With Supplier Selected**
   - Create new Purchase Order
   - Select a Supplier
   - Search for item
   - Rate should reflect supplier's price (if configured)

2. **Without Supplier**
   - Create new Purchase Order
   - Don't select supplier
   - Search for item
   - Rate should be standard rate

3. **For Sales**
   - Create Sales Order
   - Select Customer
   - Search for item
   - Rate should reflect customer/selling price

---

## 🐛 Troubleshooting Tests

### Test 1: Cache Issues

If buttons don't appear:
```bash
# Clear browser cache
# Hard refresh: Ctrl+F5 or Cmd+Shift+R

# Clear server cache
bench --site your-site-name clear-cache

# Rebuild
bench build --app trustbit_advance_search --force

# Restart
bench restart
```

### Test 2: JavaScript Errors

Open browser console (F12) and check for:
- ❌ Red errors
- ⚠️ Yellow warnings

Common issues:
1. "trustbit_advance_search is not defined"
   - Solution: Rebuild and hard refresh

2. "frappe.call is not a function"
   - Solution: Check if ERPNext is loaded properly

3. "Cannot read property of undefined"
   - Solution: Check console for missing variables

### Test 3: API Errors

If search doesn't work:
```bash
# Check error log
bench --site your-site-name console

# In console, run:
import frappe
frappe.get_doc('Error Log', {'error': ['like', '%trustbit%']})
```

### Test 4: Permission Issues

If you see "Permission Denied":
1. Go to: **Setup → Role Permissions Manager**
2. Select "Item" doctype
3. Make sure your role has "Read" permission
4. Try again

---

## 📊 Test Results Checklist

### Installation
- [ ] App appears in `bench --site sitename list-apps`
- [ ] No errors during installation
- [ ] Bench restart successful
- [ ] Build completed without errors

### UI Elements
- [ ] Buttons appear in Purchase Order
- [ ] Buttons appear in Purchase Invoice
- [ ] Buttons appear in Sales Order
- [ ] Buttons appear in Sales Invoice
- [ ] Buttons appear in Material Request
- [ ] Buttons are in correct location (Actions menu)
- [ ] Primary button is highlighted (blue)

### Quick Search (Ctrl+K)
- [ ] Keyboard shortcut works
- [ ] Button click works
- [ ] Dialog opens correctly
- [ ] Search field auto-focuses
- [ ] Auto-search works (500ms delay)
- [ ] Results display in table
- [ ] Item selection works
- [ ] Item details populate
- [ ] Pricing works correctly
- [ ] "Add to Document" works
- [ ] "Add & Continue" works
- [ ] Dialog resets after "Add & Continue"

### Barcode Scanner (Ctrl+B)
- [ ] Keyboard shortcut works
- [ ] Button click works
- [ ] Dialog opens correctly
- [ ] Barcode field auto-focuses
- [ ] Barcode search works
- [ ] Item found message appears
- [ ] Item not found message appears
- [ ] Quantity entry works
- [ ] Add to document works
- [ ] Dialog resets after add

### Search Features
- [ ] Fuzzy search works
- [ ] Word order doesn't matter
- [ ] Partial words work
- [ ] Minimum 2 characters enforced
- [ ] Item group searchable
- [ ] Description searchable
- [ ] Barcode searchable

### Pricing
- [ ] Standard rate loads
- [ ] Supplier price loads (PO/PI)
- [ ] Customer price loads (SO/SI)
- [ ] Price list respected
- [ ] Manual rate entry works
- [ ] Amount calculation works

### Edge Cases
- [ ] Works with disabled items (should exclude)
- [ ] Works with template items (should exclude)
- [ ] Works with no results
- [ ] Works with many results (50+)
- [ ] Works with special characters in search
- [ ] Works with very long item names

---

## 🎯 Quick Test Script

Run this quick test to verify basic functionality:

```bash
# 1. Check files
cd "/Users/warroom/Trustbit Software/Trustbit Apps/Projects/Trustbit Advance Search"
find . -name "*.py" -o -name "*.js" | grep -v ".claude" | wc -l
# Should output: 14

# 2. Check syntax
grep -r "frappe.whitelist" trustbit_advance_search/
# Should show 4 whitelisted functions

# 3. Check hooks
grep "doctype_js" trustbit_advance_search/hooks.py
# Should show all 5 doctypes
```

---

## 📝 Test Report Template

After testing, document your results:

```
TRUSTBIT ADVANCE SEARCH - TEST REPORT
Date: ___________
Tester: ___________
ERPNext Version: ___________

INSTALLATION
- App installed: ☐ YES ☐ NO
- Build successful: ☐ YES ☐ NO
- No errors: ☐ YES ☐ NO

FUNCTIONALITY
Purchase Order:
- Ctrl+K works: ☐ YES ☐ NO
- Ctrl+B works: ☐ YES ☐ NO
- Search works: ☐ YES ☐ NO
- Add item works: ☐ YES ☐ NO

Purchase Invoice:
- Ctrl+K works: ☐ YES ☐ NO
- Ctrl+B works: ☐ YES ☐ NO

Sales Order:
- Ctrl+K works: ☐ YES ☐ NO
- Ctrl+B works: ☐ YES ☐ NO

Sales Invoice:
- Ctrl+K works: ☐ YES ☐ NO
- Ctrl+B works: ☐ YES ☐ NO

Material Request:
- Ctrl+K works: ☐ YES ☐ NO
- Ctrl+B works: ☐ YES ☐ NO

ISSUES FOUND:
1. ___________________
2. ___________________

OVERALL RESULT: ☐ PASS ☐ FAIL
```

---

## 🔧 Developer Testing

If you want to test code changes:

```bash
# Make changes to JavaScript
nano trustbit_advance_search/public/js/trustbit_search_common.js

# Rebuild
bench build --app trustbit_advance_search

# Clear cache
bench --site sitename clear-cache

# Hard refresh browser (Ctrl+F5)
```

For Python changes:
```bash
# Make changes
nano trustbit_advance_search/api/item_search.py

# Restart (rebuilding not needed for Python)
bench restart

# Test API directly
bench --site sitename console
>>> from trustbit_advance_search.api.item_search import fuzzy_search_items
>>> fuzzy_search_items("steel", 10)
```

---

## ✅ Success Criteria

The app is working correctly if:

1. ✅ All 5 doctypes show the buttons
2. ✅ Keyboard shortcuts work in all doctypes
3. ✅ Quick Search dialog opens and searches
4. ✅ Barcode dialog opens and scans
5. ✅ Items can be added to documents
6. ✅ Pricing is fetched correctly
7. ✅ No JavaScript errors in console
8. ✅ No Python errors in error log

---

## 🆘 Need Help?

If tests fail:
1. Check [INSTALLATION.md](INSTALLATION.md) troubleshooting section
2. Review browser console for errors
3. Check ERPNext error log
4. Verify bench version compatibility
5. Make sure ERPNext version is 13+

---

**Happy Testing! 🎉**
