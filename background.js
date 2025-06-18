// Background script for Smart Cookie Manager

chrome.runtime.onInstalled.addListener(() => {
  console.log('Smart Cookie Manager installed');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check chrome pages
  if (tab.url && tab.url.startsWith('chrome://')) {
    return;
  }
  if (changeInfo.status === 'complete' && tab.url) {
    // Reset icon to neutral state initially
    await updateIcon(tabId, 'neutral');
    // Wait a bit for the page to fully load
    setTimeout(async () => {
      try {
        // Inject content script to check for cookie banners
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: checkAndApplyCookiePreferences
        });
      } catch (error) {
        console.error('Error injecting script:', error);
        await updateIcon(tabId, 'neutral');
      }
    }, 1000);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'updateIcon') {
    await updateIcon(sender.tab.id, request.status);

    // Store status for popup
    await chrome.storage.local.set({
      [`status_${sender.tab.id}`]: request.status
    });
  }
});

async function updateIcon(tabId, status) {
  let iconPath;
  let badgeText = '';
  let badgeColor = '';

  switch (status) {
    case 'success':
      iconPath = 'icons/green.png';
      badgeText = '✓';
      badgeColor = '#4CAF50';
      break;
    case 'failed':
      iconPath = 'icons/red.png';
      badgeText = '✗';
      badgeColor = '#F44336';
      break;
    case 'no_cookies':
      iconPath = 'icons/grey.png';
      badgeText = '';
      badgeColor = '#9E9E9E';
      break;
    default:
      iconPath = 'icons/grey.png';
      badgeText = '';
      badgeColor = '#9E9E9E';
  }

  try {
    // Set badge text and color
    await chrome.action.setBadgeText({ tabId: tabId, text: badgeText });
    await chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: badgeColor });

    // Note: Setting custom icons requires actual icon files
    // For now, we'll rely on badge text to show status
  } catch (error) {
    console.error('Error updating icon:', error);
  }
}

