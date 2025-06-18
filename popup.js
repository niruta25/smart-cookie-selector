document.addEventListener('DOMContentLoaded', async () => {
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');
    // const scanBtn = document.getElementById('scanBtn');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    
    // Load saved preferences
    await loadPreferences();
    await updateStatus();
    
    saveBtn.addEventListener('click', savePreferences);
    resetBtn.addEventListener('click', resetPreferences);
    // scanBtn.addEventListener('click', manualScan);
    
    async function loadPreferences() {
        try {
            const result = await chrome.storage.sync.get([
                'functional', 'analytics', 'marketing', 'social'
            ]);
            
            document.getElementById('functional').checked = result.functional || false;
            document.getElementById('analytics').checked = result.analytics || false;
            document.getElementById('marketing').checked = result.marketing || false;
            document.getElementById('social').checked = result.social || false;
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
    
    async function savePreferences() {
        try {
            const preferences = {
                necessary: true, // Always true
                functional: document.getElementById('functional').checked,
                analytics: document.getElementById('analytics').checked,
                marketing: document.getElementById('marketing').checked,
                social: document.getElementById('social').checked
            };
            
            await chrome.storage.sync.set(preferences);
            
            // Show success feedback
            statusIcon.textContent = '✅';
            statusText.textContent = 'Preferences Saved!';
            
            setTimeout(() => {
                updateStatus();
            }, 2000);
            
        } catch (error) {
            console.error('Error saving preferences:', error);
            statusIcon.textContent = '❌';
            statusText.textContent = 'Save Failed';
        }
    }
    
    async function resetPreferences() {
        try {
            await chrome.storage.sync.clear();
            
            // Reset checkboxes
            document.getElementById('functional').checked = false;
            document.getElementById('analytics').checked = false;
            document.getElementById('marketing').checked = false;
            document.getElementById('social').checked = false;
            
            statusIcon.textContent = '🔄';
            statusText.textContent = 'Preferences Reset';
            
            setTimeout(() => {
                updateStatus();
            }, 2000);
            
        } catch (error) {
            console.error('Error resetting preferences:', error);
        }
    }
    
    async function updateStatus() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentTab = tabs[0];
            
            if (currentTab) {
                const result = await chrome.storage.local.get([`status_${currentTab.id}`]);
                const tabStatus = result[`status_${currentTab.id}`] || 'neutral';
                
                switch (tabStatus) {
                    case 'success':
                        statusIcon.textContent = '✅';
                        statusText.textContent = 'Preferences Applied';
                        break;
                    case 'failed':
                        statusIcon.textContent = '❌';
                        statusText.textContent = 'Application Failed';
                        break;
                    case 'no_cookies':
                        statusIcon.textContent = '⚪';
                        statusText.textContent = 'No Cookie Banner';
                        break;
                    default:
                        statusIcon.textContent = '⚪';
                        statusText.textContent = 'Ready';
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
});