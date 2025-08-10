const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("0123456789", 10);

function getAccountNumber() {
  return nanoid();
}

module.exports = { getAccountNumber };