// Function to be injected into pages
function checkAndApplyCookiePreferences() {
  // Common cookie banner selectors
  const cookieSelectors = [
    // Generic selectors
    '[id*="cookie"]', '[class*="cookie"]', '[data-testid*="cookie"]',
    '[id*="consent"]', '[class*="consent"]', '[data-testid*="consent"]',
    '[id*="privacy"]', '[class*="privacy"]', '[data-testid*="privacy"]',
    '[id*="gdpr"]', '[class*="gdpr"]', '[data-testid*="gdpr"]',

    // Popular cookie consent tools
    '#onetrust-banner-sdk', '.onetrust-pc-sdk',
    '#cookiebot', '.cookiebot',
    '.cc-window', '.cc-banner',
    '#cookie-law-info-bar', '.cli-bar-container',
    '.cookie-notice', '.cookie-banner',
    '#CybotCookiebotDialog',
    '.trustarc-banner-container',
    '.optanon-alert-box-wrapper'
  ];

  // Button selectors for different actions
  const buttonSelectors = {
    accept: [
      '[id*="accept"]', '[class*="accept"]', 'button[data-testid*="accept"]',
      '[id*="allow"]', '[class*="allow"]', 'button[data-testid*="allow"]',
      '[id*="agree"]', '[class*="agree"]', 'button[data-testid*="agree"]',
      'button:contains("Accept")', 'button:contains("Allow")', 'button:contains("Agree")',
      'button:contains("OK")', 'button:contains("Got it")'
    ],
    settings: [
      '[id*="setting"]', '[class*="setting"]', 'button[data-testid*="setting"]',
      '[id*="preference"]', '[class*="preference"]', 'button[data-testid*="preference"]',
      '[id*="customize"]', '[class*="customize"]', 'button[data-testid*="customize"]',
      '[id*="manage"]', '[class*="manage"]', 'button[data-testid*="manage"]',
      'button:contains("Settings")', 'button:contains("Preferences")',
      'button:contains("Customize")', 'button:contains("Manage")'
    ],
    reject: [
      '[id*="reject"]', '[class*="reject"]', 'button[data-testid*="reject"]',
      '[id*="decline"]', '[class*="decline"]', 'button[data-testid*="decline"]',
      '[id*="deny"]', '[class*="deny"]', 'button[data-testid*="deny"]',
      'button:contains("Reject")', 'button:contains("Decline")'
    ]
  };

  function findElement(selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) { // Check if visible
        return element;
      }
    }
    return null;
  }

  function findElementByText(text, tag = 'button') {
    const elements = document.querySelectorAll(tag);
    for (const element of elements) {
      if (element.textContent.toLowerCase().includes(text.toLowerCase()) &&
        element.offsetParent !== null) {
        return element;
      }
    }
    return null;
  }

  async function applyCookiePreferences() {
    try {
      // Get user preferences
      const preferences = await chrome.storage.sync.get([
        'necessary', 'functional', 'analytics', 'marketing', 'social'
      ]);

      // Check if cookie banner exists
      const cookieBanner = findElement(cookieSelectors);

      if (!cookieBanner) {
        chrome.runtime.sendMessage({ action: 'updateIcon', status: 'no_cookies' });
        return;
      }

      // Try to find settings/preferences button first
      let settingsButton = findElement(buttonSelectors.settings);
      if (!settingsButton) {
        settingsButton = findElementByText('settings') ||
          findElementByText('preferences') ||
          findElementByText('customize');
      }

      if (settingsButton) {
        // Click settings to open detailed preferences
        settingsButton.click();

        // Wait for settings panel to load
        setTimeout(() => {
          applyDetailedPreferences(preferences);
        }, 1000);

      } else {
        // Fallback: use accept/reject based on preferences
        const hasOptionalCookies = preferences.functional ||
          preferences.analytics ||
          preferences.marketing ||
          preferences.social;

        if (hasOptionalCookies) {
          const acceptButton = findElement(buttonSelectors.accept) ||
            findElementByText('accept') ||
            findElementByText('allow') ||
            findElementByText('ok');

          if (acceptButton) {
            acceptButton.click();
            chrome.runtime.sendMessage({ action: 'updateIcon', status: 'success' });
            return;
          }
        } else {
          const rejectButton = findElement(buttonSelectors.reject) ||
            findElementByText('reject') ||
            findElementByText('decline');

          if (rejectButton) {
            rejectButton.click();
            chrome.runtime.sendMessage({ action: 'updateIcon', status: 'success' });
            return;
          }
        }

        chrome.runtime.sendMessage({ action: 'updateIcon', status: 'failed' });
      }

    } catch (error) {
      console.error('Error applying cookie preferences:', error);
      chrome.runtime.sendMessage({ action: 'updateIcon', status: 'failed' });
    }
  }

  function applyDetailedPreferences(preferences) {
    try {
      // Common checkbox patterns for different cookie types
      const cookieTypes = {
        functional: ['functional', 'performance', 'personalization'],
        analytics: ['analytics', 'statistical', 'measurement', 'tracking'],
        marketing: ['marketing', 'advertising', 'targeting', 'promotional'],
        social: ['social', 'social media', 'sharing', 'social sharing']
      };

      let applied = false;

      // Find and set checkboxes based on preferences
      Object.keys(cookieTypes).forEach(type => {
        if (preferences[type] !== undefined) {
          const keywords = cookieTypes[type];

          keywords.forEach(keyword => {
            const checkboxes = document.querySelectorAll(`
                            input[type="checkbox"][id*="${keyword}"],
                            input[type="checkbox"][name*="${keyword}"],
                            input[type="checkbox"][class*="${keyword}"]
                        `);

            checkboxes.forEach(checkbox => {
              if (checkbox.checked !== preferences[type]) {
                checkbox.checked = preferences[type];
                checkbox.dispatchEvent(new Event('change'));
                applied = true;
              }
            });
          });
        }
      });

      // Find and click save/confirm button
      setTimeout(() => {
        const saveButton = findElementByText('save') ||
          findElementByText('confirm') ||
          findElementByText('apply') ||
          findElement(['[id*="save"]', '[class*="save"]', '[id*="confirm"]', '[class*="confirm"]']);

        if (saveButton) {
          saveButton.click();
          chrome.runtime.sendMessage({ action: 'updateIcon', status: 'success' });
        } else if (applied) {
          chrome.runtime.sendMessage({ action: 'updateIcon', status: 'success' });
        } else {
          chrome.runtime.sendMessage({ action: 'updateIcon', status: 'failed' });
        }
      }, 500);

    } catch (error) {
      console.error('Error applying detailed preferences:', error);
      chrome.runtime.sendMessage({ action: 'updateIcon', status: 'failed' });
    }
  }

  // Start the process
  applyCookiePreferences();
}

// Clean up old tab statuses
chrome.tabs.onRemoved.addListener(async (tabId) => {
  try {
    await chrome.storage.local.remove([`status_${tabId}`]);
  } catch (error) {
    console.error('Error cleaning up tab status:', error);
  }
});