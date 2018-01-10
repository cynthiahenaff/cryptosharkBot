const axios = require('axios');

const ticker = async (currency) => {
  const getTicker = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${currency}/?convert=EUR`);
  return {
    lastValue: getTicker.data[0].price_eur,
    changeOver1h: getTicker.data[0].percent_change_1h,
    changeOver24h: getTicker.data[0].percent_change_24h,
    changeOver7d: getTicker.data[0].percent_change_7d
  };
};

// ticker();

(async () => {
  const result = await ticker('bitcoin');
  // console.log(result.lastValue);
  let numObj = parseFloat(result.lastValue);
  if (numObj < 0) {
    numObj = numObj.toFixed(6);
  }
  else if (numObj < 10) {
    numObj = numObj.toFixed(4);
  }
  else {
    numObj = numObj.toFixed(2);
  }
  console.log(numObj);
})();
