const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('worst7d', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let worstCurrencies = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(a.percent_change_7d) - parseFloat(b.percent_change_7d); })
      .slice(0, 5);

    try {
      const message = (await Promise.all(
        worstCurrencies.map(
          async (worstCurrencie) => {
            const result = await fetchTicker(worstCurrencie.id);
            return `/${worstCurrencie.symbol} - ${result.lastValueEur}€ (7d:  *${result.changeOver7d}%*)`;
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
