const axios = require('axios');

const fixDecimalPrice = (price) => {
  if (price < 1) {
    price = price.toFixed(6);
  }
  else if (price < 10) {
    price = price.toFixed(4);
  }
  else {
    price = price.toFixed(2);
  }
  return price;
};

const percentChange = (change) => {
  if (change > 0) {
    change = '+' + change.toFixed(2);
  }
  else {
    change = change.toFixed(2);
  }
  return change;
};

module.exports = async (currency) => {
  const getTicker = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);
  const lastValueEur = fixDecimalPrice(parseFloat(getTicker.data[0].price_eur));
  const lastValueUsd = fixDecimalPrice(parseFloat(getTicker.data[0].price_usd));
  const changeOver1h = percentChange(parseFloat(getTicker.data[0].percent_change_1h));
  const changeOver24h = percentChange(parseFloat(getTicker.data[0].percent_change_24h));
  const changeOver7d = percentChange(parseFloat(getTicker.data[0].percent_change_7d));

  return {
    lastValueEur: lastValueEur,
    lastValueUsd: lastValueUsd,
    changeOver1h: changeOver1h,
    changeOver24h: changeOver24h,
    changeOver7d: changeOver7d
  };
};
