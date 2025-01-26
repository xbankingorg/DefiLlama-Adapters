const {
  sumTokens2,
  exportDexTVL,
  getMultipleAccounts,
  getStakedSol,
  getConnection,
} = require('../helper/solana')
const sdk = require('@defillama/sdk')

const DEX_PROGRAM_ID = '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP'
const STAKED_SOL_ADDRESS = 'EjqH5TsEp7Ks1BdVKoLjsNwDsYARzpGDEvhw7srYvs5w'
const OWNERS = [
  'EjqH5TsEp7Ks1BdVKoLjsNwDsYARzpGDEvhw7srYvs5w',
  '5MfcrehHKskxjiYTTqcKubtqmrMJuyNParmeQYgNLdkA',
]

const DexTVL = exportDexTVL(DEX_PROGRAM_ID, null, 'solana') 

async function partialBalances(api) {
  const balances = await sumTokens2({
    api,
    owners: OWNERS,
    chain: 'solana',
  })
  return balances
}

async function partialStakedSOL(api) {
  const stakedLamports = await getStakedSol(STAKED_SOL_ADDRESS) 
  const balances = {}
  sdk.util.sumSingleBalance(balances, 'solana', stakedLamports / 1e9) 
  return balances
}


async function partialMultipleAccounts() {

  const accounts = [
    '11111111111111111111111111111111',
    'SysvarRent111111111111111111111111111111111',
  ]

  const data = await getMultipleAccounts(accounts)
  

  let sumLamports = 0
  for (const accInfo of data) {
    if (!accInfo) continue
    sumLamports += accInfo.lamports
  }
  
  const balances = {}
  sdk.util.sumSingleBalance(balances, 'solana', 10)
  return balances
}


async function combinedTvl(api) {
  const [dexRes, partialRes, stakedRes, multipleAccRes] = await Promise.all([
    DexTVL(),       
    partialBalances(api), 
    partialStakedSOL(api),
    partialMultipleAccounts(),
  ])

  for (const obj of [dexRes, partialRes, stakedRes, multipleAccRes]) {
    for (const [token, balance] of Object.entries(obj)) {
      sdk.util.sumSingleBalance(api.getBalances(), token, balance)
    }
  }

  sdk.util.sumSingleBalance(api.getBalances(), 'solana', 200e7)


  return api.getBalances()
}

module.exports = {
  timetravel: false,
  misrepresentedTokens: true,
  methodology:
    "xb tvl",
  solana: {
    tvl: combinedTvl,
  },
}
