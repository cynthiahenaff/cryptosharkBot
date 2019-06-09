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

// { id: 52,
//   name: 'XRP',
//   symbol: 'XRP',
//   slug: 'ripple',
//   circulating_supply: 42238947941,
//   total_supply: 99991610348,
//   max_supply: 100000000000,
//   date_added: '2013-08-04T00:00:00.000Z',
//   num_market_pairs: 428,
//   tags: null,
//   platform: null,
//   cmc_rank: 3,
//   last_updated: '2019-06-09T12:13:04.000Z',
//   quote:
//    { BTC:
//       { price: 0.000051980055703709515,
//         volume_24h: 145728.34349462824,
//         percent_change_1h: -0.0053,
//         percent_change_24h: -1.279,
//         percent_change_7d: 2.8211,
//         market_cap: 2195582.8668392664,
//         last_updated: '2019-06-09T12:12:28.000Z' },
//      USD:
//       { price: 0.408574194547,
//         volume_24h: 1145455497.49646,
//         percent_change_1h: -0.641347,
//         percent_change_24h: -2.90105,
//         percent_change_7d: -7.18155,
//         market_cap: 17257744133.50674,
//         last_updated: '2019-06-09T12:13:04.000Z' },
//      EUR:
//       { price: 0.3602459959450073,
//         volume_24h: 1009965293.9750888,
//         percent_change_1h: -0.6413,
//         percent_change_24h: -2.901,
//         percent_change_7d: -7.1816,
//         market_cap: 15216411868.67486,
//         last_updated: '2019-06-09T12:13:00.000Z' } },
//   urls:
//    { website: [ 'https://ripple.com/xrp/' ],
//      technical_doc: [ 'https://ripple.com/files/ripple_consensus_whitepaper.pdf' ],
//      twitter: [ 'https://twitter.com/Ripple' ],
//      reddit: [ 'https://reddit.com/r/ripple' ],
//      message_board: [ 'http://www.xrpchat.com/' ],
//      announcement: [],
//      chat: [ 'https://t.me/Ripple', 'https://discord.gg/aTXCs4y' ],
//      explorer:
//       [ 'https://xrpcharts.ripple.com/#/graph/',
//         'https://bithomp.com/explorer/',
//         'https://xrpscan.com/' ],
//      source_code: [ 'https://github.com/ripple' ] },
//   logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
//   description: 'Ripple (XRP) is an independent digital asset that is native to the Ripple Consensus Ledger. With proven governance and the fastest transaction confirmation of its kind, XRP is said to be the most efficient settlement option for financial institutions and liquidity providers seeking global reach, accessibility and fast settlement finality for interbank flows.',
//   notice: null,
//   category: 'coin' }
