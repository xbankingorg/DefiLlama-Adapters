const BigNumber = require('bignumber.js')
const axios = require('axios');
async function EthereumTvl() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  const validatorBalance = fetch("https://docs-demo.quiknode.pro/eth/v1/beacon/states/head/validator_balances?id=0x91104f28e17de8c6bec26c5a8e64a149ba3ed2a35273197c33ed2f2bc74b8dbda96f9098517a6e946247c169c89deb34", requestOptions)
    .then(response => response.text())
  const dat = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum`)
  const nodebalance = JSON.parse(await validatorBalance).data[0].balance / 1000000000
  const ves = nodebalance * dat.data[0].current_price
  return parseFloat(ves.toFixed(4));
}

module.exports = {
  methodology: 'Counts total value in usd ethereum staked',
  ethereum: {
    tvl: EthereumTvl,
  },
}
