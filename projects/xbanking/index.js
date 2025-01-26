async function tvl() {
  return {
    solana: 1e18,
  };
}

module.exports = {
  timetravel: false,
  misrepresentedTokens: true,
  methodology: "test tvl xbanking",
  solana: { tvl },
};
