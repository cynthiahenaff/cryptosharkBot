const axios = require('axios');

const fixDecimalPrice = (price, precision) => {
  if (precision === true) {
    if (price < 1) {
      price = price.toFixed(6);
    }
    else if (price < 10) {
      price = price.toFixed(4);
    }
    else {
      price = price.toFixed(2);
    }
  }
  else if (precision === false) {
    if (price < 1) {
      price = price.toFixed(2);
    }
    else if (price < 10) {
      price = price.toFixed(2);
    }
    else if (price < 100) {
      price = price.toFixed(1);
    }
    else {
      price = price.toFixed(0);
    }
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

module.exports = async (currency, precision) => {
  const getTicker = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);
  const lastValueEur = fixDecimalPrice(parseFloat(getTicker.data[0].price_eur), precision);
  const lastValueUsd = fixDecimalPrice(parseFloat(getTicker.data[0].price_usd), precision);
  const changeOver1h = percentChange(parseFloat(getTicker.data[0].percent_change_1h));
  const changeOver24h = percentChange(parseFloat(getTicker.data[0].percent_change_24h));
  const changeOver7d = percentChange(parseFloat(getTicker.data[0].percent_change_7d));
  const marketcapEur = parseInt(getTicker.data[0].market_cap_eur).toLocaleString('us-US');
  const marketcapUsd = parseInt(getTicker.data[0].market_cap_usd).toLocaleString('us-US');

  return {
    lastValueEur: lastValueEur,
    lastValueUsd: lastValueUsd,
    changeOver1h: changeOver1h,
    changeOver24h: changeOver24h,
    changeOver7d: changeOver7d,
    marketcapEur: marketcapEur,
    marketcapUsd: marketcapUsd,
  };
};
