const axios = require('axios');

module.exports = async () => {
  // Getting all currencies with CMC's API
  const resultApi = await axios.get('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=0');
  const tickers = resultApi.data;

  tickers.sort((a, b) => { return parseFloat(b.market_cap_usd || 0) - parseFloat(a.market_cap_usd || 0); });
  console.log('Cryptocurrencies: ' + tickers.length);
  return tickers;
};
