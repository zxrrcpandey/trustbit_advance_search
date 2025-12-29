// ════════════════════════════════════════════════════════════════════════
// TRUSTBIT ADVANCE SEARCH - SALES ORDER
// Keyboard Shortcuts: Ctrl+K (Search) | Ctrl+B (Barcode)
// ════════════════════════════════════════════════════════════════════════

frappe.ui.form.on('Sales Order', {
	onload: function(frm) {
		console.log('Trustbit Advance Search Loaded for Sales Order');
		trustbit_advance_search.setup_keyboard_shortcuts(frm);
	},

	refresh: function(frm) {
		// Add Quick Add button
		frm.add_custom_button(__('Quick Add (Ctrl+K)'), function() {
			trustbit_advance_search.open_quick_add_dialog(frm);
		}, __('Actions')).addClass('btn-primary');

		// Add Barcode Scan button
		frm.add_custom_button(__('Scan Barcode (Ctrl+B)'), function() {
			trustbit_advance_search.open_barcode_dialog(frm);
		}, __('Actions'));
	}
});
