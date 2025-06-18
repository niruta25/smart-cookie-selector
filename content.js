// Content script for Smart Cookie Manager
// This script runs on all web pages to detect and handle cookie banners

(function () {
  // Prevent execution on chrome:// pages
if (window.location.protocol === 'chrome:' || window.location.href.startsWith('chrome://')) {
    // Exit early if we're on a chrome:// page
    return;
}

  'use strict';

  let isProcessing = false;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieManager);
  } else {
    initializeCookieManager();
  }

  function initializeCookieManager() {
    // Don't process the same page multiple times
    if (isProcessing) return;
    isProcessing = true;

    // Wait longer for dynamic content to load (IEEE sites are slow)
    setTimeout(() => {
      detectAndHandleCookieBanner();
    }, 3000);

    // Also check again after 5 seconds for very slow loading banners
    setTimeout(() => {
      detectAndHandleCookieBanner();
    }, 5000);

    // Also watch for dynamically added cookie banners
    observeForCookieBanners();
  }

  function detectAndHandleCookieBanner() {
    console.log('Smart Cookie Manager: Scanning for cookie banners on', window.location.hostname);
    // Enhanced cookie banner detection
    const cookieSelectors = [
      // IEEE-specific selectors
      '#ieee-cookie-banner', '.ieee-cookie-notice', '[data-ieee-cookie]',
      '#osano-cm-dom-info-dialog-open', '.osano-cm-dialog', '.osano-cm-window',

      // OneTrust (commonly used by IEEE sites)
      '#onetrust-banner-sdk', '#onetrust-pc-sdk', '#onetrust-consent-sdk',
      '.onetrust-pc-sdk', '.onetrust-banner-sdk', '.ot-sdk-container',

      // ID-based selectors
      '#cookiebot', '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
      '#cookie-law-info-bar', '#cookie-notice', '#cookieNotice',
      '#gdpr-cookie-banner', '#privacy-notice', '#consent-banner',
      '#cookieConsent', '#cookie-bar', '#cookiebar',

      // Class-based selectors
      '.onetrust-pc-sdk', '.onetrust-banner-sdk',
      '.cookiebot-popup', '.cookiebot-banner',
      '.cc-window', '.cc-banner', '.cc-floating',
      '.cli-bar-container', '.cli-modal-backdrop',
      '.cookie-notice', '.cookie-banner', '.cookie-alert',
      '.gdpr-banner', '.privacy-banner', '.consent-banner',
      '.cookieconsent', '.cookie-consent', '.cookies-banner',
      '.trustarc-banner-container', '.truste-banner',
      '.optanon-alert-box-wrapper',

      // Generic patterns
      '[class*="cookie"][class*="banner"]',
      '[class*="cookie"][class*="notice"]',
      '[class*="cookie"][class*="consent"]',
      '[class*="gdpr"][class*="banner"]',
      '[class*="privacy"][class*="banner"]',
      '[id*="cookie"][id*="banner"]',
      '[id*="consent"][id*="banner"]',

      // Data attribute selectors
      '[data-testid*="cookie"]',
      '[data-testid*="consent"]',
      '[data-cy*="cookie"]',
      '[data-cy*="consent"]'
    ];

    const banner = findVisibleElement(cookieSelectors);

    // Also check for cookie banners in iframes
    if (!banner) {
      const iframes = document.querySelectorAll('iframe');
      for (const iframe of iframes) {
        try {
          if (iframe.contentDocument) {
            const iframeBanner = iframe.contentDocument.querySelector(cookieSelectors.join(','));
            if (iframeBanner && isElementVisible(iframeBanner)) {
              console.log('Smart Cookie Manager: Cookie banner found in iframe');
              handleCookieBanner(iframeBanner);
              return;
            }
          }
        } catch (e) {
          // Cross-origin iframe, can't access
          console.log('Smart Cookie Manager: Cross-origin iframe detected');
        }
      }
    }

    if (banner) {
      console.log('Smart Cookie Manager: Cookie banner detected:', banner.className || banner.id);
      handleCookieBanner(banner);
    } else {
      console.log('Smart Cookie Manager: No cookie banner found');
      // No cookie banner found
      sendStatusUpdate('no_cookies');
    }
  }

  function findVisibleElement(selectors) {
    for (const selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          if (isElementVisible(element)) {
            return element;
          }
        }
      } catch (e) {
        // Invalid selector, skip
        continue;
      }
    }
    return null;
  }

  function isElementVisible(element) {
    if (!element) return false;

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      rect.width > 0 &&
      rect.height > 0;
  }

  async function handleCookieBanner(banner) {
    try {
      // Get user preferences
      const preferences = await chrome.storage.sync.get([
        'necessary', 'functional', 'analytics', 'marketing', 'social'
      ]);

      // If no preferences set, don't auto-apply
      const hasPreferences = Object.keys(preferences).length > 0;
      if (!hasPreferences) {
        sendStatusUpdate('no_cookies');
        return;
      }

      console.log('Applying cookie preferences:', preferences);

      // Try different strategies to apply preferences
      let success = false;

      // Strategy 1: Try to find and use settings/preferences panel
      success = await tryDetailedSettings(banner, preferences);

      if (!success) {
        // Strategy 2: Use simple accept/reject buttons
        success = await trySimpleButtons(banner, preferences);
      }

      if (!success) {
        // Strategy 3: Try to find toggles directly
        success = await tryDirectToggles(banner, preferences);
      }

      sendStatusUpdate(success ? 'success' : 'failed');

    } catch (error) {
      console.error('Error handling cookie banner:', error);
      sendStatusUpdate('failed');
    }
  }

  async function tryDetailedSettings(banner, preferences) {
    const settingsSelectors = [
      // Button text patterns
      'button:contains("Settings")', 'button:contains("Preferences")',
      'button:contains("Customize")', 'button:contains("Manage")',
      'button:contains("Options")', 'button:contains("Configure")',

      // ID and class patterns
      '[id*="setting"]', '[class*="setting"]',
      '[id*="preference"]', '[class*="preference"]',
      '[id*="customize"]', '[class*="customize"]',
      '[id*="manage"]', '[class*="manage"]',
      '[id*="option"]', '[class*="option"]',
      '[id*="configure"]', '[class*="configure"]',

      // Data attributes
      '[data-testid*="setting"]', '[data-testid*="preference"]',
      '[data-cy*="setting"]', '[data-cy*="preference"]'
    ];

    // Also search by text content
    const settingsButton = findVisibleElement(settingsSelectors) ||
      findButtonByText(['Settings', 'Preferences', 'Customize', 'Manage', 'Options']);

    if (settingsButton) {
      console.log('Found settings button:', settingsButton);
      settingsButton.click();

      // Wait for settings panel to appear
      await sleep(1500);

      return await applyDetailedPreferences(preferences);
    }

    return false;
  }

  async function trySimpleButtons(banner, preferences) {
    // Determine if user wants to accept optional cookies
    const wantsOptionalCookies = preferences.functional ||
      preferences.analytics ||
      preferences.marketing ||
      preferences.social;

    if (wantsOptionalCookies) {
      // Find accept button
      const acceptSelectors = [
        '[id*="accept"]', '[class*="accept"]',
        '[id*="allow"]', '[class*="allow"]',
        '[id*="agree"]', '[class*="agree"]',
        '[data-testid*="accept"]', '[data-testid*="allow"]'
      ];

      const acceptButton = findVisibleElement(acceptSelectors) ||
        findButtonByText(['Accept', 'Allow', 'Agree', 'OK', 'Got it']);

      if (acceptButton) {
        console.log('Clicking accept button:', acceptButton);
        acceptButton.click();
        return true;
      }
    } else {
      // Find reject button
      const rejectSelectors = [
        '[id*="reject"]', '[class*="reject"]',
        '[id*="decline"]', '[class*="decline"]',
        '[id*="deny"]', '[class*="deny"]',
        '[data-testid*="reject"]', '[data-testid*="decline"]'
      ];

      const rejectButton = findVisibleElement(rejectSelectors) ||
        findButtonByText(['Reject', 'Decline', 'Deny', 'No thanks', 'Reject all']);

      if (rejectButton) {
        console.log('Clicking reject button:', rejectButton);
        rejectButton.click();
        return true;
      }
    }

    return false;
  }

  async function tryDirectToggles(banner, preferences) {
    const cookieTypes = {
      functional: ['functional', 'performance', 'personalization', 'personalize'],
      analytics: ['analytics', 'analytical', 'statistical', 'measurement', 'tracking'],
      marketing: ['marketing', 'advertising', 'targeting', 'promotional', 'ads'],
      social: ['social', 'social media', 'sharing', 'social sharing', 'social network']
    };

    let togglesFound = false;

    Object.keys(cookieTypes).forEach(type => {
      if (preferences[type] !== undefined) {
        const keywords = cookieTypes[type];

        keywords.forEach(keyword => {
          const toggles = document.querySelectorAll(`
                        input[type="checkbox"][id*="${keyword}"],
                        input[type="checkbox"][name*="${keyword}"],
                        input[type="checkbox"][class*="${keyword}"],
                        input[type="radio"][id*="${keyword}"],
                        input[type="radio"][name*="${keyword}"],
                        input[type="radio"][class*="${keyword}"]
                    `);

          toggles.forEach(toggle => {
            if (isElementVisible(toggle) && toggle.checked !== preferences[type]) {
              toggle.checked = preferences[type];
              toggle.dispatchEvent(new Event('change', { bubbles: true }));
              toggle.dispatchEvent(new Event('click', { bubbles: true }));
              togglesFound = true;
            }
          });
        });
      }
    });

    if (togglesFound) {
      // Try to find and click save button
      await sleep(500);
      const saveButton = findButtonByText(['Save', 'Confirm', 'Apply', 'Submit']) ||
        findVisibleElement(['[id*="save"]', '[class*="save"]', '[id*="confirm"]', '[class*="confirm"]']);

      if (saveButton) {
        saveButton.click();
      }

      return true;
    }

    return false;
  }

  async function applyDetailedPreferences(preferences) {
    const cookieTypes = {
      functional: ['functional', 'performance', 'personalization', 'personalize', 'enhance'],
      analytics: ['analytics', 'analytical', 'statistical', 'measurement', 'tracking', 'stats'],
      marketing: ['marketing', 'advertising', 'targeting', 'promotional', 'ads', 'advertisement'],
      social: ['social', 'social media', 'sharing', 'social sharing', 'social network', 'media sharing']
    };

    let preferencesApplied = false;

    // Find and set toggles for each cookie type
    Object.keys(cookieTypes).forEach(type => {
      if (preferences[type] !== undefined) {
        const keywords = cookieTypes[type];
        let found = false;

        for (const keyword of keywords) {
          if (found) break;

          // Try various selector patterns
          const selectors = [
            `input[type="checkbox"][id*="${keyword}" i]`,
            `input[type="checkbox"][name*="${keyword}" i]`,
            `input[type="checkbox"][class*="${keyword}" i]`,
            `input[type="radio"][id*="${keyword}" i]`,
            `input[type="radio"][name*="${keyword}" i]`,
            `input[type="radio"][class*="${keyword}" i]`,
            `[data-category*="${keyword}" i] input`,
            `[data-type*="${keyword}" i] input`
          ];

          for (const selector of selectors) {
            try {
              const elements = document.querySelectorAll(selector);
              elements.forEach(element => {
                if (isElementVisible(element)) {
                  if (element.checked !== preferences[type]) {
                    element.checked = preferences[type];
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    element.dispatchEvent(new Event('click', { bubbles: true }));
                    preferencesApplied = true;
                    found = true;
                  }
                }
              });
            } catch (e) {
              // Invalid selector, continue
            }
          }
        }
      }
    });

    // Wait a bit then try to save
    await sleep(1000);

    const saveSelectors = [
      '[id*="save"]', '[class*="save"]',
      '[id*="confirm"]', '[class*="confirm"]',
      '[id*="apply"]', '[class*="apply"]',
      '[id*="submit"]', '[class*="submit"]',
      '[data-testid*="save"]', '[data-testid*="confirm"]'
    ];

    const saveButton = findVisibleElement(saveSelectors) ||
      findButtonByText(['Save', 'Confirm', 'Apply', 'Submit', 'Save preferences', 'Confirm choices']);

    if (saveButton) {
      console.log('Clicking save button:', saveButton);
      saveButton.click();
    }

    return preferencesApplied;
  }

  function findButtonByText(textArray) {
    const buttons = document.querySelectorAll('button, a[role="button"], input[type="button"], input[type="submit"]');

    for (const button of buttons) {
      if (!isElementVisible(button)) continue;

      const text = button.textContent.toLowerCase().trim();
      for (const searchText of textArray) {
        if (text.includes(searchText.toLowerCase())) {
          return button;
        }
      }
    }

    return null;
  }

  function observeForCookieBanners() {
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const nodeText = node.textContent || '';
              if (nodeText.toLowerCase().includes('cookie') ||
                nodeText.toLowerCase().includes('consent') ||
                nodeText.toLowerCase().includes('privacy')) {
                shouldCheck = true;
              }
            }
          });
        }
      });

      if (shouldCheck) {
        setTimeout(() => {
          detectAndHandleCookieBanner();
        }, 1000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Stop observing after 30 seconds to prevent performance issues
    setTimeout(() => {
      observer.disconnect();
    }, 30000);
  }

  function sendStatusUpdate(status) {
    try {
      chrome.runtime.sendMessage({
        action: 'updateIcon',
        status: status
      });
    } catch (error) {
      console.error('Error sending status update:', error);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

})();