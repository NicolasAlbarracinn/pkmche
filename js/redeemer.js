var getCodesFromStore = async () => {
  const result = await chrome.storage.local.get(['codes']);
  return result.codes;
};
var delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var inputCodes = (code) => {
  const input = document.getElementById('code');
  input.value = code;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  const element = document.querySelector('[data-testid="verify-code-button"]');
  element.click();
};

var redeemCodes = async () => {
  const codes = await getCodesFromStore();
  let counter = 0;
  const amount = 10;
  await delay(2000);
  for (const [index, code] of codes.entries()) {
    inputCodes(code);
    await delay(2000);
    counter++;
    if (counter === amount || index === codes.length - 1) {
      const redeemButton = document.querySelector(
        '[data-testid="button-redeem"]'
      );
      const clearTable = document.querySelector(
        '[data-testid="button-clear-table"]'
      );
      if (redeemButton.disabled) {
        clearTable.click();
        await delay(1000);
      } else {
        redeemButton.click();
        await delay(9000);
        clearTable.click();
        await delay(2000);
      }
      counter = 0;
    }
  }
};

redeemCodes();
