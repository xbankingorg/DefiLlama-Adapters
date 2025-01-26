const { sumTokens2 } = require('../helper/solana')

const ACCOUNT = 'EjqH5TsEp7Ks1BdVKoLjsNwDsYARzpGDEvhw7srYvs5w'

async function tvl(/* api */) {
  const balances = await sumTokens2({
    tokenAccounts: [ ACCOUNT ],
  })
  return balances
}


module.exports = {
  timetravel: false,       
  misrepresentedTokens: true,
  methodology: "summing.",

  solana: {
    tvl,
  },
}
