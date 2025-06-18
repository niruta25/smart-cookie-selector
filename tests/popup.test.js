import { jest } from '@jest/globals';

describe('popup.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="prefsForm">
        <input type="checkbox" name="analytics" />
        <input type="checkbox" name="ads" />
        <button type="submit">Save Preferences</button>
      </form>
    `;
    global.chrome = {
      storage: {
        local: {
          set: jest.fn((data, cb) => cb())
        }
      }
    };
    require('../popup.js');
  });

  it('saves preferences when form is submitted', () => {
    document.querySelector('input[name=analytics]').checked = true;
    document.querySelector('input[name=ads]').checked = false;

    const form = document.getElementById('prefsForm');
    form.dispatchEvent(new Event('submit'));

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith(
      { cookiePrefs: { analytics: true, ads: false } },
      expect.any(Function)
    );
  });
});
