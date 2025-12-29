# Installation Guide - Trustbit Advance Search

## Prerequisites

- ERPNext instance (version 13 or higher)
- Bench CLI installed
- Access to your bench directory

## Installation Steps

### Method 1: Install from Local Directory (Recommended for Development)

1. Navigate to your bench directory:
```bash
cd ~/frappe-bench
```

2. Get the app from local directory:
```bash
bench get-app /path/to/trustbit_advance_search
```

Or if you have this as a git repository:
```bash
bench get-app https://github.com/yourusername/trustbit_advance_search
```

3. Install the app on your site:
```bash
bench --site your-site-name install-app trustbit_advance_search
```

4. Clear cache and rebuild:
```bash
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search
```

5. Restart bench:
```bash
bench restart
```

### Method 2: Manual Installation

If you want to manually install without using bench commands:

1. Copy the `trustbit_advance_search` folder to your bench's `apps` directory:
```bash
cp -r trustbit_advance_search ~/frappe-bench/apps/
```

2. Add the app to your site's `apps.txt`:
```bash
cd ~/frappe-bench/sites/your-site-name
echo "trustbit_advance_search" >> apps.txt
```

3. Install dependencies and migrate:
```bash
cd ~/frappe-bench
bench setup requirements
bench --site your-site-name migrate
```

4. Build assets:
```bash
bench build --app trustbit_advance_search
```

5. Clear cache and restart:
```bash
bench --site your-site-name clear-cache
bench restart
```

## Verification

After installation, verify that the app is working:

1. Log in to your ERPNext instance
2. Open any Purchase Order
3. You should see two new buttons under "Actions":
   - "Quick Add (Ctrl+K)"
   - "Scan Barcode (Ctrl+B)"
4. Try pressing `Ctrl+K` - the search dialog should open

## Troubleshooting

### Buttons not appearing

If the buttons don't appear after installation:

```bash
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search --force
bench restart
```

Then hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)

### JavaScript errors in console

Check the browser console for errors. Make sure all JS files are properly loaded:
- trustbit_search_common.js
- purchase_order.js, purchase_invoice.js, etc.

### Search not returning results

1. Make sure items exist in your database
2. Check that items are not disabled
3. Ensure barcodes are properly configured in Item master (for barcode search)

### Permission errors

Make sure your role has permission to:
- Read Item master
- Create/modify Purchase Orders, Sales Orders, etc.

## Updating the App

To update the app after making changes:

```bash
cd ~/frappe-bench/apps/trustbit_advance_search
git pull  # if using git

cd ~/frappe-bench
bench --site your-site-name migrate
bench build --app trustbit_advance_search
bench --site your-site-name clear-cache
bench restart
```

## Uninstallation

To remove the app:

```bash
bench --site your-site-name uninstall-app trustbit_advance_search
bench remove-app trustbit_advance_search
```

## Next Steps

After successful installation, refer to [USAGE.md](USAGE.md) for detailed usage instructions.
