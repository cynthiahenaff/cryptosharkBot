const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best1h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let bestCurrencies = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(b.percent_change_1h) - parseFloat(a.percent_change_1h); })
      .slice(0, 5);

    try {
      const message = (await Promise.all(
        bestCurrencies.map(
          async (bestCurrencie) => {
            const result = await fetchTicker(bestCurrencie.id);
            return `/${bestCurrencie.symbol} - ${result.lastValueEur}€ (1h:  *${result.changeOver1h}%*)`;
          }
        )
      )).join('\n');

      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
