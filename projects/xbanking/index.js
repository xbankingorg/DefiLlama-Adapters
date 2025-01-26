const axios = require('axios');

async function tvl() {
  const tvl = await axios.get("https://api.xbanking.org/v2/platform/tvl");
  return {
    solana: parseFloat(tvl.data)
  };
}

module.exports = {
  timetravel: false,
  misrepresentedTokens: true,
  methodology: "test tvl xbanking",
  solana: { tvl },
};
