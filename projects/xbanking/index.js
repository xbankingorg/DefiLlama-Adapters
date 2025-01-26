const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function getSolanaTvl() {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const publicKey = new PublicKey('EjqH5TsEp7Ks1BdVKoLjsNwDsYARzpGDEvhw7srYvs5w');

  const lamports = await connection.getBalance(publicKey);
  const solBalance = lamports / 1e9; 

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  let totalSplTokens = 0;
  for (const { account } of tokenAccounts.value) {
    const info = account.data.parsed.info;
    const tokenAmount = info.tokenAmount;
    const balance = parseFloat(tokenAmount.uiAmountString);
    totalSplTokens += balance;
  }

  const totalBalance = solBalance + totalSplTokens;

  return {
    solBalance,
    totalSplTokens,
    totalBalance,
  };
}

module.exports = {
  solana: {
    tvl: getSolanaTvl,
  },
};
