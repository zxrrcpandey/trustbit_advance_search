from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in trustbit_advance_search/__init__.py
from trustbit_advance_search import __version__ as version

setup(
	name="trustbit_advance_search",
	version=version,
	description="Advanced item search with barcode support for ERPNext",
	author="Trustbit",
	author_email="support@trustbit.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
