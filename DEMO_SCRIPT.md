# 🎬 StoryLite CLI Demo Script

> **Copy-paste ready commands for a perfect demo video**

## 🎯 Pre-Demo Checklist

- [ ] Clean terminal (clear history: `history -c`)
- [ ] Good lighting and audio setup
- [ ] Run `demo-setup.bat` (Windows) or `demo-setup.sh` (Mac/Linux)
- [ ] Practice the script 2-3 times
- [ ] Set terminal to good size/font for recording

## 🎬 Demo Script (Copy these commands exactly)

### 1. Opening - Show the Problem (30 seconds)

```bash
# Show the old painful way (don't actually run this)
echo "The old way: storylite mint file.txt --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532"
echo "Every. Single. Time. 😤"
```

**Say:** *"Tired of typing 42-character wallet addresses every time you want to mint IP assets? There's a better way."*

### 2. Installation (45 seconds)

```bash
# Show installation (if not already installed)
npm install -g storylite-cli

# Show it works
storylite --help
```

**Say:** *"Meet StoryLite CLI - the cURL for Intellectual Property. Install once, use forever."*

### 3. One-Time Setup (90 seconds)

```bash
# Step 1: Set endpoint
storylite config set-endpoint https://universal-minting-engine.vercel.app

# Step 2: Set wallet address (ONCE!)
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532

# Step 3: Verify setup
storylite config show
```

**Say:** *"Two simple commands for setup. Set your endpoint and wallet address once, then never type them again."*

### 4. The Magic - Effortless Minting (2 minutes)

```bash
# Navigate to demo files
cd demo-files

# Mint JavaScript code
storylite mint demo-code.js

# Mint documentation with custom title
storylite mint algorithm-docs.md --title "Revolutionary Algorithm Docs"

# Mint API specification
storylite mint api-spec.json --title "StoryLite API v2.0"

# Mint business document with full metadata
storylite mint business-plan.txt --title "Confidential Business Plan" --description "Strategic roadmap and financial projections"
```

**Say:** *"Look how simple this is! Any file, any type, one command. No addresses, no complexity, just pure simplicity."*

### 5. Advanced Features (90 seconds)

```bash
# Show verbose mode for transparency
storylite mint demo-code.js --verbose

# Override address for specific use case
storylite mint api-spec.json --address 0x9876543210987654321098765432109876543210 --title "Client Project API"

# Show configuration anytime
storylite config show
```

**Say:** *"Need transparency? Use verbose mode. Different address for a client project? Override it. StoryLite adapts to your workflow."*

### 6. Help System (30 seconds)

```bash
# Show beautiful help
storylite mint --help

# Show config help
storylite config --help
```

**Say:** *"Professional documentation built right in. Everything you need to know, when you need it."*

### 7. Real-World Examples (60 seconds)

```bash
# Show different use cases
echo "# Developer protecting source code"
storylite mint demo-code.js --title "Core Trading Algorithm v3.0"

echo "# Business protecting documents"  
storylite mint business-plan.txt --title "Q4 Strategic Plan"

echo "# API documentation"
storylite mint algorithm-docs.md --title "Technical Documentation"
```

**Say:** *"Whether you're a developer, business owner, or creator - protect your intellectual property with one simple command."*

## 🎤 Narration Script

### Opening Hook (15 seconds)
*"What if protecting your intellectual property was as simple as copying a file? No wallet management, no blockchain complexity, just one command."*

### Problem (20 seconds)  
*"Traditional IP tools make you type 42-character addresses every single time. It's 2024 - there has to be a better way."*

### Solution (30 seconds)
*"Meet StoryLite CLI. Install once, configure once, then mint any file as an IP asset with just one command."*

### Demo (3-4 minutes)
*Follow the commands above with natural commentary*

### Closing (20 seconds)
*"StoryLite CLI makes IP protection as simple as 'storylite mint filename'. Install it today and start protecting your work the modern way."*

## 🎨 Visual Tips

### Terminal Settings
```bash
# Use these settings for best visual results:
# Font: JetBrains Mono or Fira Code
# Size: 14-16pt (readable in video)
# Theme: Dark with good contrast
# Colors: Ensure green/red/blue are vibrant
```

### Timing
- **Type at moderate speed** (not too fast/slow)
- **Pause 2-3 seconds** after each command output
- **Highlight important text** with cursor
- **Keep energy high** in narration

### What to Emphasize
- ✅ **Green checkmarks** - success indicators
- 🔗 **Transaction hashes** - proof it worked  
- 💡 **Helpful tips** - user-friendly design
- 📋 **IP Asset IDs** - the actual result

## 🚀 Pro Demo Tips

### Before Recording
1. **Test every command** to ensure it works
2. **Clear terminal history** for clean start
3. **Practice narration** with timing
4. **Check audio levels** and lighting

### During Recording  
1. **Speak clearly** and with enthusiasm
2. **Don't rush** - let viewers absorb the output
3. **Point out key features** as they appear
4. **Show confidence** in the tool

### After Recording
1. **Add captions** for accessibility  
2. **Include timestamps** in description
3. **Add installation links** in description
4. **Create engaging thumbnail**

## 📊 Success Metrics

A great demo should:
- ✅ Show setup-to-first-mint in under 2 minutes
- ✅ Demonstrate 3+ different file types
- ✅ Highlight the "configure once" benefit  
- ✅ Show both basic and advanced usage
- ✅ Include the beautiful help system
- ✅ End with clear next steps

## 🎯 Call-to-Action

End with:
```
🚀 Get Started:
npm install -g storylite-cli

📚 Documentation:
https://github.com/story-protocol/storylite-cli

💬 Community:
https://discord.gg/storyprotocol
```

---

**Remember:** The goal is to make viewers think "I need this right now" and immediately want to try it themselves!