const axios = require('axios');

module.exports = async (currency, precise) => {
  const apiResult = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);

  const ticker = apiResult.data[0];
  return ticker;
};
