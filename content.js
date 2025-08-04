const keywords = [
  'essential',
  'necessary',
  'strictly necessary',
  'accept essential',
  'save settings',
  'confirm choices',
  'allow necessary',
  'allow essential'
];

function findAndClick() {
  const elements = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');

  for (const element of elements) {
    const elementText = element.innerText.toLowerCase();
    const elementValue = element.value ? element.value.toLowerCase() : '';

    for (const keyword of keywords) {
      if (elementText.includes(keyword) || elementValue.includes(keyword)) {
        console.log('Found potential element:', element);
        element.click();
        return; // Stop after the first likely match is clicked
      }
    }
  }
}

// Run the function after a short delay to allow the cookie banner to appear
setTimeout(findAndClick, 2000);