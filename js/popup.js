const prepareProcess = async () => {
  const codes2 = extractCodes(codesField.value);
  await chrome.storage.local.set({
    codes: codes2,
  });
  await chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    /*await chrome.tabs.update(tabs[0].id, {
      url: 'https://redeem.tcg.pokemon.com/en-us/',
    });*/

    // Some codes must be entered
    const codes = extractCodes(codesField.value);
    if (!codes.length) {
      alert('Please enter at least one valid Pokemon TCG code.');
      return;
    }
    await chrome.storage.local.set({
      codes: codes2,
    });

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['js/redeemer.js'],
    });
  });
};

const redeemCode = document.getElementById('redeemCode');
redeemCode.addEventListener('click', () => {
  prepareProcess();
});

const codesField = document.getElementById('codesField');
const codesCount = document.getElementById('codesCount');

const extractCodes = (text) => {
  const regex =
    /^[A-Za-z0-9]{3}-?[A-Za-z0-9]{4}-?[A-Za-z0-9]{3}-?[A-Za-z0-9]{3}$/gm;
  const matches = text.match(regex);
  return matches ?? [];
};

let timeoutId;
codesField.addEventListener('input', (e) => {
  const matches = extractCodes(e.target.value);
  codesCount.innerText = `${matches.length}`;

  // Auto save every 1 second after the last change
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    chrome.storage.local.set({ codes: e.target.value });
  }, 1000);
});

// Load drafting codes
chrome.storage.local.get('codes', (result) => {
  if (result.codes) {
    codesField.value = result.codes;
    codesField.dispatchEvent(new Event('input'));
  }
});
