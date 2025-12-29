from . import __version__ as app_version

app_name = "trustbit_advance_search"
app_title = "Trustbit Advance Search"
app_publisher = "Trustbit"
app_description = "Advanced item search with barcode support for ERPNext"
app_email = "support@trustbit.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/trustbit_advance_search/css/trustbit_advance_search.css"
app_include_js = "/assets/trustbit_advance_search/js/trustbit_search_common.js"

# include js, css files in header of web template
# web_include_css = "/assets/trustbit_advance_search/css/trustbit_advance_search.css"
# web_include_js = "/assets/trustbit_advance_search/js/trustbit_advance_search.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "trustbit_advance_search/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
	"Purchase Order": "public/js/purchase_order.js",
	"Purchase Invoice": "public/js/purchase_invoice.js",
	"Sales Order": "public/js/sales_order.js",
	"Sales Invoice": "public/js/sales_invoice.js",
	"Material Request": "public/js/material_request.js"
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "trustbit_advance_search.utils.jinja_methods",
#	"filters": "trustbit_advance_search.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "trustbit_advance_search.install.before_install"
# after_install = "trustbit_advance_search.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "trustbit_advance_search.uninstall.before_uninstall"
# after_uninstall = "trustbit_advance_search.uninstall.after_uninstall"

# Desk Notifications
# -------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "trustbit_advance_search.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"trustbit_advance_search.tasks.all"
#	],
#	"daily": [
#		"trustbit_advance_search.tasks.daily"
#	],
#	"hourly": [
#		"trustbit_advance_search.tasks.hourly"
#	],
#	"weekly": [
#		"trustbit_advance_search.tasks.weekly"
#	],
#	"monthly": [
#		"trustbit_advance_search.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "trustbit_advance_search.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "trustbit_advance_search.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "trustbit_advance_search.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["trustbit_advance_search.utils.before_request"]
# after_request = ["trustbit_advance_search.utils.after_request"]

# Job Events
# ----------
# before_job = ["trustbit_advance_search.utils.before_job"]
# after_job = ["trustbit_advance_search.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"trustbit_advance_search.auth.validate"
# ]
