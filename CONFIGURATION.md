# Configuration Guide - Trustbit Advance Search

## Initial Setup

### 1. Item Master Configuration

For the search to work effectively, ensure your items are properly configured:

#### Item Naming
- Use descriptive, searchable names
- Include key attributes in the name
- Example: "Steel Pipe 2 Inch MS" instead of "SP-001"

#### Barcodes
1. Navigate to: **Stock → Item → [Item Name]**
2. Scroll to "Barcodes" section
3. Click "Add Row"
4. Enter barcode value
5. Set Barcode Type (optional)
6. Save

**Best Practices**:
- Add primary barcode (manufacturer's barcode)
- Add secondary barcode (internal/warehouse barcode)
- Use consistent format within your organization

#### Item Groups
- Assign meaningful item groups
- Groups are searchable
- Example: "Raw Materials → Steel → Pipes"

#### Item Description
- Add detailed descriptions
- Descriptions are included in search
- Include alternate names, specifications

### 2. Price List Setup

#### For Purchase Transactions

1. Navigate to: **Buying → Price List**
2. Create or configure your buying price list
3. Add items:
   - Go to **Stock → Item Price**
   - Create new Item Price
   - Select Item Code
   - Select Buying Price List
   - Enter Price List Rate
   - Set Buying = 1
   - Save

#### For Sales Transactions

1. Navigate to: **Selling → Price List**
2. Create or configure your selling price list
3. Add items:
   - Go to **Stock → Item Price**
   - Create new Item Price
   - Select Item Code
   - Select Selling Price List
   - Enter Price List Rate
   - Set Selling = 1
   - Save

#### Supplier-Specific Pricing

For supplier-specific prices:
1. Go to **Stock → Item Price**
2. Create Item Price entry
3. Set Buying = 1
4. Select Price List
5. **Set Supplier** field
6. Enter rate
7. Save

#### Customer-Specific Pricing

For customer-specific prices:
1. Go to **Stock → Item Price**
2. Create Item Price entry
3. Set Selling = 1
4. Select Price List
5. **Set Customer** field
6. Enter rate
7. Save

### 3. Document Configuration

#### Purchase Order / Purchase Invoice

Before using Quick Add:
1. Select **Supplier**
2. Set **Buying Price List** (or use default)
3. Set **Set Warehouse** for default warehouse
4. Set **Schedule Date** (for PO) or **Posting Date** (for PI)

These values will auto-populate in added items.

#### Sales Order / Sales Invoice

Before using Quick Add:
1. Select **Customer**
2. Set **Selling Price List** (or use default)
3. Set **Set Warehouse** for default warehouse
4. Set **Delivery Date** (for SO) or **Posting Date** (for SI)

#### Material Request

Before using Quick Add:
1. Select **Material Request Type**
2. Set **Set Warehouse** for default warehouse
3. Set **Schedule Date**

### 4. Warehouse Configuration

Set up default warehouses:
1. Navigate to: **Stock → Warehouse**
2. Ensure warehouses are active
3. Consider creating warehouse-specific accounts

In documents:
- Use "Set Warehouse" field to set default
- Individual items can override warehouse

### 5. User Permissions

Users need these permissions:

#### Minimum Permissions
- Read: Item
- Read/Write: Purchase Order (for PO)
- Read/Write: Purchase Invoice (for PI)
- Read/Write: Sales Order (for SO)
- Read/Write: Sales Invoice (for SI)
- Read/Write: Material Request (for MR)

#### Optional Permissions
- Read: Item Price (for viewing prices)
- Read: Item Barcode (for barcode search)

Set permissions at: **Setup → Permissions**

### 6. System Settings

#### Search Performance

For large item databases (10,000+ items), consider:

1. **Database Indexing**:
   - ERPNext auto-indexes item names
   - Consider custom indexes on frequently searched fields

2. **Search Limit**:
   - Default: 50 results
   - To change, modify `item_search.py`:
   ```python
   frappe.call({
       method: 'trustbit_advance_search.api.item_search.fuzzy_search_items',
       args: { search_text: text, limit: 100 }  // Change from 50 to 100
   });
   ```

#### Browser Settings

For barcode scanners:
1. Ensure browser allows keyboard input
2. Test scanner in barcode field
3. Configure scanner for "Enter" suffix (if needed)

## Advanced Configuration

### Custom Item Fields

If you add custom fields to Item doctype and want them searchable:

1. Edit `trustbit_advance_search/api/item_search.py`
2. Modify the `fuzzy_search_items` function
3. Add your custom field to the SELECT clause:
   ```python
   SELECT DISTINCT
       item.name as item_code,
       item.item_name,
       item.custom_field_name,  # Add this
       ...
   ```
4. Add to WHERE clause for searching:
   ```python
   conditions.append(
       "(... OR item.custom_field_name LIKE %(word_{})s)".format(len(params))
   )
   ```

### Custom Pricing Logic

To implement custom pricing logic:

1. Edit the `load_item_details` function in `trustbit_search_common.js`
2. Add custom API call:
   ```javascript
   frappe.call({
       method: 'your_app.api.get_custom_price',
       args: { item_code: item_code, ... },
       callback: function(r) {
           if (r.message) {
               dialog.set_value('rate', r.message.price);
           }
       }
   });
   ```

### Custom Shortcuts

To change keyboard shortcuts:

1. Edit `trustbit_search_common.js`
2. Modify the `setup_keyboard_shortcuts` function:
   ```javascript
   // Change Ctrl+K to Ctrl+F
   if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
       e.preventDefault();
       trustbit_advance_search.open_quick_add_dialog(cur_frm);
   }
   ```

### Additional Doctypes

To add support for other doctypes (e.g., Quotation):

1. Edit `trustbit_search_common.js`
2. Add configuration to `doctype_config`:
   ```javascript
   'Quotation': {
       child_table: 'items',
       date_field: 'valid_till',
       warehouse_field: 'set_warehouse',
       transaction_type: 'sales',
       party_type: 'customer',
       party_field: 'party_name',
       price_list_field: 'price_list'
   }
   ```

3. Create `quotation.js` in `public/js/`:
   ```javascript
   frappe.ui.form.on('Quotation', {
       onload: function(frm) {
           trustbit_advance_search.setup_keyboard_shortcuts(frm);
       },
       refresh: function(frm) {
           frm.add_custom_button(__('Quick Add (Ctrl+K)'), function() {
               trustbit_advance_search.open_quick_add_dialog(frm);
           }, __('Actions'));
       }
   });
   ```

4. Update `hooks.py`:
   ```python
   doctype_js = {
       ...
       "Quotation": "public/js/quotation.js"
   }
   ```

## Performance Tuning

### For Large Databases

#### 1. Database Optimization
```sql
-- Add indexes for faster search
ALTER TABLE `tabItem` ADD INDEX idx_item_name (item_name);
ALTER TABLE `tabItem` ADD INDEX idx_item_group (item_group);
```

#### 2. Reduce Search Scope

Modify `fuzzy_search_items` to exclude certain item groups:
```python
WHERE
    item.disabled = 0
    AND item.has_variants = 0
    AND item.item_group NOT IN ('Templates', 'Variants')  # Add this
    AND ({where_clause})
```

#### 3. Limit Search Fields

For very large databases, search only name and code:
```python
conditions.append(
    "(item.name LIKE %(word_{})s OR item.item_name LIKE %(word_{})s)".format(
        len(params), len(params)
    )
)
# Remove item_group and description from search
```

### For Slow Networks

1. **Reduce Result Limit**: Change from 50 to 20
2. **Add Debounce**: Increase search delay from 500ms to 1000ms
3. **Compress Responses**: Enable gzip in server config

## Troubleshooting Configuration

### Search Returns Wrong Items

**Issue**: Irrelevant items in results

**Solution**:
- Adjust search ranking in `fuzzy_search_items`
- Add item group filters
- Improve item naming convention

### Barcode Not Working

**Issue**: Barcode scan not finding items

**Check**:
1. Barcode exists in Item master
2. Barcode field is `barcode` (not custom field)
3. Scanner adds Enter key after scan
4. No special characters causing issues

### Wrong Prices

**Issue**: Incorrect rates showing

**Check**:
1. Price List configured in document header
2. Item Price entries exist
3. Correct supplier/customer selected
4. Price List has currency matching document

### Performance Issues

**Issue**: Slow search or dialog lag

**Solutions**:
1. Add database indexes
2. Reduce search result limit
3. Limit searchable fields
4. Clear browser cache
5. Optimize server resources

## Maintenance

### Regular Tasks

1. **Weekly**: Review slow queries in Error Log
2. **Monthly**: Update item descriptions for better search
3. **Quarterly**: Review and update price lists
4. **Yearly**: Archive old/disabled items

### Monitoring

Check these regularly:
- Error Log for search failures
- Item master data quality
- Price list coverage
- User feedback on search accuracy

## Support & Customization

For additional customization needs:
- Review source code in app directory
- Consult Frappe/ERPNext documentation
- Test changes in development environment first
- Keep backups before major modifications
