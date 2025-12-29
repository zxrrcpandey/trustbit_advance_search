# Trustbit Advance Search - Quick Start Guide

## 🚀 What is this?

Trustbit Advance Search is a powerful ERPNext app that makes adding items to documents super fast and easy using:
- **Intelligent Search** (Ctrl+K): Find items with fuzzy matching
- **Barcode Scanner** (Ctrl+B): Scan barcodes directly into documents

## ⚡ Quick Installation

```bash
# Navigate to your bench directory
cd ~/frappe-bench

# Get the app (choose one method):
# Method 1: From local path
bench get-app /path/to/trustbit_advance_search

# Method 2: From git repository
bench get-app https://github.com/yourusername/trustbit_advance_search

# Install on your site
bench --site your-site-name install-app trustbit_advance_search

# Clear cache and rebuild
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search
bench restart
```

## ✅ Verify Installation

1. Open ERPNext
2. Go to any Purchase Order
3. Look for new buttons under "Actions":
   - **Quick Add (Ctrl+K)**
   - **Scan Barcode (Ctrl+B)**
4. Press `Ctrl+K` - dialog should open!

## 🎯 Supported Documents

- ✅ Purchase Order
- ✅ Purchase Invoice
- ✅ Sales Order
- ✅ Sales Invoice
- ✅ Material Request

## 📖 Basic Usage

### Quick Search (Ctrl+K)

1. **Open** any supported document
2. **Press** `Ctrl+K` (or click Quick Add button)
3. **Type** item name (words in any order!)
   - Example: "steel pipe" finds "Pipe Steel 2 inch"
4. **Click** on item to select
5. **Adjust** quantity and rate
6. **Click** "Add to Document"

### Barcode Scanner (Ctrl+B)

1. **Open** any supported document
2. **Press** `Ctrl+B` (or click Scan Barcode button)
3. **Scan** barcode or type manually
4. **Enter** quantity
5. **Click** "Add to Document"
6. Repeat for next item!

## ⚙️ Quick Configuration

### Step 1: Add Barcodes to Items

```
Stock → Item → [Select Item]
↓
Scroll to "Barcodes" section
↓
Click "Add Row"
↓
Enter barcode
↓
Save
```

### Step 2: Set Up Price Lists

For better pricing:
1. Go to **Stock → Item Price**
2. Create entries for your items
3. Select appropriate Price List
4. Set rate
5. Save

### Step 3: Before Using

When creating new document:
1. ✅ Select Supplier/Customer
2. ✅ Set Price List (auto-filled usually)
3. ✅ Set "Set Warehouse" for default warehouse
4. Now you're ready to use Ctrl+K or Ctrl+B!

## 🎓 Pro Tips

1. **Fuzzy Search**: Words can be in any order
   - "blue widget small" = "Small Blue Widget"

2. **Add Multiple Items**: Use "Add & Continue" button

3. **Keyboard Workflow**:
   - `Ctrl+K` → Type → Enter → Tab → Enter
   - Super fast!

4. **Barcode Workflow**:
   - `Ctrl+B` → Scan → Qty → Enter → Scan next
   - Perfect for physical inventory!

5. **Mixed Mode**: Use Ctrl+K and scan barcode in search field
   - Best of both worlds!

## 📚 Full Documentation

- [Installation Guide](INSTALLATION.md) - Detailed installation steps
- [Usage Guide](USAGE.md) - Complete usage instructions
- [Configuration Guide](CONFIGURATION.md) - Advanced configuration
- [README](README.md) - Full feature list

## 🆘 Troubleshooting

### Buttons not showing?
```bash
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search --force
bench restart
# Then hard refresh browser (Ctrl+F5)
```

### Search not working?
- Check if items exist and are not disabled
- Make sure you typed at least 2 characters
- Try different search terms

### Barcode not working?
- Verify barcode exists in Item → Barcodes section
- Test by typing barcode manually
- Check if scanner is adding "Enter" key

## 💡 Common Use Cases

### Use Case 1: Processing Purchase Orders
```
1. Open new PO
2. Select Supplier
3. Press Ctrl+K
4. Search each item
5. Use "Add & Continue" for multiple items
6. Done!
```

### Use Case 2: Point of Sale with Barcodes
```
1. Open new Sales Invoice
2. Select Customer
3. Press Ctrl+B
4. Scan items one by one
5. Each scan adds to invoice
6. Quick checkout!
```

### Use Case 3: Material Request
```
1. Open new Material Request
2. Press Ctrl+K
3. Type item name
4. Set quantity
5. Add & Continue for more items
6. Submit!
```

## 🎉 You're Ready!

Start using Trustbit Advance Search and enjoy faster document entry!

**Questions?** Check the full documentation in the docs folder.

**Issues?** Create an issue on GitHub or contact support.

---

**Made with ❤️ by Trustbit**
