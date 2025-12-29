// ════════════════════════════════════════════════════════════════════════
// TRUSTBIT ADVANCE SEARCH - COMMON FUNCTIONS
// Shared functions for all doctypes
// ════════════════════════════════════════════════════════════════════════

trustbit_advance_search = {
	// Configuration for different doctypes
	doctype_config: {
		'Purchase Order': {
			child_table: 'items',
			date_field: 'schedule_date',
			warehouse_field: 'set_warehouse',
			transaction_type: 'purchase',
			party_type: 'supplier',
			party_field: 'supplier',
			price_list_field: 'buying_price_list'
		},
		'Purchase Invoice': {
			child_table: 'items',
			date_field: 'posting_date',
			warehouse_field: 'set_warehouse',
			transaction_type: 'purchase',
			party_type: 'supplier',
			party_field: 'supplier',
			price_list_field: 'buying_price_list'
		},
		'Sales Order': {
			child_table: 'items',
			date_field: 'delivery_date',
			warehouse_field: 'set_warehouse',
			transaction_type: 'sales',
			party_type: 'customer',
			party_field: 'customer',
			price_list_field: 'selling_price_list'
		},
		'Sales Invoice': {
			child_table: 'items',
			date_field: 'posting_date',
			warehouse_field: 'set_warehouse',
			transaction_type: 'sales',
			party_type: 'customer',
			party_field: 'customer',
			price_list_field: 'selling_price_list'
		},
		'Material Request': {
			child_table: 'items',
			date_field: 'schedule_date',
			warehouse_field: 'set_warehouse',
			transaction_type: 'stock',
			party_type: null,
			party_field: null,
			price_list_field: null
		}
	},

	setup_keyboard_shortcuts: function(frm) {
		$(document).off('keydown.trustbit_search_' + frm.doctype.replace(/ /g, '_'));
		$(document).on('keydown.trustbit_search_' + frm.doctype.replace(/ /g, '_'), function(e) {
			if (cur_frm && cur_frm.doctype === frm.doctype) {
				// Ctrl+K for Quick Search
				if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
					e.preventDefault();
					trustbit_advance_search.open_quick_add_dialog(cur_frm);
				}
				// Ctrl+B for Barcode Scan
				if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
					e.preventDefault();
					trustbit_advance_search.open_barcode_dialog(cur_frm);
				}
			}
		});
	},

	// ════════════════════════════════════════════════════════════════════════
	// BARCODE SCAN DIALOG
	// ════════════════════════════════════════════════════════════════════════

	open_barcode_dialog: function(frm) {
		let config = trustbit_advance_search.doctype_config[frm.doctype];

		let d = new frappe.ui.Dialog({
			title: __('📦 Scan Barcode - Trustbit Advance Search'),
			size: 'small',
			fields: [
				{
					fieldname: 'barcode',
					fieldtype: 'Data',
					label: __('Barcode'),
					placeholder: __('Scan or type barcode...'),
					reqd: 1,
					description: __('Scan barcode or type manually and press Enter')
				},
				{
					fieldname: 'qty',
					fieldtype: 'Float',
					label: __('Quantity'),
					default: 1,
					reqd: 1
				},
				{
					fieldname: 'result_section',
					fieldtype: 'Section Break',
					label: __('Item Found')
				},
				{
					fieldname: 'result_html',
					fieldtype: 'HTML'
				}
			],
			primary_action_label: __('Add to Document'),
			primary_action: function() {
				let barcode = d.get_value('barcode');
				let qty = d.get_value('qty');

				if (!barcode) {
					frappe.msgprint(__('Please scan or enter a barcode'));
					return;
				}

				if (!qty || qty <= 0) {
					frappe.msgprint(__('Please enter valid quantity'));
					return;
				}

				if (!d.found_item) {
					frappe.msgprint(__('No item found for this barcode'));
					return;
				}

				trustbit_advance_search.add_barcode_item_to_doc(frm, d.found_item, qty);

				// Reset for next scan
				d.found_item = null;
				d.set_value('barcode', '');
				d.set_value('qty', 1);
				d.fields_dict.result_html.$wrapper.html(`
					<div class="text-center text-muted" style="padding: 20px;">
						<i class="fa fa-barcode fa-2x"></i>
						<p style="margin-top: 10px;">Scan next barcode...</p>
					</div>
				`);

				setTimeout(() => d.fields_dict.barcode.$input.focus(), 100);
			}
		});

		d.fields_dict.barcode.$input.on('keypress', function(e) {
			if (e.which === 13) {
				e.preventDefault();
				let barcode = d.get_value('barcode');
				if (barcode && barcode.length >= 2) {
					trustbit_advance_search.search_barcode(d, frm, barcode);
				}
			}
		});

		d.fields_dict.barcode.$input.on('input', function() {
			clearTimeout(d.barcode_timeout);
			d.barcode_timeout = setTimeout(() => {
				let barcode = d.get_value('barcode');
				if (barcode && barcode.length >= 3) {
					trustbit_advance_search.search_barcode(d, frm, barcode);
				}
			}, 800);
		});

		d.show();

		d.fields_dict.result_html.$wrapper.html(`
			<div class="text-center text-muted" style="padding: 20px;">
				<i class="fa fa-barcode fa-2x"></i>
				<p style="margin-top: 10px;">Scan barcode or type manually</p>
			</div>
		`);

		setTimeout(() => d.fields_dict.barcode.$input.focus(), 300);
	},

	search_barcode: function(dialog, frm, barcode) {
		dialog.fields_dict.result_html.$wrapper.html(`
			<div class="text-center" style="padding: 20px;">
				<i class="fa fa-spinner fa-spin fa-2x"></i>
				<p style="margin-top: 10px;">Searching...</p>
			</div>
		`);

		frappe.call({
			method: 'trustbit_advance_search.api.item_search.search_by_barcode',
			args: { barcode: barcode },
			callback: function(r) {
				if (r.message) {
					let item = r.message;
					dialog.found_item = item;

					dialog.fields_dict.result_html.$wrapper.html(`
						<div class="alert alert-success" style="margin: 0;">
							<h5 style="margin: 0 0 10px 0;">
								<i class="fa fa-check-circle"></i> Item Found!
							</h5>
							<table class="table table-condensed" style="margin: 0; background: transparent;">
								<tr><td><strong>Item Code:</strong></td><td>${item.item_code}</td></tr>
								<tr><td><strong>Item Name:</strong></td><td>${item.item_name}</td></tr>
								<tr><td><strong>Group:</strong></td><td>${item.item_group || '-'}</td></tr>
								<tr><td><strong>UOM:</strong></td><td>${item.stock_uom}</td></tr>
								<tr><td><strong>Rate:</strong></td><td>₹ ${item.standard_rate || item.valuation_rate || 0}</td></tr>
							</table>
						</div>
					`);

					setTimeout(() => dialog.fields_dict.qty.$input.focus().select(), 100);

					frappe.show_alert({
						message: __('Item found: {0}', [item.item_name]),
						indicator: 'green'
					}, 2);
				} else {
					dialog.found_item = null;
					dialog.fields_dict.result_html.$wrapper.html(`
						<div class="alert alert-warning" style="margin: 0;">
							<h5 style="margin: 0;">
								<i class="fa fa-exclamation-triangle"></i> Item Not Found
							</h5>
							<p style="margin: 10px 0 0 0;">No item found for barcode: <strong>${barcode}</strong></p>
						</div>
					`);

					frappe.show_alert({
						message: __('No item found for barcode: {0}', [barcode]),
						indicator: 'orange'
					}, 3);
				}
			},
			error: function(err) {
				console.error('Barcode search error:', err);
				dialog.found_item = null;
				dialog.fields_dict.result_html.$wrapper.html(`
					<div class="alert alert-danger" style="margin: 0;">
						<i class="fa fa-times-circle"></i> Error searching barcode
					</div>
				`);
			}
		});
	},

	add_barcode_item_to_doc: function(frm, item, qty) {
		let config = trustbit_advance_search.doctype_config[frm.doctype];
		let row = frm.add_child(config.child_table);

		frappe.model.set_value(row.doctype, row.name, 'item_code', item.item_code).then(() => {
			let set_values = {
				qty: qty,
				uom: item.stock_uom
			};

			// Add date field if exists
			if (config.date_field && frm.doc[config.date_field]) {
				set_values[config.date_field] = frm.doc[config.date_field];
			} else if (config.date_field === 'schedule_date') {
				set_values[config.date_field] = frappe.datetime.add_days(frappe.datetime.nowdate(), 7);
			} else if (config.date_field === 'delivery_date') {
				set_values[config.date_field] = frappe.datetime.add_days(frappe.datetime.nowdate(), 7);
			}

			// Add warehouse if exists
			if (config.warehouse_field && frm.doc[config.warehouse_field]) {
				set_values.warehouse = frm.doc[config.warehouse_field];
			}

			frappe.model.set_value(row.doctype, row.name, set_values);

			setTimeout(() => {
				let rate = item.standard_rate || item.valuation_rate || 0;
				frappe.model.set_value(row.doctype, row.name, 'rate', rate);
				frm.refresh_field(config.child_table);
			}, 300);
		});

		frappe.show_alert({
			message: __('✓ {0} x {1} added!', [qty, item.item_name]),
			indicator: 'green'
		}, 3);
	},

	// ════════════════════════════════════════════════════════════════════════
	// QUICK SEARCH DIALOG
	// ════════════════════════════════════════════════════════════════════════

	open_quick_add_dialog: function(frm) {
		let config = trustbit_advance_search.doctype_config[frm.doctype];

		let fields = [
			{ fieldname: 'search_section', fieldtype: 'Section Break', label: __('Search Items') },
			{
				fieldname: 'search_text',
				fieldtype: 'Data',
				label: __('Search / Barcode'),
				placeholder: __('Type item name, barcode, or scan...'),
				reqd: 1,
				description: __('Search by name (words in any order) or scan barcode')
			},
			{ fieldname: 'col_break_1', fieldtype: 'Column Break' },
			{ fieldname: 'search_btn', fieldtype: 'Button', label: __('🔍 Search') },
			{ fieldname: 'results_section', fieldtype: 'Section Break', label: __('Search Results') },
			{ fieldname: 'results', fieldtype: 'HTML' },
			{ fieldname: 'details_section', fieldtype: 'Section Break', label: __('Item Details'), hidden: 1 },
			{ fieldname: 'selected_item', fieldtype: 'Link', label: __('Item Code'), options: 'Item', read_only: 1 },
			{ fieldname: 'item_name', fieldtype: 'Data', label: __('Item Name'), read_only: 1 },
			{ fieldname: 'col_break_2', fieldtype: 'Column Break' },
			{ fieldname: 'stock_uom', fieldtype: 'Link', label: __('Stock UOM'), options: 'UOM', read_only: 1 },
			{ fieldname: 'item_group', fieldtype: 'Link', label: __('Item Group'), options: 'Item Group', read_only: 1 },
			{ fieldname: 'transaction_section', fieldtype: 'Section Break', label: __('Transaction Details') },
			{ fieldname: 'qty', fieldtype: 'Float', label: __('Quantity'), default: 1, reqd: 1 },
			{ fieldname: 'uom', fieldtype: 'Link', label: __('UOM'), options: 'UOM', reqd: 1 },
			{ fieldname: 'col_break_3', fieldtype: 'Column Break' },
			{ fieldname: 'rate', fieldtype: 'Currency', label: __('Rate'), reqd: 1 },
			{ fieldname: 'amount', fieldtype: 'Currency', label: __('Amount'), read_only: 1 }
		];

		// Add additional fields based on doctype
		if (config.date_field) {
			let default_date = frm.doc[config.date_field] || frappe.datetime.nowdate();
			if (config.date_field === 'schedule_date' || config.date_field === 'delivery_date') {
				default_date = frm.doc[config.date_field] || frappe.datetime.add_days(frappe.datetime.nowdate(), 7);
			}

			fields.push({
				fieldname: 'additional_section',
				fieldtype: 'Section Break',
				label: __('Additional Details')
			});

			fields.push({
				fieldname: 'transaction_date',
				fieldtype: 'Date',
				label: config.date_field === 'schedule_date' ? __('Required By') :
					   config.date_field === 'delivery_date' ? __('Delivery Date') : __('Date'),
				default: default_date,
				reqd: 1
			});

			if (config.warehouse_field) {
				fields.push({
					fieldname: 'warehouse',
					fieldtype: 'Link',
					label: __('Warehouse'),
					options: 'Warehouse',
					default: frm.doc[config.warehouse_field]
				});
			}
		}

		let d = new frappe.ui.Dialog({
			title: __('🔍 Trustbit Advance Search - {0}', [frm.doctype]),
			size: 'large',
			fields: fields,
			primary_action_label: __('✓ Add to {0}', [frm.doctype]),
			primary_action: function() {
				if (!trustbit_advance_search.validate_and_add(d, frm, true)) {
					return;
				}
				d.hide();
				frappe.show_alert({ message: __('✓ Item added!'), indicator: 'green' }, 3);
			},
			secondary_action_label: __('+ Add & Continue'),
			secondary_action: function() {
				if (!trustbit_advance_search.validate_and_add(d, frm, false)) {
					return;
				}
				frappe.show_alert({ message: __('✓ Item added! Add another...'), indicator: 'green' }, 3);
				trustbit_advance_search.reset_dialog(d);
			}
		});

		// Event handlers
		d.fields_dict.search_btn.input.onclick = function() {
			let text = d.get_value('search_text');
			if (text) trustbit_advance_search.try_barcode_then_search(d, frm, text);
		};

		d.fields_dict.search_text.$input.on('change', function() {
			clearTimeout(d.search_timeout);
			d.search_timeout = setTimeout(() => {
				let text = d.get_value('search_text');
				if (text && text.length >= 2) {
					trustbit_advance_search.try_barcode_then_search(d, frm, text);
				}
			}, 500);
		});

		d.fields_dict.qty.$input.on('change', () => trustbit_advance_search.update_amount(d));
		d.fields_dict.rate.$input.on('change', () => trustbit_advance_search.update_amount(d));

		d.fields_dict.search_text.$input.on('keypress', function(e) {
			if (e.which === 13) {
				e.preventDefault();
				let text = d.get_value('search_text');
				if (text) trustbit_advance_search.try_barcode_then_search(d, frm, text);
			}
		});

		d.show();
		setTimeout(() => d.fields_dict.search_text.$input.focus(), 300);

		d.fields_dict.results.$wrapper.html(`
			<div class="text-center text-muted" style="padding: 40px;">
				<i class="fa fa-search fa-3x" style="opacity: 0.3;"></i>
				<p style="margin-top: 15px;">Type to search or scan barcode</p>
				<small>Words can be in any order!</small>
			</div>
		`);
	},

	try_barcode_then_search: function(dialog, frm, text) {
		dialog.fields_dict.results.$wrapper.html(`
			<div class="text-center" style="padding: 40px;">
				<i class="fa fa-spinner fa-spin fa-3x"></i>
				<p style="margin-top: 15px;">Searching...</p>
			</div>
		`);

		frappe.call({
			method: 'trustbit_advance_search.api.item_search.search_by_barcode',
			args: { barcode: text },
			callback: function(r) {
				if (r.message) {
					let item = r.message;
					dialog.fields_dict.results.$wrapper.html(`
						<div class="alert alert-success">
							<strong><i class="fa fa-barcode"></i> Barcode Match!</strong>
						</div>
					`);
					trustbit_advance_search.display_results(dialog, frm, [item]);
					trustbit_advance_search.load_item_details(dialog, frm, item.item_code);
				} else {
					trustbit_advance_search.search_items(dialog, frm, text);
				}
			},
			error: function() {
				trustbit_advance_search.search_items(dialog, frm, text);
			}
		});
	},

	search_items: function(dialog, frm, search_text) {
		if (!search_text || search_text.length < 2) {
			frappe.msgprint(__('Enter at least 2 characters'));
			return;
		}

		frappe.call({
			method: 'trustbit_advance_search.api.item_search.fuzzy_search_items',
			args: { search_text: search_text, limit: 50 },
			callback: function(r) {
				if (r.message && r.message.length > 0) {
					trustbit_advance_search.display_results(dialog, frm, r.message);
				} else {
					dialog.fields_dict.results.$wrapper.html(`
						<div class="text-center text-muted" style="padding: 40px;">
							<i class="fa fa-inbox fa-3x" style="opacity: 0.3;"></i>
							<p style="margin-top: 15px;">No items found for "${search_text}"</p>
						</div>
					`);
				}
			},
			error: function(err) {
				console.error('Search error:', err);
				dialog.fields_dict.results.$wrapper.html(`
					<div class="text-center text-danger" style="padding: 40px;">
						<i class="fa fa-exclamation-triangle fa-3x"></i>
						<p style="margin-top: 15px;">Search error. Check console.</p>
					</div>
				`);
			}
		});
	},

	display_results: function(dialog, frm, items) {
		let html = `<div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px;">
			<table class="table table-bordered table-hover" style="margin: 0; background: white;">
				<thead style="position: sticky; top: 0; background: #f5f7fa;">
					<tr><th width="25%">Item Code</th><th width="40%">Item Name</th><th width="15%">Group</th><th width="20%">Action</th></tr>
				</thead><tbody>`;

		items.forEach(item => {
			let code = item.item_code || item.name;
			let barcode_badge = item.barcode ? `<br><small class="text-muted"><i class="fa fa-barcode"></i> ${item.barcode}</small>` : '';
			html += `<tr class="item-row" style="cursor:pointer" data-item="${code}">
				<td><strong>${code}</strong>${barcode_badge}</td>
				<td>${item.item_name || ''}</td>
				<td><span class="badge badge-secondary">${item.item_group || ''}</span></td>
				<td class="text-center"><button class="btn btn-sm btn-primary select-item" data-item="${code}"><i class="fa fa-check"></i> Select</button></td>
			</tr>`;
		});

		html += '</tbody></table></div>';
		dialog.fields_dict.results.$wrapper.html(html);

		dialog.fields_dict.results.$wrapper.find('.select-item').on('click', function(e) {
			e.stopPropagation();
			trustbit_advance_search.load_item_details(dialog, frm, $(this).data('item'));
		});
		dialog.fields_dict.results.$wrapper.find('.item-row').on('click', function() {
			trustbit_advance_search.load_item_details(dialog, frm, $(this).data('item'));
		});
	},

	load_item_details: function(dialog, frm, item_code) {
		let config = trustbit_advance_search.doctype_config[frm.doctype];

		frappe.call({
			method: 'frappe.client.get',
			args: { doctype: 'Item', name: item_code },
			callback: function(r) {
				if (r.message) {
					let item = r.message;
					dialog.fields_dict.details_section.df.hidden = 0;
					dialog.fields_dict.transaction_section.df.hidden = 0;
					if (dialog.fields_dict.additional_section) {
						dialog.fields_dict.additional_section.df.hidden = 0;
					}
					dialog.refresh();

					dialog.set_value('selected_item', item.name);
					dialog.set_value('item_name', item.item_name);
					dialog.set_value('stock_uom', item.stock_uom);
					dialog.set_value('item_group', item.item_group);
					dialog.set_value('uom', item.stock_uom);
					dialog.set_value('qty', 1);

					let rate = item.standard_rate || item.valuation_rate || 0;

					// Get party-specific pricing
					if (config.party_field && frm.doc[config.party_field]) {
						frappe.call({
							method: 'erpnext.stock.get_item_details.get_item_details',
							args: {
								args: {
									item_code: item_code,
									company: frm.doc.company,
									[config.party_field]: frm.doc[config.party_field],
									currency: frm.doc.currency,
									price_list: frm.doc[config.price_list_field],
									doctype: frm.doctype
								}
							},
							callback: function(r2) {
								if (r2.message) {
									rate = r2.message.price_list_rate || r2.message.rate || rate;
								}
								dialog.set_value('rate', rate);
								trustbit_advance_search.update_amount(dialog);
							}
						});
					} else {
						dialog.set_value('rate', rate);
						trustbit_advance_search.update_amount(dialog);
					}

					setTimeout(() => dialog.fields_dict.qty.$input.focus().select(), 300);
					frappe.show_alert({ message: __('Item selected: {0}', [item_code]), indicator: 'green' }, 2);
				}
			}
		});
	},

	update_amount: function(d) {
		d.set_value('amount', (d.get_value('qty') || 0) * (d.get_value('rate') || 0));
	},

	validate_and_add: function(d, frm, close_dialog) {
		let values = d.get_values();

		if (!values.selected_item) {
			frappe.msgprint(__('Please select an item first'));
			return false;
		}
		if (!values.qty || values.qty <= 0) {
			frappe.msgprint(__('Enter valid quantity'));
			return false;
		}
		if (!values.uom) {
			frappe.msgprint(__('Select UOM'));
			return false;
		}
		if (values.rate === undefined || values.rate === null || values.rate === '') {
			frappe.msgprint(__('Enter rate'));
			return false;
		}

		trustbit_advance_search.add_item_to_doc(frm, values);
		return true;
	},

	add_item_to_doc: function(frm, values) {
		let config = trustbit_advance_search.doctype_config[frm.doctype];
		let row = frm.add_child(config.child_table);

		frappe.model.set_value(row.doctype, row.name, 'item_code', values.selected_item).then(() => {
			let set_values = {
				qty: values.qty,
				uom: values.uom
			};

			if (values.transaction_date && config.date_field) {
				set_values[config.date_field] = values.transaction_date;
			}

			if (values.warehouse && config.warehouse_field) {
				set_values.warehouse = values.warehouse;
			}

			frappe.model.set_value(row.doctype, row.name, set_values);

			setTimeout(() => {
				frappe.model.set_value(row.doctype, row.name, 'rate', values.rate);
				frm.refresh_field(config.child_table);
			}, 300);
		});
	},

	reset_dialog: function(d) {
		d.fields_dict.details_section.df.hidden = 1;
		d.fields_dict.transaction_section.df.hidden = 1;
		if (d.fields_dict.additional_section) {
			d.fields_dict.additional_section.df.hidden = 1;
		}
		d.refresh();
		d.set_value('search_text', '');
		d.set_value('selected_item', '');
		d.set_value('item_name', '');
		d.set_value('qty', 1);
		d.set_value('uom', '');
		d.set_value('rate', 0);
		d.set_value('amount', 0);
		d.fields_dict.results.$wrapper.html(`
			<div class="text-center text-muted" style="padding: 40px;">
				<i class="fa fa-search fa-3x" style="opacity: 0.3;"></i>
				<p style="margin-top: 15px;">Search for another item...</p>
			</div>
		`);
		setTimeout(() => d.fields_dict.search_text.$input.focus(), 300);
	}
};
