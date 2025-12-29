# Trustbit Advance Search

Advanced item search with barcode support for ERPNext

## Features

- **Quick Search Dialog (Ctrl+K)**: Fast item search with fuzzy matching
- **Barcode Scanner Support (Ctrl+B)**: Direct barcode scanning to add items
- **Intelligent Search**: Search items by name with words in any order
- **Multi-DocType Support**: Works with:
  - Purchase Order
  - Purchase Invoice
  - Sales Order
  - Sales Invoice
  - Material Request

## Quick Start

**New to this app?** Start with [QUICKSTART.md](QUICKSTART.md) for a fast introduction!

## Installation

### Method 1: From Local Directory
```bash
cd ~/frappe-bench
bench get-app /path/to/trustbit_advance_search
bench --site your-site-name install-app trustbit_advance_search
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search
bench restart
```

### Method 2: From Git Repository
```bash
cd ~/frappe-bench
bench get-app https://github.com/yourusername/trustbit_advance_search
bench --site your-site-name install-app trustbit_advance_search
bench --site your-site-name clear-cache
bench build --app trustbit_advance_search
bench restart
```

**Need help?** See [INSTALLATION.md](INSTALLATION.md) for detailed instructions and troubleshooting.

## Usage

### Quick Search (Ctrl+K)
1. Open any supported document (Purchase Order, Sales Invoice, etc.)
2. Press `Ctrl+K` or click "Quick Add" button
3. Type item name or scan barcode
4. Select item from results
5. Enter quantity and rate
6. Click "Add to Order/Invoice" or "Add & Continue"

### Barcode Scanner (Ctrl+B)
1. Open any supported document
2. Press `Ctrl+B` or click "Scan Barcode" button
3. Scan barcode or type manually
4. Item details appear automatically
5. Enter quantity
6. Click "Add" to add to document

## Features in Detail

### Fuzzy Search
- Search items by any part of the name
- Words can be in any order
- Example: "steel pipe" matches "Pipe Steel 2 inch" and "Steel Round Pipe"

### Barcode Integration
- Supports standard barcodes configured in Item master
- Instant item lookup by barcode
- Works with barcode scanners and manual entry

### Smart Pricing
- Auto-fetches supplier-specific pricing for purchase documents
- Uses price lists configured in the document
- Falls back to standard rates

## Documentation

Complete documentation is available:

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation guide
- **[USAGE.md](USAGE.md)** - Complete usage instructions with examples
- **[CONFIGURATION.md](CONFIGURATION.md)** - Configuration and customization guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview and architecture
- **[DIRECTORY_STRUCTURE.txt](DIRECTORY_STRUCTURE.txt)** - File structure reference

## Configuration

### Setting up Barcodes
1. Go to Item master
2. Add barcodes in the "Barcodes" section
3. Save the item
4. Barcodes are now searchable

**For detailed configuration**, see [CONFIGURATION.md](CONFIGURATION.md)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` or `Cmd+K` | Open Quick Search Dialog |
| `Ctrl+B` or `Cmd+B` | Open Barcode Scanner Dialog |
| `Enter` | Search / Scan |
| `Esc` | Close Dialog |

## Screenshots

### Quick Search Dialog
- Intelligent fuzzy search with words in any order
- Shows item code, name, group, and barcode
- Auto-populated pricing from price lists
- Add multiple items with "Add & Continue"

### Barcode Scanner Dialog
- Instant barcode lookup
- Quick quantity entry
- Perfect for warehouse operations
- Scan → Quantity → Add workflow

## Support

- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Customization**: See [CONFIGURATION.md](CONFIGURATION.md)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

Developed by **Trustbit** for the ERPNext community.

## License

MIT License - See [license.txt](license.txt) for details
