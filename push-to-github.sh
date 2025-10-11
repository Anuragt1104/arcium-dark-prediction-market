#!/bin/bash

# Push Arcium Dark Prediction Market to GitHub
# Repository: https://github.com/Anuragt1104/arcium-dark-prediction-market

echo "🚀 Pushing Dark Prediction Market to GitHub..."
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run: cd /project/workspace/arcium-dark-prediction-market"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status
echo ""

# Verify remote
echo "🔗 Verifying remote..."
git remote -v
echo ""

# Show what will be pushed
echo "📊 Commits to be pushed:"
git log --oneline origin/main..main 2>/dev/null || git log --oneline main
echo ""

echo "This will push:"
echo "  ✅ main branch (base)"
echo "  ✅ feature/arcium-dark-prediction-market (your changes)"
echo ""

read -p "Ready to push? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing main branch..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Main branch pushed successfully!"
        echo ""
        echo "🚀 Pushing feature branch..."
        git push -u origin feature/arcium-dark-prediction-market
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 SUCCESS! All branches pushed to GitHub"
            echo ""
            echo "📍 Repository: https://github.com/Anuragt1104/arcium-dark-prediction-market"
            echo ""
            echo "Next steps:"
            echo "  1. Visit: https://github.com/Anuragt1104/arcium-dark-prediction-market"
            echo "  2. Create Pull Request: feature/arcium-dark-prediction-market → main"
            echo "  3. Use PULL_REQUEST.md content as PR description"
            echo "  4. Submit to hackathon!"
        else
            echo "❌ Failed to push feature branch"
            echo "Check authentication and try again"
        fi
    else
        echo "❌ Failed to push main branch"
        echo ""
        echo "Possible issues:"
        echo "  - Repository doesn't exist on GitHub"
        echo "  - Authentication failed"
        echo "  - Network issue"
        echo ""
        echo "Create repo at: https://github.com/new"
        echo "Name: arcium-dark-prediction-market"
    fi
else
    echo "❌ Push cancelled"
    echo "Run this script again when ready"
fi
