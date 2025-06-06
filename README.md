# 🔍 Screen AI Analyzer

An intelligent desktop application that captures screenshots, analyzes multiple-choice questions using OpenAI's Vision API, and displays correct answers with visual overlays.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)

## ✨ Features

- 📷 **Global Screenshot Capture**: Use `Ctrl+Shift+Alt+G` to capture your screen
- 🤖 **AI-Powered Analysis**: Leverages OpenAI's Vision API for question detection
- 🎯 **Answer Overlay**: Visual indicators showing correct answers with coordinates
- 🔧 **Configurable Settings**: Easy API key management and customization
- 📊 **Real-time Logging**: Live feedback on analysis progress
- 🎨 **System Tray Integration**: Minimize to tray with quick access
- 🔒 **Secure Storage**: Local configuration with encrypted API key storage

## 🖼️ Screenshots

![Main Interface](assets/screenshots/main-interface.png)
![Answer Overlay](assets/screenshots/answer-overlay.png)

## 🚀 Quick Start

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tayden1990/screen-ai-analyzer.git
   cd screen-ai-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API key**
   - Launch the application
   - Enter your OpenAI API key in the configuration section
   - Click "Save Configuration"

4. **Run the application**
   ```bash
   npm start
   ```

### Development Mode

```bash
npm run dev
```

## 🎮 Usage

1. **Launch the application**
2. **Configure your OpenAI API key** in the settings
3. **Use the global shortcut** `Ctrl+Shift+Alt+G` to capture your screen
4. **View AI analysis** in real-time logs
5. **See answer overlays** automatically displayed on your screen

## 🛠️ Build & Package

```bash
# Build TypeScript
npm run build

# Package for distribution
npm run package

# Clean build files
npm run clean
```

## 📁 Project Structure

```
screen-ai-analyzer/
├── src/
│   ├── main.ts              # Main Electron process
│   ├── capture/             # Screen capture functionality
│   ├── api/                 # OpenAI API integration
│   ├── overlay/             # Answer overlay management
│   ├── utils/               # Utility functions
│   └── analysis/            # Question parsing logic
├── assets/                  # Icons and resources
├── dist/                    # Compiled JavaScript
└── build/                   # Packaged applications
```

## ⚙️ Configuration

The application stores configuration in your system's user data directory:
- **Windows**: `%APPDATA%/screen-ai-analyzer/config.json`
- **macOS**: `~/Library/Application Support/screen-ai-analyzer/config.json`
- **Linux**: `~/.config/screen-ai-analyzer/config.json`

## 🔧 API Integration

This application uses OpenAI's Vision API (GPT-4o) for image analysis. You'll need:
- A valid OpenAI API key
- Sufficient credits for vision model usage
- Stable internet connection

## 🚨 Security & Privacy

- API keys are stored locally and encrypted
- Screenshots are processed locally before being sent to OpenAI
- No telemetry or usage data is collected
- All network requests use HTTPS encryption

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- 🐛 [Report bugs](https://github.com/tayden1990/screen-ai-analyzer/issues)
- 💬 [Ask questions](https://github.com/tayden1990/screen-ai-analyzer/discussions)
- 📧 Email: taherakbarisaeed@gmail.com
- 📱 Telegram: https://t.me/tayden2023

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Custom overlay themes
- [ ] Batch processing
- [ ] Plugin system
- [ ] Cloud sync options
- [ ] Mobile companion app

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 🙏 Acknowledgments

- OpenAI for the Vision API
- Electron team for the framework
- All contributors and testers

---

**Made with ❤️ by [Taher Akbari Saeed](https://github.com/tayden1990)**

*Star ⭐ this repository if you find it helpful!*