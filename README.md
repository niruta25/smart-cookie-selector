# smart-cookie-selector
An intelligent Chrome extension that automatically applies your cookie preferences across websites in any language using AI-powered detection.

## 🚀 Features

* One-time Setup: Configure your language and cookie preferences once
* Multilingual Support: Works with cookie banners in 12+ languages
* Smart Detection: AI-powered cookie banner recognition
* Visual Status: Green ✅, Red ❌, or Grey ⚪ indicators on extension icon
* Auto-Apply: Automatically applies preferences on new tabs
* Statistics: Track success rate and processed sites
* Cross-Platform: Works on desktop Chrome (mobile and Safari support planned)

## 📦 Installation
### From Chrome Web Store (Coming Soon)

* Visit the Chrome Web Store
* Search for "Smart Cookie Manager"
* Click "Add to Chrome"

### Manual Installation (Developer Mode)

* Download or clone this repository
* Open Chrome and go to chrome://extensions/
* Enable "Developer mode" in the top right
* Click "Load unpacked" and select the project folder
* The extension will appear in your extensions list

## 🛠️ Project Structure
smart-cookie-selector/
├── src/
│   ├── manifest.json         # Extension manifest
│   ├── popup.html            # Extension popup interface
│   ├── popup.js              # Popup functionality
│   ├── content.js            # Content script for cookie detection
│   ├── background.js         # Background service worker
│   └── icons/
│       ├── icon-16.png       # 16x16 icon
│       ├── icon-32.png       # 32x32 icon
│       ├── icon-48.png       # 48x48 icon
│       └── icon-128.png      # 128x128 icon
├── docs/
│   ├── PRIVACY.md            # Privacy policy
│   ├── CONTRIBUTING.md       # Contribution guidelines
│   └── API.md                # API documentation
├── tests/
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── build/
│   └── dist/                 # Built extension files
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Continuous integration
│   │   └── release.yml      # Release automation
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md    # Bug report template
│       └── feature_request.md # Feature request template
├── package.json              # Node.js dependencies
├── webpack.config.js         # Build configuration
├── README.md                 # This file
├── LICENSE                   # License file
└── CHANGELOG.md             # Version history

## 🎯 How It Works

* Initial Setup: Configure your preferred language and cookie categories
* Smart Detection: Extension detects cookie banners using AI-powered selectors
* Preference Application: Automatically applies your preferences based on banner type
* Visual Feedback: Icon changes color to indicate success/failure/neutral state
* Statistics Tracking: Monitors success rate and processed sites

## 🔧 Configuration
Supported Languages

English, Spanish, French, German, Italian, Portuguese
Russian, Chinese, Japanese, Korean, Arabic, Hindi

## Cookie Categories

* Necessary: Always enabled (required for site functionality)
* Functional: Enhanced site features
* Analytics: Usage statistics and improvements
* Marketing: Targeted advertising
* Personalization: Customized content and recommendations

## 🧪 Development
Prerequisites

* Node.js 16+
* Chrome browser
* Git