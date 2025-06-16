# Privacy Policy - Smart Cookie Selector

**Last updated: June 16, 2025**

## Overview

Smart Cookie Selector is designed with privacy as a core principle. This document explains how the extension handles your data and protects your privacy.

## 🔒 Data Collection and Usage

### What We Collect

**Local Configuration Data:**
- Your language preference
- Cookie category preferences (functional, analytics, marketing, personalization)
- Basic usage statistics (number of sites processed, success rate)

**We DO NOT collect:**
- Personal information (name, email, etc.)
- Browsing history
- Website content
- Login credentials
- Financial information
- Location data

### How We Use Data

**Configuration Data:**
- Used to automatically apply your preferences on websites
- Stored locally in Chrome's secure storage system
- Never transmitted to external servers

**Usage Statistics:**
- Used to improve extension functionality
- Aggregated and anonymized
- Stored locally on your device only

## 🛡️ Data Protection

### Local Storage Only

All extension data is stored locally on your device using Chrome's secure storage API:
- `chrome.storage.sync` - For user preferences (synced across your Chrome installations)
- `chrome.storage.local` - For temporary data and statistics

### No External Servers

The extension operates entirely on your device:
- ✅ No data sent to our servers
- ✅ No analytics tracking
- ✅ No third-party data sharing
- ✅ No cloud storage of personal data

### Encryption

Chrome automatically encrypts extension storage data when:
- Device is locked
- Chrome profile is protected
- Sync data is transmitted between devices

## 🌐 Website Interaction

### How the Extension Interacts with Websites

**Content Script Activities:**
- Detects cookie banners on web pages
- Reads button text and form elements to identify cookie options
- Clicks buttons and checkboxes based on your preferences
- Does not read or store website content beyond cookie banners

**Permissions Required:**
- `activeTab` - Access current tab to detect cookie banners
- `storage` - Store your preferences locally
- `scripting` - Inject scripts to interact with cookie banners
- `<all_urls>` - Work on all websites (necessary for universal cookie banner detection)

### Data Processing

The extension processes cookie banners by:
1. Scanning page content for cookie-related elements
2. Analyzing text in multiple languages
3. Applying your pre-configured preferences
4. Recording success/failure for improvement

**No personal data from websites is collected or stored.**

## 🔄 Data Sharing

### Chrome Sync

If you enable Chrome Sync:
- Your cookie preferences sync across your Chrome installations
- Data is encrypted by Google during transmission
- We have no access to your synced data
- You can disable sync for extensions in Chrome settings

### Third Parties

We do not:
- Share data with third parties
- Sell user data
- Use data for advertising
- Integrate with social media platforms
- Send data to analytics services

## 🛠️ User Control

### Managing Your Data

**View Stored Data:**
- Open extension popup to see your preferences
- Check Chrome's extension storage: `chrome://extensions/` → Developer mode → Extension details → Storage

**Delete Data:**
- Reset preferences in extension popup
- Remove extension to delete all local data
- Clear Chrome extension data: Settings → Privacy → Clear browsing data → Advanced → Hosted app data

**Export/Import (Planned):**
- Future versions will allow exporting preferences
- Import settings from backup files
- Share configurations with other devices

## 📊 Analytics and Telemetry

### What We Track

**Local Statistics Only:**
- Number of websites where cookie banners were processed
- Success/failure rate of preference application
- Most common cookie banner types encountered

**What We Don't Track:**
- Which specific websites you visit
- Your browsing patterns
- Time spent on sites
- Personal preferences beyond cookie settings

### Purpose

Statistics help us:
- Improve cookie banner detection accuracy
- Add support for new website types
- Optimize extension performance
- Prioritize development efforts

## ⚖️ Legal Compliance

### GDPR Compliance

As a privacy-focused tool, we comply with GDPR by:
- Processing minimal data necessary for functionality
- Storing data locally (data controller is the user)
- Providing clear information about data usage
- Enabling easy data deletion
- Not requiring consent for basic functionality

### Other Regulations

The extension complies with:
- CCPA (California Consumer Privacy Act)
- PIPEDA (Canada