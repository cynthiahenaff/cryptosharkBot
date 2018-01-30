const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best7d', (ctx) => {
    ctx.reply('I\'m searching...');

    const takeFiveBestTickers /* List[Ticker] => List[Ticker] */ =
      myTickers =>
        myTickers
          .slice(0, 100)
          .sort((a, b) => parseFloat(b.percent_change_7d) - parseFloat(a.percent_change_7d))
          .slice(0, 5)

    const bestForTicker /* Ticker => Promise[(Struct, Ticker)] */ =
      bestCurrencie => fetchTicker(bestCurrencie.id).then(res => { res, bestCurrencie })

    const bestsForTickers /* List[Ticker] => Promise[List[(Struct, Ticker)]] */ =
      bestCurrencies => Promise.all(bestCurrencies.map(bestForTicker))

    const bestAsString /*: (Struct, Ticker) => String */ =
      (myStruct, best) => `/${best.symbol} - ${best.name}\n\t*${myStruct.changeOver7d}*%\n`

    fetchTickers() /*: Promise[List[Ticker]] */
      .then(takeFiveBestTickers)
      .then(bestsForTickers)
      .then(bests => bests.map(bestAsString))
      .then(strings => strings.join('\n'))
      .then(message => ctx.replyWithMarkdown(message + '\n/help to see the others commands!'))
      .catch(_ => ctx.reply('Sorry there is an error. Please try again in a few minutes.'));
  });
};
