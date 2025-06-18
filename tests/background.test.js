import { jest } from '@jest/globals';

describe('background.js', () => {
  it('sets icon based on message status', () => {
    global.chrome = {
      action: {
        setIcon: jest.fn()
      }
    };

    const message = { status: 'success' };
    const sender = { tab: { id: 123 } };

    require('../background.js');
    chrome.runtime.onMessage.dispatch(message, sender);

    expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: 'icons/green.png', tabId: 123 });
  });
});