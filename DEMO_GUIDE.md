# 🎬 StoryLite CLI Demo Guide

> **Perfect for creating professional demo videos that showcase the CLI's power and simplicity**

This guide provides a step-by-step script for creating compelling demo videos that make StoryLite CLI look easy, powerful, and visually appealing.

## 🎯 Demo Objectives

- Show how **ridiculously easy** it is to mint IP assets
- Demonstrate the **beautiful, clean interface**
- Highlight the **one-time setup, lifetime convenience**
- Showcase **real-world use cases**
- Prove it works with **any file type**

## 🎬 Demo Script (5-7 minutes)

### Scene 1: The Problem (30 seconds)
*Show the old way - typing long addresses*

```bash
# DON'T show this working, just show the pain
storylite mint ./file.txt --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532 --title "My File"
# Narrator: "Tired of typing 42-character wallet addresses every time you want to mint an IP asset?"
```

### Scene 2: The Solution - Installation (45 seconds)
*Clean terminal, show the simple installation*

```bash
# Terminal should be clean, good font, nice colors
npm install -g storylite-cli

# Show it installed successfully
storylite --help
```

**Narrator:** *"StoryLite CLI is the cURL for Intellectual Property. Install it once, use it forever."*

### Scene 3: One-Time Setup (90 seconds)
*Show the beautiful configuration process*

```bash
# Step 1: Set endpoint
storylite config set-endpoint https://universal-minting-engine.vercel.app
# ✓ Endpoint set to: https://universal-minting-engine.vercel.app

# Step 2: Set wallet address (one time only!)
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532
# ✓ Default address set to: 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532
# 💡 You can now mint files without specifying --address

# Step 3: Verify configuration
storylite config show
```

**Narrator:** *"Just two commands for setup. Set your API endpoint and wallet address once, then never type them again."*

### Scene 4: The Magic - Effortless Minting (2 minutes)
*Show multiple file types being minted with beautiful output*

```bash
# Create some demo files first (do this before recording)
echo "console.log('Hello, IP World!');" > demo-code.js
echo "# My Amazing Algorithm\n\nThis is revolutionary." > algorithm.md
# Use a real image file you have

# Now show the magic
storylite mint demo-code.js
# ✓ IP Asset created successfully!
# 📋 IP Asset ID: 0x1234...abcd
# 🔗 Transaction: 0x5678...efgh

storylite mint algorithm.md --title "Revolutionary Algorithm"
# ✓ IP Asset created successfully!
# 📋 IP Asset ID: 0x9876...dcba
# 🔗 Transaction: 0x5432...hgfe

storylite mint photo.jpg --title "Digital Masterpiece"
# ✓ IP Asset created successfully!
# 📋 IP Asset ID: 0x1111...2222
# 🔗 Transaction: 0x3333...4444
```

**Narrator:** *"Look how simple this is. Any file, any type, one command. The CLI automatically generates metadata, handles the upload, and registers your IP asset."*

### Scene 5: Advanced Features (90 seconds)
*Show the power user features*

```bash
# Custom metadata
storylite mint research-paper.pdf --title "Blockchain Scalability" --description "Groundbreaking research on Layer 2 solutions"

# Verbose mode for transparency
storylite mint source-code.py --verbose
# Show all the detailed logging

# Override address for specific use
storylite mint client-work.txt --address 0x9876543210987654321098765432109876543210

# Check configuration anytime
storylite config show
```

**Narrator:** *"Need custom metadata? Verbose logging? Different addresses for different projects? StoryLite handles it all."*

### Scene 6: Real-World Scenarios (60 seconds)
*Show practical use cases*

```bash
# Developer protecting code
storylite mint ./src/main.js --title "Core Trading Algorithm"

# Artist registering work
storylite mint ./nft-collection/piece-001.png --title "Cosmic Dreams #001"

# Business protecting documents
storylite mint ./whitepaper-v2.pdf --title "Protocol Whitepaper v2.0"

# Content creator with video
storylite mint ./tutorial-video.mp4 --title "Advanced DeFi Strategies"
```

**Narrator:** *"Whether you're a developer, artist, business, or creator - protect your intellectual property with one simple command."*

### Scene 7: The Wow Factor (30 seconds)
*Show the help system and beautiful interface*

