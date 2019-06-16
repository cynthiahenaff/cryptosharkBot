import { get } from 'lodash';

const fixDecimalPrice = (price, precise) => {
  if (precise === true) {
    if (price < 1) {
      price = price.toFixed(8);
    } else if (price < 10) {
      price = price.toFixed(4);
    } else {
      price = price.toFixed(2);
    }
  } else if (precise === false) {
    if (price < 1) {
      price = price.toFixed(2);
    } else if (price < 10) {
      price = price.toFixed(2);
    } else if (price < 100) {
      price = price.toFixed(1);
    } else {
      price = price.toFixed(0);
    }
  }
  return price;
};

const percentChange = change => {
  change = change.toFixed(2);
  if (change > 0) {
    return '+' + parseFloat(change);
  }
  return change;
};

export const parseTicker = (ticker, precise) => {
  const lastValueEur = fixDecimalPrice(
    parseFloat(get(ticker, 'quote.EUR.price')),
    precise,
  );
  const lastValueUsd = fixDecimalPrice(
    parseFloat(get(ticker, 'quote.USD.price')),
    precise,
  );
  const lastValueBtc = fixDecimalPrice(
    parseFloat(get(ticker, 'quote.BTC.price')),
    precise,
  );
  const changeOver1h = percentChange(
    parseFloat(get(ticker, 'quote.USD.percent_change_1h')),
  );
  const changeOver24h = percentChange(
    parseFloat(get(ticker, 'quote.USD.percent_change_24h')),
  );
  const changeOver7d = percentChange(
    parseFloat(get(ticker, 'quote.USD.percent_change_7d')),
  );
  const marketcapEur = parseInt(
    get(ticker, 'quote.EUR.market_cap'),
  ).toLocaleString('us-US');
  const marketcapUsd = parseInt(
    get(ticker, 'quote.USD.market_cap'),
  ).toLocaleString('us-US');

  return {
    lastValueEur,
    lastValueUsd,
    lastValueBtc,
    changeOver1h,
    changeOver24h,
    changeOver7d,
    marketcapEur,
    marketcapUsd,
  };
};
