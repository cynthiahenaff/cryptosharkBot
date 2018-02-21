const fixDecimalPrice = (price, precise) => {
  if (precise === true) {
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
  else if (precise === false) {
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
  change = change.toFixed(2);
  if (change > 0) {
    return '+' + parseFloat(change);
  }
  return change;
};

module.exports = (ticker, precise) => {
  const lastValueEur = fixDecimalPrice(parseFloat(ticker.price_eur), precise);
  const lastValueUsd = fixDecimalPrice(parseFloat(ticker.price_usd), precise);
  const changeOver1h = percentChange(parseFloat(ticker.percent_change_1h));
  const changeOver24h = percentChange(parseFloat(ticker.percent_change_24h));
  const changeOver7d = percentChange(parseFloat(ticker.percent_change_7d));
  const marketcapEur = parseInt(ticker.market_cap_eur).toLocaleString('us-US');
  const marketcapUsd = parseInt(ticker.market_cap_usd).toLocaleString('us-US');

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
