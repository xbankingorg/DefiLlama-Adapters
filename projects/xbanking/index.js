const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function tvl() {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const ownerAddress = new PublicKey('EjqH5TsEp7Ks1BdVKoLjsNwDsYARzpGDEvhw7srYvs5w');

  const balances = {};

  const lamports = await connection.getBalance(ownerAddress);
  const solBalance = lamports / 1e9; 
  balances["solana"] = solBalance;

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    { programId: TOKEN_PROGRAM_ID }
  );

  for (const { account } of tokenAccounts.value) {
    const info = account.data.parsed.info;
    const mint = info.mint;
    const tokenAmount = info.tokenAmount.uiAmount; 

    if (!balances[mint]) {
      balances[mint] = 0;
    }
    balances[mint] += tokenAmount;
  }

  return balances;
}

module.exports = {
  timetravel: false,
  doublecounted: false,
  methodology: "summ native SOL and all SPL-tokens on account, that we get TVL from 1 onchain staking node",
  solana: {
    tvl,
  },
};
