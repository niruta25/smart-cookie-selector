import { jest } from '@jest/globals';

describe('content.js integration', () => {
  beforeAll(() => {
    global.chrome = {
      storage: {
        local: {
          get: (key, cb) => cb({ cookiePrefs: { analytics: false, ads: false } })
        }
      },
      runtime: {
        sendMessage: jest.fn(),
        getURL: path => `chrome-extension://${path}`
      }
    };
    document.body.innerHTML = `
      <div>Accept all cookies</div>
      <div>Only necessary cookies</div>
    `;
    const textNode1 = document.createTextNode('Accept all cookies');
    const textNode2 = document.createTextNode('Only necessary cookies');
    document.body.appendChild(textNode1);
    document.body.appendChild(textNode2);
  });

  it('executes cookie preferences with mocked AI model', async () => {
    const mockModel = {
      embed: async ([...args]) => ({
        arraySync: () => args.map(str => str.split('').map(c => c.charCodeAt(0)))
      })
    };

    jest.mock('https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder', () => ({
      load: async () => mockModel
    }));

    require('../content.js');
  });
});
