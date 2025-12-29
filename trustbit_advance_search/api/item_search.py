import frappe
from frappe import _
import re


@frappe.whitelist()
def fuzzy_search_items(search_text, limit=50):
	"""
	Fuzzy search for items with support for words in any order.

	Args:
		search_text: Search query string
		limit: Maximum number of results to return

	Returns:
		List of items matching the search criteria
	"""
	if not search_text or len(search_text) < 2:
		return []

	# Split search text into words and create SQL LIKE conditions
	words = [word.strip() for word in search_text.split() if word.strip()]

	if not words:
		return []

	# Build SQL query with flexible word matching
	conditions = []
	params = []

	for word in words:
		# Escape special SQL characters
		word_pattern = f"%{word}%"
		conditions.append(
			"(item.name LIKE %(word_{})s OR item.item_name LIKE %(word_{})s OR item.item_group LIKE %(word_{})s OR item.description LIKE %(word_{})s)".format(
				len(params), len(params), len(params), len(params)
			)
		)
		params.append(word_pattern)

	where_clause = " AND ".join(conditions)

	# Build parameter dict
	param_dict = {f"word_{i}": params[i] for i in range(len(params))}

	query = f"""
		SELECT DISTINCT
			item.name as item_code,
			item.item_name,
			item.item_group,
			item.stock_uom,
			item.standard_rate,
			item.valuation_rate,
			item.description,
			barcode.barcode
		FROM `tabItem` as item
		LEFT JOIN `tabItem Barcode` as barcode ON barcode.parent = item.name
		WHERE
			item.disabled = 0
			AND item.has_variants = 0
			AND ({where_clause})
		ORDER BY
			CASE
				WHEN item.name LIKE %(first_word)s THEN 1
				WHEN item.item_name LIKE %(first_word)s THEN 2
				ELSE 3
			END,
			item.name
		LIMIT %(limit)s
	"""

	param_dict['first_word'] = f"%{words[0]}%"
	param_dict['limit'] = int(limit)

	try:
		items = frappe.db.sql(query, param_dict, as_dict=True)
		return items
	except Exception as e:
		frappe.log_error(f"Fuzzy search error: {str(e)}", "Trustbit Advance Search")
		return []


@frappe.whitelist()
def search_by_barcode(barcode):
	"""
	Search for an item by barcode.

	Args:
		barcode: Barcode string to search for

	Returns:
		Item details if found, None otherwise
	"""
	if not barcode:
		return None

	# Try exact match first
	item_code = frappe.db.get_value(
		'Item Barcode',
		{'barcode': barcode},
		'parent'
	)

	if not item_code:
		# Try case-insensitive match
		item_code = frappe.db.sql("""
			SELECT parent
			FROM `tabItem Barcode`
			WHERE LOWER(barcode) = LOWER(%(barcode)s)
			LIMIT 1
		""", {'barcode': barcode})

		if item_code:
			item_code = item_code[0][0]

	if item_code:
		item = frappe.get_doc('Item', item_code)

		# Get the barcode that matched
		matched_barcode = frappe.db.get_value(
			'Item Barcode',
			{'parent': item_code, 'barcode': barcode},
			'barcode'
		)

		return {
			'item_code': item.name,
			'item_name': item.item_name,
			'item_group': item.item_group,
			'stock_uom': item.stock_uom,
			'standard_rate': item.standard_rate or 0,
			'valuation_rate': item.valuation_rate or 0,
			'description': item.description or '',
			'barcode': matched_barcode or barcode,
			'disabled': item.disabled,
			'has_variants': item.has_variants
		}

	return None


@frappe.whitelist()
def get_item_price(item_code, price_list=None, customer=None, supplier=None, transaction_date=None, uom=None):
	"""
	Get item price for a specific price list and party.

	Args:
		item_code: Item code
		price_list: Price list name
		customer: Customer name (for sales transactions)
		supplier: Supplier name (for purchase transactions)
		transaction_date: Transaction date
		uom: Unit of measure

	Returns:
		Item price details
	"""
	if not item_code:
		return None

	filters = {
		'item_code': item_code,
		'selling': 1 if customer else 0,
		'buying': 1 if supplier else 0
	}

	if price_list:
		filters['price_list'] = price_list

	# Get the most recent price
	item_price = frappe.db.get_all(
		'Item Price',
		filters=filters,
		fields=['price_list_rate', 'currency', 'uom'],
		order_by='modified desc',
		limit=1
	)

	if item_price:
		return item_price[0]

	# Fallback to item standard rate
	item = frappe.get_doc('Item', item_code)
	return {
		'price_list_rate': item.standard_rate or item.valuation_rate or 0,
		'currency': frappe.defaults.get_global_default('currency'),
		'uom': uom or item.stock_uom
	}


@frappe.whitelist()
def validate_item_for_transaction(item_code, transaction_type):
	"""
	Validate if an item can be used in a specific transaction type.

	Args:
		item_code: Item code
		transaction_type: Type of transaction (purchase/sales)

	Returns:
		Validation result with errors if any
	"""
	if not item_code:
		return {'valid': False, 'message': 'Item code is required'}

	try:
		item = frappe.get_doc('Item', item_code)

		if item.disabled:
			return {'valid': False, 'message': 'Item is disabled'}

		if item.has_variants:
			return {'valid': False, 'message': 'Please select a specific variant'}

		if transaction_type == 'purchase' and not item.is_purchase_item:
			return {'valid': False, 'message': 'Item is not a purchase item'}

		if transaction_type == 'sales' and not item.is_sales_item:
			return {'valid': False, 'message': 'Item is not a sales item'}

		if transaction_type == 'stock' and not item.is_stock_item:
			return {'valid': False, 'message': 'Item is not a stock item'}

		return {'valid': True, 'message': 'Item is valid'}

	except Exception as e:
		return {'valid': False, 'message': str(e)}