```bash
storylite mint --help
# Show the beautiful, comprehensive help

storylite config --help
# Show the detailed configuration help
```

**Narrator:** *"Professional documentation, beautiful interface, and enterprise-ready reliability."*

## 🎨 Visual Guidelines

### Terminal Setup
```bash
# Use a clean, professional terminal setup
# Recommended: iTerm2 (Mac) or Windows Terminal
# Font: Fira Code or JetBrains Mono
# Theme: Dark theme with good contrast
# Size: Large enough to read clearly in video
```

### Color Scheme
- **Background:** Dark (black or dark gray)
- **Text:** Light (white or light gray)
- **Success:** Green (✓ symbols)
- **Info:** Cyan/Blue (ℹ symbols)
- **Highlights:** Yellow/Orange
- **Errors:** Red (for contrast demos)

### Screen Recording Settings
- **Resolution:** 1920x1080 minimum
- **Frame Rate:** 30fps
- **Audio:** Clear narration, no background music during CLI usage
- **Cursor:** Make sure cursor is visible and smooth

## 📁 Demo Files to Prepare

Create these files before recording:

```bash
# Code file
echo "console.log('Hello, IP World!');" > demo-code.js

# Markdown documentation
cat > algorithm.md << EOF
# Revolutionary Algorithm

This algorithm changes everything.

## Features
- Lightning fast
- Highly accurate
- Patent-pending approach

## Usage
\`\`\`javascript
const result = revolutionaryAlgorithm(data);
\`\`\`
EOF

# Simple text file
echo "This is my important document that needs IP protection." > important-doc.txt

# JSON data
cat > api-spec.json << EOF
{
  "name": "Revolutionary API",
  "version": "2.0.0",
  "endpoints": {
    "/mint": "Mint IP assets",
    "/verify": "Verify ownership"
  }
}
EOF
```

## 🎤 Narration Script

### Opening Hook (10 seconds)
*"What if I told you that you could protect any file as intellectual property with just one command? No wallet management, no blockchain complexity, just simple file-to-IP minting."*

### Problem Statement (20 seconds)
*"Traditional IP minting tools make you type 42-character wallet addresses every single time. Copy from MetaMask, paste into terminal, hope you didn't make a typo. It's 2024 - there has to be a better way."*

### Solution Introduction (30 seconds)
*"Meet StoryLite CLI - the cURL for Intellectual Property. It's a command-line tool that makes IP minting as simple as copying a file. Install once, configure once, then mint forever with just one command."*

### Demo Walkthrough (3-4 minutes)
*Follow the script above with natural commentary*

### Closing (30 seconds)
*"StoryLite CLI transforms the complex world of IP registration into something as simple as 'storylite mint filename'. Whether you're protecting source code, registering digital art, or securing business documents - it's never been this easy. Install StoryLite CLI today and start protecting your intellectual property the modern way."*

## 🚀 Pro Tips for Great Demos

### Before Recording
1. **Clean terminal history:** `history -c`
2. **Test all commands** to ensure they work
3. **Prepare files** in advance
4. **Set up proper lighting** and audio
5. **Practice the script** several times

### During Recording
1. **Type at moderate speed** - not too fast, not too slow
2. **Pause briefly** after each command to let output show
3. **Use consistent timing** between commands
4. **Highlight key information** with mouse cursor
5. **Keep energy high** in narration

### After Recording
1. **Add captions** for accessibility
2. **Include timestamps** in description
3. **Add links** to installation and docs
4. **Create thumbnail** with CLI screenshot
5. **Test on different devices** before publishing

## 📊 Success Metrics

A great demo video should:
- ✅ Show installation to first mint in under 2 minutes
- ✅ Demonstrate at least 3 different file types
- ✅ Highlight the "set once, use forever" benefit
- ✅ Show both basic and advanced usage
- ✅ Include error handling/help system
- ✅ End with clear call-to-action

## 🎯 Call-to-Action

End every demo with:
```
🔗 Install: npm install -g storylite-cli
📚 Docs: https://github.com/story-protocol/storylite-cli
💬 Community: https://discord.gg/storyprotocol
```

---

**Remember:** The goal is to make IP minting look so easy that viewers think "I could do that right now" and immediately want to try it themselves.