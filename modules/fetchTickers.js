const axios = require('axios');

module.exports = async () => {
  // Getting all currencies with CMC's API
  const resultApi = await axios.get('https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=0');
  let tickers = resultApi.data;

  // {
  //   "id": "ardor",
  //   "name": "Ardor",
  //   "symbol": "ARDR",
  //   "rank": "22",
  //   "price_usd": "2.04358",
  //   "price_btc": "0.00014194",
  //   "24h_volume_usd": "4337220.0",
  //   "market_cap_usd": "2041535388.0",
  //   "available_supply": "998999495.0",
  //   "total_supply": "998999495.0",
  //   "max_supply": "998999495.0",
  //   "percent_change_1h": null,
  //   "percent_change_24h": null,
  //   "percent_change_7d": "11.32",
  //   "last_updated": "1515867247",
  //   "price_eur": "1.6755516778",
  //   "24h_volume_eur": "3556130.0502",
  //   "market_cap_eur": "1673875280.0"
  // },

  tickers = tickers.map((ticker) => {
    return {
      ...ticker,
      percent_change_1h: ticker.percent_change_1h || 0,
      percent_change_24h: ticker.percent_change_24h || 0,
      percent_change_7d: ticker.percent_change_7d || 0,
      market_cap_usd: ticker.market_cap_usd || 0,
      market_cap_eur: ticker.market_cap_eur || 0
    };
  });

  tickers.sort((a, b) => { return parseFloat(b.market_cap_usd) - parseFloat(a.market_cap_usd); });
  console.log('Cryptocurrencies: ' + tickers.length);
  return tickers;
};
