import { formatDistanceToNowStrict } from 'date-fns';

export const checkIfQuoteIsOutdated = quote => {
  const lastUpdated = quote?.last_updated;
  if (Boolean(lastUpdated)) {
    const distanceToNow = formatDistanceToNowStrict(lastUpdated, {
      unit: 'minute',
    });
    const distanceToNowInt = Number(distanceToNow.split(' ')[0]);
    return distanceToNowInt >= 5;
  }
  return true;
};

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

const getPercentChange = change => {
  change = change.toFixed(2);
  if (change > 0) {
    return '+' + parseFloat(change);
  }
  return change;
};

export const parseValue = ({ EUR, USD, BTC }, precise) => {
  const lastValueEur = fixDecimalPrice(parseFloat(EUR?.price), precise);
  const lastValueUsd = fixDecimalPrice(parseFloat(USD?.price), precise);
  const changeOver1h = getPercentChange(parseFloat(USD?.percent_change_1h));
  const changeOver24h = getPercentChange(parseFloat(USD?.percent_change_24h));
  const changeOver7d = getPercentChange(parseFloat(USD?.percent_change_7d));
  const marketCapEur = parseInt(EUR?.market_cap).toLocaleString('fr-FR');

  const marketCapUsd = parseInt(USD?.market_cap).toLocaleString('us-US');

  return {
    lastValueEur,
    lastValueUsd,
    changeOver1h,
    changeOver24h,
    changeOver7d,
    marketCapEur,
    marketCapUsd,
  };
};
