#!/bin/bash

# GitHub Setup Script for Dark Prediction Market
# This script helps you create and push your project to GitHub

set -e  # Exit on error

echo "🚀 Dark Prediction Market - GitHub Setup"
echo "========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "feat: Complete Arcium Dark Prediction Market with frontend"
fi

# Ask for GitHub username
read -p "Enter your GitHub username (default: Anuragt1104): " GITHUB_USER
GITHUB_USER=${GITHUB_USER:-Anuragt1104}

# Repository name
REPO_NAME="arcium-dark-prediction-market"

echo ""
echo "🔗 Repository will be created at:"
echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Check if user has GitHub CLI
if command -v gh &> /dev/null; then
    echo "✓ GitHub CLI found"
    echo ""
    read -p "Create repository on GitHub now? (y/n): " CREATE_REPO
    
    if [ "$CREATE_REPO" = "y" ]; then
        echo "Creating repository..."
        gh repo create $REPO_NAME \
            --public \
            --description "Privacy-preserving prediction market using Arcium MPC on Solana" \
            --homepage "https://arcium.com" \
            || echo "Repository might already exist"
        
        echo "✓ Repository created"
    fi
else
    echo "⚠️  GitHub CLI not found"
    echo ""
    echo "Please create the repository manually:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: Privacy-preserving prediction market using Arcium MPC on Solana"
    echo "4. Make it Public"
    echo "5. DON'T add README, .gitignore, or license (we have them)"
    echo "6. Click 'Create repository'"
    echo ""
    read -p "Press Enter when done..."
fi

# Set remote
echo ""
echo "Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "✓ Remote added"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "feat: Add complete web application and deployment guides"
fi

echo ""
echo "📤 Pushing to GitHub..."
echo ""

# Push to main
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "📍 Your repository:"
echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""
echo "🎯 Next Steps:"
echo "   1. Record demo video (see VIDEO_RECORDING_GUIDE.md)"
echo "   2. Deploy frontend (see DEPLOYMENT.md)"
echo "   3. Submit to hackathon (see HACKATHON_SUBMISSION.md)"
echo ""
echo "🏆 Good luck with your submission!"

