# StoryLite CLI

> The cURL for Intellectual Property

[![npm version](https://badge.fury.io/js/storylite-cli.svg)](https://badge.fury.io/js/storylite-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A streamlined command-line tool for minting intellectual property assets through Story Protocol. Transform any file into a registered IP asset with a single command - no wallet management, no blockchain complexity, just simple file-to-IP minting.

## ✨ Features

### 🎯 **Core Features**
- 🚀 **One-command minting** - Transform files to IP assets instantly
- 🔐 **Built-in wallet management** - No external wallet required
- 📁 **Universal file support** - Code, images, documents, audio, video
- 🎯 **Smart metadata** - Auto-generates titles and descriptions
- 🔧 **Developer-friendly** - Perfect for CI/CD pipelines
- 🎨 **Beautiful output** - Clean, colorful terminal interface
- ⚡ **Lightning fast** - Optimized for speed and reliability

### 🆕 **New in v1.0.10**
- 🔧 **Interactive Setup Wizard** - Get started in 60 seconds with `storylite init`
- 🔐 **Interactive Transaction Mode** - Review and confirm before signing with `--interactive`
- 🆔 **Real IP Asset ID Extraction** - Get actual blockchain identifiers, not just hashes
- 🌐 **Environment Variable Support** - Secure private key storage with `STORYLITE_PRIVATE_KEY`
- 📋 **Enhanced Configuration** - Environment detection and smart defaults
- 🎯 **Improved UX** - Context-aware help and better error messages

## 🚀 Quick Start

### Installation

```bash
npm install -g storylite-cli
```

### 30-Second Setup

```bash
# 1. Interactive setup wizard (recommended)
storylite init --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532 --yes

# 2. Set up secure environment (optional but recommended)
export STORYLITE_PRIVATE_KEY=0x...

# 3. Start minting with interactive confirmation! 🎉
storylite mint ./my-awesome-file.txt --interactive
```

**New in v1.0.10:** Interactive setup wizard, environment variable support, and transaction confirmation mode!

## 📖 Usage

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `init` | **Interactive setup wizard** - Get started in 60 seconds | `storylite init` |
| `mint <file>` | Transform any file into an IP asset | `storylite mint ./code.js --interactive` |
| `config set-endpoint <url>` | Set your API endpoint | `storylite config set-endpoint https://surreal-base.vercel.app` |
| `config set-address <address>` | Set default wallet address | `storylite config set-address 0x742d35...` |
| `config show` | View current configuration | `storylite config show` |

### Real-World Examples

```bash
# 🚀 Interactive setup (NEW in v1.0.10)
storylite init --address 0x742d35... --yes

# 🔐 Interactive minting with confirmation (NEW)
storylite mint ./my-nft.png --interactive --title "Cosmic Dreams"

# 🎨 Mint digital artwork with private key
storylite mint ./my-nft.png --private-key 0x... --title "Cosmic Dreams" --description "AI-generated space art"

# 💻 Protect your source code
storylite mint ./algorithm.py --interactive --title "ML Trading Bot"

# 📄 Register important documents
storylite mint ./whitepaper.pdf --private-key 0x... --title "Revolutionary Protocol"

# 🎵 Mint audio files with environment variable
export STORYLITE_PRIVATE_KEY=0x...
storylite mint ./beat.mp3 --interactive --title "Lo-Fi Summer Vibes"

# 🎬 Register video content
storylite mint ./demo.mp4 --interactive --title "Product Demo Video"

# 🆔 Get real IP Asset ID (NEW in v1.0.10)
# Output includes: IP Asset ID: 0xc32a8a0ff3beddda58393d022af433e78739fabc-3929
```

### Advanced Usage

```bash
# 🔧 Interactive setup wizard
storylite init                                    # Full interactive setup
storylite init --address 0x... --yes            # Quick setup with defaults

# 🔐 Interactive transaction confirmation (NEW)
storylite mint ./file.txt --interactive          # Review before signing

# 🚀 Direct signing modes
storylite mint ./file.txt --private-key 0x...    # Direct private key
export STORYLITE_PRIVATE_KEY=0x...               # Environment variable
storylite mint ./file.txt --interactive          # Use stored key with confirmation

# 🔍 Debugging and testing
storylite mint ./file.txt --verbose              # Detailed logging
storylite mint ./file.txt --dry-run              # Prepare but don't send

# 🌐 Custom endpoints
storylite mint ./file.txt --endpoint https://my-custom-api.com

# 📊 View configuration and environment
storylite config show                            # Shows env variables too

# 🔄 Batch minting with environment setup
export STORYLITE_PRIVATE_KEY=0x...
storylite mint ./file1.txt --interactive && storylite mint ./file2.jpg --interactive
```

## 📁 Supported File Types

<details>
<summary><strong>🎨 Creative Assets</strong></summary>

- **Images:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`, `.bmp`, `.tiff`
- **Audio:** `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.wma`, `.m4a`
- **Video:** `.mp4`, `.avi`, `.mov`, `.webm`, `.mkv`, `.wmv`, `.flv`
- **3D Models:** `.obj`, `.fbx`, `.dae`, `.stl`, `.blend`
- **Design:** `.psd`, `.ai`, `.sketch`, `.fig`

</details>

<details>
<summary><strong>💻 Code & Development</strong></summary>

- **Web:** `.js`, `.ts`, `.html`, `.css`, `.scss`, `.json`, `.xml`
- **Backend:** `.py`, `.java`, `.cpp`, `.c`, `.cs`, `.php`, `.rb`, `.go`, `.rs`
- **Mobile:** `.swift`, `.kt`, `.dart`
- **Data:** `.sql`, `.yaml`, `.toml`, `.csv`
- **Config:** `.env`, `.config`, `.ini`

</details>

<details>
<summary><strong>📄 Documents & Data</strong></summary>

- **Documents:** `.pdf`, `.doc`, `.docx`, `.txt`, `.md`, `.rtf`
- **Spreadsheets:** `.xls`, `.xlsx`, `.csv`, `.ods`
- **Presentations:** `.ppt`, `.pptx`, `.odp`
- **Archives:** `.zip`, `.rar`, `.7z`, `.tar`, `.gz`
- **Fonts:** `.ttf`, `.otf`, `.woff`, `.woff2`

</details>

**And many more!** If it's a file, StoryLite can mint it as an IP asset.

## 🔧 Configuration

### First-Time Setup

#### 🔧 **Option 1: Interactive Setup Wizard (Recommended)**

```bash
# One command setup - guides you through everything
storylite init --address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532 --yes

# Set up secure environment (optional but recommended)
export STORYLITE_PRIVATE_KEY=0x...

# You're ready to mint!
storylite mint ./myfile.txt --interactive
```

#### ⚙️ **Option 2: Manual Setup**

```bash
# Check if everything is working
storylite --help

# Set your API endpoint (required)
storylite config set-endpoint https://surreal-base.vercel.app

# Set your default wallet address (required)
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532

# Optional: Set API key if your endpoint requires it
storylite config set-key your-api-key-here

# Verify your configuration
storylite config show
```

### Configuration Options

| Setting | Command | Description | Required |
|---------|---------|-------------|----------|
| **Endpoint** | `set-endpoint <url>` | API server URL | ✅ Yes |
| **Address** | `set-address <address>` | Your wallet address | ✅ Yes |
| **API Key** | `set-key <key>` | Authentication key | ❌ Optional |

### Environment Variables (New in v1.0.10)

```bash
# 🔐 Private Key (Enables interactive mode)
export STORYLITE_PRIVATE_KEY=0x2d0b3c7d8cf92649839f607e42d3bc23fd28d7cb0739fa4cba74b3b4d2c50550

# 🌐 Custom Endpoint Override
export STORYLITE_ENDPOINT=https://your-custom-api.com

# 📝 Enable Verbose Logging
export STORYLITE_VERBOSE=true

# 📁 Custom Config Location
export STORYLITE_CONFIG_DIR=/path/to/config
```

#### 🔐 **Secure Transaction Signing Options**

| Method | Security | Convenience | Best For |
|--------|----------|-------------|----------|
| `--interactive` | ✅ High | ✅ High | **Recommended** - Review before signing |
| `--private-key 0x...` | ⚠️ Medium | ✅ High | Quick testing, CI/CD |
| Environment variable | ✅ High | ✅ High | Production, repeated use |

**Interactive Mode Example:**
```bash
export STORYLITE_PRIVATE_KEY=0x...
storylite mint ./file.txt --interactive

# Shows transaction details and asks for confirmation:
# 📋 Transaction Details:
#    To: 0xbe39E1C756e921BD25DF86e7AAa31106d1eb0424
#    Data: 0xf1c42a22...
#    Gas Estimate: 1137427
# ❓ Do you want to sign and send this transaction? (y/N): y
```

## 🎯 Use Cases

### For Developers
```bash
# Protect your source code
storylite mint ./src/main.js --title "Core Algorithm"

# Register API documentation
storylite mint ./api-docs.md --title "API Documentation v2.1"

# Mint build artifacts
storylite mint ./dist/app.js --title "Production Build"
```

### For Creators
```bash
# Register digital art
storylite mint ./artwork.png --title "Digital Masterpiece #001"

# Protect music compositions
storylite mint ./song.mp3 --title "Summer Nights" --description "Original composition"

# Register video content
storylite mint ./tutorial.mp4 --title "How to Build Apps"
```

### For Businesses
```bash
# Protect proprietary documents
storylite mint ./business-plan.pdf --interactive --title "Q4 Strategy Document"

# Register brand assets
storylite mint ./logo.svg --interactive --title "Company Logo 2024"

# Mint product designs
storylite mint ./product-spec.pdf --interactive --title "Product Requirements v3.0"
```

## 🆔 **IP Asset ID Extraction (New in v1.0.10)**

StoryLite CLI now extracts and displays the **real IP Asset ID** from blockchain transactions:

```bash
storylite mint ./myfile.txt --interactive --title "My IP Asset"

# Output includes real blockchain identifiers:
✓ IP Asset created successfully!
🔗 Transaction Hash: 0xc4578e2bf3fb90dafdb1443f3c47c2889920f9dfa21d871d209cdda3a74712a5
🆔 IP Asset ID: 0xc32a8a0ff3beddda58393d022af433e78739fabc-3929
📦 IPFS Hash: QmZM3KmPAYssc4TihpGTNS1zaZkk9sGm1tbjLh3m5XksgY
🔍 View on explorer: https://aeneid.storyscan.io/tx/0x...
```

**What you get:**
- **🔗 Transaction Hash**: Blockchain transaction confirmation
- **🆔 IP Asset ID**: Unique identifier for your IP asset (use for licensing, derivatives, etc.)
- **📦 IPFS Hash**: Decentralized storage location
- **🔍 Explorer Link**: View transaction details on blockchain explorer

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
name: Mint IP Assets
on:
  push:
    branches: [main]

jobs:
  mint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install StoryLite CLI
        run: npm install -g storylite-cli
      
      - name: Configure CLI
        run: |
          storylite config set-endpoint ${{ secrets.STORYLITE_ENDPOINT }}
          storylite config set-address ${{ secrets.WALLET_ADDRESS }}
      
      - name: Mint source code
        run: storylite mint ./src/main.js --title "Release ${{ github.sha }}"
```

### Docker

```dockerfile
FROM node:18-alpine
RUN npm install -g storylite-cli
COPY . /app
WORKDIR /app
RUN storylite config set-endpoint https://api.storylite.com
CMD ["storylite", "mint", "./dist/app.js"]
```

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/jishnu-baruah/storylite-cli.git
cd storylite-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm run test:all

# Install locally for testing
npm run package:local
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build TypeScript to JavaScript |
| `npm run dev` | Build with watch mode |
| `npm test` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run lint` | Check code style |
| `npm run format` | Format code with Prettier |
| `npm run verify` | Run all quality checks |

## 📋 Requirements

- **Node.js:** 18.0.0 or higher
- **OS:** Windows, macOS, or Linux
- **Network:** Internet connection for blockchain interaction
- **Wallet:** Valid Ethereum address (you don't need the private key for minting)

## 🔍 Troubleshooting

### Common Issues

<details>
<summary><strong>❌ "No wallet address provided"</strong></summary>

**Solution:** Set your default address first
```bash
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532
```

</details>

<details>
<summary><strong>❌ "Unable to connect to API endpoint"</strong></summary>

**Solutions:**
1. Check your internet connection
2. Verify the endpoint URL: `storylite config show`
3. Try the default endpoint: `storylite config set-endpoint https://surreal-base.vercel.app`

</details>

<details>
<summary><strong>❌ "File not found"</strong></summary>

**Solutions:**
1. Check the file path is correct
2. Use absolute path: `storylite mint /full/path/to/file.txt`
3. Check file permissions

</details>

<details>
<summary><strong>❌ "Invalid Ethereum address format"</strong></summary>

**Solution:** Ensure address is 42 characters starting with 0x
```bash
# ✅ Correct format
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532

# ❌ Wrong format
storylite config set-address 742d35Cc6634C0532925a3b8D404d3aABb8c4532
```

</details>

### Getting Help

```bash
# General help
storylite --help

# Command-specific help
storylite mint --help
storylite config --help

# Verbose mode for debugging
storylite mint ./file.txt --verbose
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Quick Start
```bash
# Fork and clone the repo
git clone https://github.com/your-username/storylite-cli.git
cd storylite-cli

# Install dependencies
npm install

# Make your changes
# ...

# Test your changes
npm run test:all
npm run verify

# Submit a pull request
```

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Use conventional commit messages
- Ensure all checks pass

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 Support & Community

- **📚 Documentation:** [docs.story.foundation](https://docs.story.foundation)
- **🐛 Issues:** [GitHub Issues](https://github.com/jishnu-baruah/storylite-cli/issues)
- **💬 Community:** [Discord](https://discord.gg/storyprotocol)
- **🐦 Updates:** [Twitter](https://twitter.com/storyprotocol)

---

<div align="center">

**Made with ❤️ by the Story Protocol team**

[Website](https://story.foundation) • [Documentation](https://docs.story.foundation) • [Discord](https://discord.gg/storyprotocol) • [Twitter](https://twitter.com/storyprotocol)

</div>