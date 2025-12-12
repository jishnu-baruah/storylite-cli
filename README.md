# StoryLite CLI

> The cURL for Intellectual Property

[![npm version](https://badge.fury.io/js/storylite-cli.svg)](https://badge.fury.io/js/storylite-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A streamlined command-line tool for minting intellectual property assets through Story Protocol. Transform any file into a registered IP asset with a single command - no wallet management, no blockchain complexity, just simple file-to-IP minting.

## ✨ Features

- 🚀 **One-command minting** - Transform files to IP assets instantly
- 🔐 **Built-in wallet management** - No external wallet required
- 📁 **Universal file support** - Code, images, documents, audio, video
- 🎯 **Smart metadata** - Auto-generates titles and descriptions
- 🔧 **Developer-friendly** - Perfect for CI/CD pipelines
- 🎨 **Beautiful output** - Clean, colorful terminal interface
- ⚡ **Lightning fast** - Optimized for speed and reliability

## 🚀 Quick Start

### Installation

```bash
npm install -g storylite-cli
```

### 30-Second Setup

```bash
# 1. Set your API endpoint
storylite config set-endpoint https://universal-minting-engine.vercel.app

# 2. Set your wallet address (one time only!)
storylite config set-address 0x742d35Cc6634C0532925a3b8D404d3aABb8c4532

# 3. Start minting! 🎉
storylite mint ./my-awesome-file.txt
```

That's it! No more typing wallet addresses ever again.

## 📖 Usage

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `mint <file>` | Transform any file into an IP asset | `storylite mint ./code.js` |
| `config set-endpoint <url>` | Set your API endpoint | `storylite config set-endpoint https://api.com` |
| `config set-address <address>` | Set default wallet address | `storylite config set-address 0x742d35...` |
| `config show` | View current configuration | `storylite config show` |

### Real-World Examples

```bash
# 🎨 Mint digital artwork
storylite mint ./my-nft.png --title "Cosmic Dreams" --description "AI-generated space art"

# 💻 Protect your source code
storylite mint ./algorithm.py --title "ML Trading Bot"

# 📄 Register important documents
storylite mint ./whitepaper.pdf --title "Revolutionary Protocol"

# 🎵 Mint audio files
storylite mint ./beat.mp3 --title "Lo-Fi Summer Vibes"

# 🎬 Register video content
storylite mint ./demo.mp4 --title "Product Demo Video"
```

### Advanced Usage

```bash
# Override default address for specific mint
storylite mint ./file.txt --address 0x9876543210...

# Use custom API endpoint
storylite mint ./file.txt --endpoint https://my-custom-api.com

# Verbose mode for debugging
storylite mint ./file.txt --verbose

# Batch minting (run multiple commands)
storylite mint ./file1.txt && storylite mint ./file2.jpg && storylite mint ./file3.pdf
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

```bash
# Check if everything is working
storylite --help

# Set your API endpoint (required)
storylite config set-endpoint https://universal-minting-engine.vercel.app

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

### Environment Variables

```bash
# Enable verbose mode globally
export STORYLITE_VERBOSE=true

# Use custom config location
export STORYLITE_CONFIG_DIR=/path/to/config
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
storylite mint ./business-plan.pdf --title "Q4 Strategy Document"

# Register brand assets
storylite mint ./logo.svg --title "Company Logo 2024"

# Mint product designs
storylite mint ./product-spec.pdf --title "Product Requirements v3.0"
```

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
git clone https://github.com/story-protocol/storylite-cli.git
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
3. Try the default endpoint: `storylite config set-endpoint https://universal-minting-engine.vercel.app`

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
- **🐛 Issues:** [GitHub Issues](https://github.com/story-protocol/storylite-cli/issues)
- **💬 Community:** [Discord](https://discord.gg/storyprotocol)
- **🐦 Updates:** [Twitter](https://twitter.com/storyprotocol)

---

<div align="center">

**Made with ❤️ by the Story Protocol team**

[Website](https://story.foundation) • [Documentation](https://docs.story.foundation) • [Discord](https://discord.gg/storyprotocol) • [Twitter](https://twitter.com/storyprotocol)

</div>