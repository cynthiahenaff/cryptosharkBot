const ccxt = require('ccxt');

const fetchTicker = async (exchangeName, symbol) => {
  const exchange = new ccxt[exchangeName]();
  const ticker = await exchange.fetchTicker(symbol);
  return ticker.last;
};

(async () => {
  // const lastKrakenBtc = await fetchTicker('kraken', 'BTC/EUR');
  // console.log('lastKrakenBtc: ' + lastKrakenBtc);
  //
  // const lastGdaxBtc = await fetchTicker('gdax', 'BTC/EUR');
  // console.log('lastGdaxBtc: ' + lastGdaxBtc);
  //
  // const lastKrakenEth = await fetchTicker('kraken', 'ETH/EUR');
  // console.log('lastKrakenEth: ' + lastKrakenEth);



  // const symbols = [
  //   'BTC/EUR',
  //   'ETH/EUR',
  // ];
  //
  // for (const symbol of symbols) {
  //   const lastValue = await fetchTicker('gdax', symbol);
  //   console.log(`${symbol}: ${lastValue}`);
  // }



  const cryptos = [
    {
      symbol: 'BTC/EUR',
      name: 'Bitcoin',
      exchange: 'gdax'
    },
    {
      symbol: 'ETH/EUR',
      name: 'Ethereum',
      exchange: 'kraken'
    }
  ];

  for (const crypto of cryptos) {
    const lastValue = await fetchTicker(crypto.exchange, crypto.symbol);
    console.log(`${crypto.name} is at ${lastValue} euros on ${crypto.exchange}`);
  }
})();
