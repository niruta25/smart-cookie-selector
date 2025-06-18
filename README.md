# Smart Cookie Manager Chrome Extension

A Chrome extension that automatically manages cookie preferences across websites based on your one-time settings.

## Features

- 🍪 **One-time Setup**: Configure your cookie preferences once
- 🤖 **Auto-Application**: Automatically applies preferences on all websites
- 🎯 **Smart Detection**: Detects various cookie banner types and consent management platforms
- 📊 **Visual Feedback**: 
  - ✅ Green checkmark when preferences are successfully applied
  - ❌ Red X when application fails
  - ⚪ Gray circle when no cookie banners are present
- 🔧 **Granular Control**: Separate controls for different cookie types:
  - Necessary cookies (always enabled)
  - Functional cookies
  - Analytics cookies
  - Marketing cookies
  - Social media cookies

## Installation

### From Source (Development)

1. **Clone or Download** this repository
2. **Open Chrome Extensions page**: 
   - Go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
3. **Load the extension**:
   - Click "Load unpacked"
   - Select the folder containing the extension files
4. **Pin the extension** to your toolbar for easy access

### File Structure

```
smart-cookie-manager/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js           # Content script for web pages
├── icons/              # Extension icons (you'll need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Setup Instructions

### 1. Create Icon Files

Create the following icon files in an `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

You can use any image editor or online icon generator. The icons should represent cookies or privacy/settings.

### 2. Configure Your Preferences

1. Click the extension icon in your browser toolbar
2. Set your cookie preferences:
   - **Necessary Cookies**: Always enabled (required for website functionality)
   - **Functional Cookies**: Enable for enhanced website features
   - **Analytics Cookies**: Enable to help websites improve their services
   - **Marketing Cookies**: Enable for personalized ads
   - **Social Media Cookies**: Enable for social media integration
3. Click "Save Preferences"

### 3. How It Works

- The extension automatically detects cookie banners on websites
- It applies your saved preferences without manual intervention
- The extension icon shows the status:
  - **Green badge (✓)**: Preferences successfully applied
  - **Red badge (✗)**: Failed to apply preferences
  - **No badge**: No cookie banner detected

## Supported Cookie Management Platforms

The extension works with popular cookie consent management platforms including:

- OneTrust
- Cookiebot
- Cookie Consent by Osano
- TrustArc
- GDPR Cookie Consent
- And many more generic cookie banners

## Technical Details

### Permissions Required

- `storage`: Store user preferences
- `activeTab`: Access current tab for cookie banner detection
- `scripting`: Inject scripts to handle cookie banners
- `tabs`: Monitor tab changes
- `host_permissions`: Access all websites to detect cookie banners

### How Detection Works

1. **Content Script**: Runs on every webpage to detect cookie banners
2. **Pattern Matching**: Uses comprehensive selectors to find cookie banners
3. **Preference Application**: Attempts multiple strategies:
   - Detailed settings panels
   - Simple accept/reject buttons
   - Direct toggle manipulation
4. **Status Reporting**: Reports success/failure back to the extension

## Troubleshooting

### Extension Not Working?

1. **Check Permissions**: Ensure the extension has all required permissions
2. **Reload Pages**: Refresh websites after installing the extension
3. **Check Console**: Open Developer Tools (F12) and check for errors
4. **Update Preferences**: Try resetting and reconfiguring your preferences

### Some Sites Not Working?

- Some websites use custom cookie implementations
- The extension continuously improves detection patterns
- You can manually handle cookies on unsupported sites

## Privacy

- **Local Storage**: All preferences are stored locally in your browser
- **No Data Collection**: The extension doesn't collect or transmit any personal data
- **No External Connections**: Works entirely offline

## Development

### Making Changes

1. Edit the source files
2. Reload the extension in `chrome://extensions/`
3. Test on various websites

### Adding New Cookie Banner Patterns

Edit `content.js` and add new selectors to the `cookieSelectors` array to support additional cookie banner types.

### Debugging

- Use Chrome Developer Tools Console to see debug messages
- Check the extension's service worker logs in `chrome://extensions/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source. Feel free to use, modify, and distribute according to your needs.

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Open an issue on the GitHub repository
3. Include details about the website and browser version

---

**Note**: This extension works best with common cookie consent management systems. Some highly customized implementations may require manual handling.