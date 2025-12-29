# Usage Guide - Trustbit Advance Search

## Overview

Trustbit Advance Search provides two powerful ways to add items to your documents:

1. **Quick Search (Ctrl+K)**: Intelligent search with fuzzy matching
2. **Barcode Scanner (Ctrl+B)**: Direct barcode scanning

## Supported Documents

- Purchase Order
- Purchase Invoice
- Sales Order
- Sales Invoice
- Material Request

## Quick Search (Ctrl+K)

### Opening the Dialog

**Method 1: Keyboard Shortcut**
- Press `Ctrl+K` (or `Cmd+K` on Mac) while viewing any supported document

**Method 2: Button Click**
- Click "Quick Add (Ctrl+K)" button in the Actions menu

### Searching for Items

1. Type item name in the search field
   - Words can be in any order
   - Example: "steel pipe" finds "Pipe Steel 2 inch" and "Steel Round Pipe"
   - Minimum 2 characters required

2. Or scan a barcode
   - If the search matches a barcode, item is auto-selected

3. Results appear in a table showing:
   - Item Code
   - Item Name
   - Item Group
   - Barcode (if available)

### Selecting and Adding Items

1. Click "Select" button or click anywhere on the row
2. Item details auto-populate:
   - Item Code
   - Item Name
   - Stock UOM
   - Item Group
   - Current Rate (from price list or standard rate)

3. Adjust quantity and rate as needed
4. Set delivery/schedule date and warehouse if required
5. Click one of:
   - **"Add to Document"**: Adds item and closes dialog
   - **"Add & Continue"**: Adds item and lets you search for more

### Search Tips

- **Fuzzy Matching**: Type any words from the item name
  - "blue widget" matches "Widget Blue Large" and "Large Blue Widget"

- **Partial Matching**: Don't need to type full words
  - "stee pip" finds "Steel Pipe"

- **Item Group Search**: Search also looks in item groups
  - "raw materials" finds all items in that group

- **Description Search**: Searches item descriptions too
  - Useful for finding items by features

## Barcode Scanner (Ctrl+B)

### Opening the Barcode Dialog

**Method 1: Keyboard Shortcut**
- Press `Ctrl+B` (or `Cmd+B` on Mac)

**Method 2: Button Click**
- Click "Scan Barcode (Ctrl+B)" button in the Actions menu

### Scanning Items

1. **With Barcode Scanner**:
   - Focus is automatically in the barcode field
   - Scan the barcode
   - Item details appear instantly
   - Adjust quantity if needed
   - Press "Add to Document" or scan next item

2. **Manual Entry**:
   - Type barcode manually
   - Press Enter or wait 0.8 seconds
   - Item details appear if found

3. **Quick Workflow**:
   - Scan → Enter Qty → Click Add → Scan next
   - Perfect for processing multiple items quickly

### Barcode Configuration

Items must have barcodes configured in Item master:

1. Go to: **Stock → Item**
2. Open an item
3. Scroll to "Barcodes" section
4. Add one or more barcodes
5. Save

**Supported Formats**:
- Any alphanumeric barcode
- Case-insensitive matching
- Multiple barcodes per item supported

## Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open Quick Search Dialog |
| `Ctrl+B` / `Cmd+B` | Open Barcode Scanner Dialog |
| `Enter` | Search (in Quick Search) or Scan (in Barcode) |
| `Esc` | Close dialog |

## Pricing Logic

The app intelligently fetches prices based on:

### Purchase Documents (PO, PI)
1. Supplier-specific price from Item Price
2. Buying Price List configured in document
3. Standard Rate from Item master
4. Valuation Rate from Item master

### Sales Documents (SO, SI)
1. Customer-specific price from Item Price
2. Selling Price List configured in document
3. Standard Rate from Item master
4. Valuation Rate from Item master

### Material Request
1. Standard Rate from Item master
2. Valuation Rate from Item master

## Common Workflows

### Workflow 1: Creating Purchase Order from List

You have a list of items to purchase:

1. Open new Purchase Order
2. Select Supplier
3. Press `Ctrl+K`
4. Search first item → Select → Adjust qty/rate
5. Click "Add & Continue"
6. Repeat for all items
7. Close dialog when done
8. Review and submit PO

### Workflow 2: Quick Barcode Scanning

Processing items with barcodes:

1. Open new Sales Invoice
2. Select Customer
3. Press `Ctrl+B`
4. Scan item → Enter qty → Click "Add to Document"
5. Scan next item → Enter qty → Click "Add to Document"
6. Continue for all items
7. Review and submit invoice

### Workflow 3: Mixed Search and Scan

Some items have barcodes, some don't:

1. Press `Ctrl+K` for Quick Search
2. For items with barcode: scan in search field → auto-selects
3. For items without: type name → select from results
4. Use "Add & Continue" to process multiple items
5. Close dialog when complete

## Advanced Features

### Filtering Search Results

Currently showing top 50 matches. Results are ranked by:
1. Exact item code match
2. Item code starts with search
3. Item name contains search
4. Description/group contains search

### Multi-word Search

Search understands multiple words in any order:
- "red small widget" finds:
  - "Widget Small Red"
  - "Red Widget (Small)"
  - "Small Red Widgets"

### Auto-populated Fields

When you select an item, these fields auto-populate:
- Item Code
- Item Name
- UOM (from item master)
- Rate (from price list or item master)
- Schedule/Delivery Date (from document header)
- Warehouse (from Set Warehouse in document)

## Troubleshooting

### Item not found by barcode

**Possible causes**:
1. Barcode not configured in Item master
2. Barcode format mismatch
3. Item is disabled

**Solution**: Check Item master → Barcodes section

### Search returns no results

**Possible causes**:
1. Search text too short (min 2 characters)
2. No items match the search
3. All matching items are disabled or template items

**Solution**: Try different search terms or check item status

### Wrong price showing

**Possible causes**:
1. Price list not configured in document header
2. No price list entry for item
3. Wrong supplier/customer selected

**Solution**:
- Set correct price list in document
- Add item price entries
- Select correct supplier/customer before searching

### Keyboard shortcuts not working

**Possible causes**:
1. Browser extension intercepting shortcut
2. Focus is in an input field
3. Dialog is already open

**Solution**:
- Click on document body area first
- Close any open dialogs
- Try using button click instead

## Best Practices

1. **Configure Barcodes**: Add barcodes to all items for fastest entry
2. **Set Default Warehouses**: Use "Set Warehouse" in document header
3. **Configure Price Lists**: Maintain price lists for accurate pricing
4. **Use "Add & Continue"**: Process multiple items without closing dialog
5. **Keyboard Shortcuts**: Learn shortcuts for maximum efficiency

## Integration with ERPNext

The app integrates seamlessly with standard ERPNext:
- Uses standard Item Price logic
- Respects item permissions
- Honors disabled items
- Works with item variants (select specific variant)
- Supports all standard UOMs
- Respects stock settings

## Tips for Power Users

1. **Quick Entry**: `Ctrl+K` → Type → Enter → Tab → Tab → Enter
2. **Barcode Workflow**: `Ctrl+B` → Scan → Qty → Enter → Scan
3. **Search Shortcuts**: Use item group names to filter by category
4. **Price Override**: Rates are editable after item selection
5. **Batch Processing**: Use "Add & Continue" for lists of 10+ items
