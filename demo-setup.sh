#!/bin/bash

# 🎬 StoryLite CLI Demo Setup Script
# Run this before recording your demo video

echo "🎬 Setting up StoryLite CLI demo environment..."

# Create demo directory
mkdir -p demo-files
cd demo-files

# Create demo code file
cat > demo-code.js << 'EOF'
// Revolutionary Trading Algorithm
// Copyright 2024 - All Rights Reserved

class TradingBot {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.isActive = false;
  }

  async analyzeMarket() {
    // Advanced ML analysis
    const signals = await this.getMarketSignals();
    return this.processSignals(signals);
  }

  async executeTrade(signal) {
    if (signal.confidence > 0.85) {
      return await this.placeTrade(signal);
    }
  }
}

console.log('🚀 Trading Bot initialized');
EOF

# Create markdown documentation
cat > algorithm-docs.md << 'EOF'
# Revolutionary Algorithm Documentation

## Overview
This algorithm represents a breakthrough in automated trading technology.

## Key Features
- ⚡ Lightning-fast execution (< 10ms)
- 🎯 95% accuracy rate
- 🔒 Military-grade security
- 📊 Real-time market analysis

## Usage Example
```javascript
const bot = new TradingBot(process.env.API_KEY);
await bot.analyzeMarket();
```

## Performance Metrics
- **Backtested Returns:** 347% annually
- **Max Drawdown:** 2.1%
- **Sharpe Ratio:** 4.2
- **Win Rate:** 89%

## License
Patent-pending technology. All rights reserved.
EOF

# Create API specification
cat > api-spec.json << 'EOF'
{
  "name": "StoryLite API",
  "version": "2.0.0",
  "description": "Revolutionary IP minting API",
  "endpoints": {
    "/mint": {
      "method": "POST",
      "description": "Mint any file as IP asset",
      "parameters": {
        "file": "File to mint",
        "title": "Asset title",
        "description": "Asset description"
      }
    },
    "/verify": {
      "method": "GET", 
      "description": "Verify IP ownership",
      "parameters": {
        "assetId": "IP asset identifier"
      }
    }
  },
  "authentication": "Bearer token",
  "rateLimit": "1000 requests/hour"
}
EOF

# Create business document
cat > business-plan.txt << 'EOF'
CONFIDENTIAL BUSINESS PLAN
StoryLite Technologies Inc.

EXECUTIVE SUMMARY
StoryLite is revolutionizing intellectual property protection through 
blockchain technology and developer-friendly tools.

MARKET OPPORTUNITY
- $50B IP protection market
- 2M+ developers need IP tools
- 500K+ creators seeking protection

COMPETITIVE ADVANTAGE
- First CLI tool for IP minting
- 10x faster than competitors
- Developer-first approach

FINANCIAL PROJECTIONS
Year 1: $1M ARR
Year 2: $5M ARR  
Year 3: $15M ARR

This document contains proprietary information.
All rights reserved.
EOF

# Create a simple image placeholder (text file representing image)
cat > digital-artwork.txt << 'EOF'
[This represents a digital artwork file - digital-artwork.png]

Title: "Cosmic Dreams #001"
Artist: Digital Creator
Medium: AI-Generated Digital Art
Dimensions: 4096x4096 pixels
Created: 2024

Description:
A mesmerizing blend of cosmic colors and abstract forms,
this piece represents the intersection of technology and creativity.
The swirling galaxies and nebular formations create a sense
of infinite possibility and wonder.

Rarity: 1 of 1
Collection: Cosmic Dreams Series
EOF

# Create research paper
cat > research-paper.txt << 'EOF'
BLOCKCHAIN SCALABILITY: A COMPREHENSIVE ANALYSIS
Dr. Jane Smith, PhD - Blockchain Research Institute

ABSTRACT
This paper presents a novel approach to blockchain scalability
through innovative Layer 2 solutions and cross-chain protocols.

1. INTRODUCTION
Current blockchain networks face significant scalability challenges,
processing only 7-15 transactions per second compared to traditional
payment systems that handle thousands.

2. METHODOLOGY  
We analyzed 50+ blockchain networks and developed a new consensus
mechanism that increases throughput by 1000x while maintaining
decentralization.

3. RESULTS
Our solution achieves:
- 100,000+ TPS throughput
- Sub-second finality
- 99.9% uptime
- Energy efficiency improved by 95%

4. CONCLUSION
This breakthrough enables blockchain adoption at global scale
while preserving security and decentralization principles.

© 2024 Blockchain Research Institute. All rights reserved.
EOF

echo "✅ Demo files created successfully!"
echo ""
echo "📁 Files ready for demo:"
ls -la
echo ""
echo "🎬 You're ready to record! Use these commands in your demo:"
echo ""
echo "# Basic minting:"
echo "storylite mint demo-code.js"
echo "storylite mint algorithm-docs.md --title 'Algorithm Documentation'"
echo "storylite mint api-spec.json --title 'API Specification v2.0'"
echo ""
echo "# Advanced examples:"
echo "storylite mint business-plan.txt --title 'Confidential Business Plan' --description 'Strategic roadmap and financial projections'"
echo "storylite mint digital-artwork.txt --title 'Cosmic Dreams #001' --description 'AI-generated digital masterpiece'"
echo "storylite mint research-paper.txt --title 'Blockchain Scalability Research' --description 'Breakthrough Layer 2 solution'"
echo ""
echo "# With verbose mode:"
echo "storylite mint demo-code.js --verbose"
echo ""
echo "🎯 Pro tip: Practice the commands a few times before recording!"