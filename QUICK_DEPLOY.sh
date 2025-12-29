#!/bin/bash

# ═══════════════════════════════════════════════════════════════════
# Trustbit Advance Search - Quick Deployment Script
# This script helps you deploy to GitHub step by step
# ═══════════════════════════════════════════════════════════════════

set -e  # Exit on error

echo "════════════════════════════════════════════════════════════════"
echo "  Trustbit Advance Search - GitHub Deployment Script"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Change to project directory
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
echo "📁 Project Directory: $PROJECT_DIR"
echo ""

# Step 1: Check if git is installed
echo "Step 1: Checking Git installation..."
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   brew install git"
    exit 1
fi
echo "✅ Git is installed: $(git --version)"
echo ""

# Step 2: Initialize git if not already
echo "Step 2: Initializing Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi
echo ""

# Step 3: Check git status
echo "Step 3: Checking repository status..."
git status
echo ""

# Step 4: Add all files
echo "Step 4: Adding all files to Git..."
git add .
echo "✅ Files added"
echo ""

# Step 5: Create commit
echo "Step 5: Creating initial commit..."
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit: Trustbit Advance Search v0.0.1

- Added fuzzy search functionality
- Added barcode scanner support
- Support for Purchase Order, Purchase Invoice, Sales Order, Sales Invoice, Material Request
- Keyboard shortcuts Ctrl+K and Ctrl+B
- Complete documentation"
fi

git commit -m "$COMMIT_MSG" || echo "ℹ️  No changes to commit or already committed"
echo ""

# Step 6: Get GitHub username and repo
echo "Step 6: GitHub repository setup..."
echo "Please create a repository on GitHub first if you haven't:"
echo "   1. Go to https://github.com/new"
echo "   2. Name: trustbit_advance_search"
echo "   3. Don't initialize with README, .gitignore, or license"
echo "   4. Click 'Create repository'"
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi
echo ""

# Step 7: Add remote
echo "Step 7: Adding GitHub remote..."
GITHUB_URL="https://github.com/$GITHUB_USERNAME/trustbit_advance_search.git"
echo "GitHub URL: $GITHUB_URL"

# Remove existing remote if exists
git remote remove origin 2>/dev/null || true

git remote add origin "$GITHUB_URL"
echo "✅ Remote added"
echo ""

# Step 8: Push to GitHub
echo "Step 8: Pushing to GitHub..."
echo "You may be asked for your GitHub credentials..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ✅ SUCCESS! Code pushed to GitHub"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "🔗 Your repository: https://github.com/$GITHUB_USERNAME/trustbit_advance_search"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/$GITHUB_USERNAME/trustbit_advance_search"
    echo "2. Verify all files are uploaded"
    echo "3. Install on server using:"
    echo ""
    echo "   cd ~/frappe-bench"
    echo "   bench get-app $GITHUB_URL"
    echo "   bench --site sitename install-app trustbit_advance_search"
    echo "   bench build --app trustbit_advance_search"
    echo "   bench --site sitename clear-cache"
    echo "   bench restart"
    echo ""
    echo "📚 Full guide: See DEPLOYMENT_GUIDE.md"
    echo "════════════════════════════════════════════════════════════════"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. GitHub repository exists"
    echo "   2. You have write access"
    echo "   3. GitHub credentials are correct"
    echo ""
    echo "Try manual push:"
    echo "   git push -u origin main"
fi
