#!/bin/bash

echo "🔧 Resolving Git conflict for ClickBit Website..."
echo "================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a Git repository"
    exit 1
fi

echo "📋 Current Git status:"
git status --porcelain

echo ""
echo "🗂️  Backing up conflicting files..."

# Create backup directory
mkdir -p .git-conflict-backup

# Backup the conflicting files
if [ -f "database.sqlite" ]; then
    cp database.sqlite .git-conflict-backup/database.sqlite.backup
    echo "✅ Backed up database.sqlite"
fi

if [ -f "logs/combined.log" ]; then
    cp logs/combined.log .git-conflict-backup/combined.log.backup
    echo "✅ Backed up logs/combined.log"
fi

echo ""
echo "🧹 Removing conflicting files from Git tracking..."

# Remove the files from Git tracking (but keep local copies)
git rm --cached database.sqlite 2>/dev/null || echo "⚠️  database.sqlite not in Git index"
git rm --cached logs/combined.log 2>/dev/null || echo "⚠️  logs/combined.log not in Git index"

echo ""
echo "📥 Attempting to pull latest changes..."

# Stash any other local changes
git stash push -m "Auto-stash before resolving conflict - $(date)"

# Pull the latest changes
if git pull origin main; then
    echo "✅ Successfully pulled latest changes!"
else
    echo "❌ Pull failed. Trying alternative approach..."
    
    # Alternative: reset and pull
    echo "🔄 Resetting to remote state..."
    git fetch origin
    git reset --hard origin/main
    echo "✅ Reset to remote state"
fi

echo ""
echo "🔄 Restoring your local database and logs..."

# Restore the backed up files
if [ -f ".git-conflict-backup/database.sqlite.backup" ]; then
    cp .git-conflict-backup/database.sqlite.backup database.sqlite
    echo "✅ Restored your local database.sqlite"
fi

if [ -f ".git-conflict-backup/combined.log.backup" ]; then
    mkdir -p logs
    cp .git-conflict-backup/combined.log.backup logs/combined.log
    echo "✅ Restored your local logs/combined.log"
fi

echo ""
echo "📝 Committing updated .gitignore..."

# Add and commit the updated .gitignore
git add .gitignore
git commit -m "Update .gitignore to exclude database and log files"

echo ""
echo "🧹 Cleaning up backup files..."
rm -rf .git-conflict-backup

echo ""
echo "✅ Git conflict resolved successfully!"
echo "================================================"
echo "📊 Final status:"
git status

echo ""
echo "🎉 You can now continue working with your local database and logs intact!"
echo "💡 The updated .gitignore will prevent these conflicts in the future."