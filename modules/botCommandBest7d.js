const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best7d', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let bestCurrencies = tickers
      .slice(0, 50)
      .sort((a, b) => { return parseFloat(b.percent_change_7d) - parseFloat(a.percent_change_7d); })
      .slice(0, 5);

    try {
      let message = '';
      for (const bestCurrencie of bestCurrencies) {
        const result = await fetchTicker(bestCurrencie.id);
        message += `/${bestCurrencie.symbol} - ${result.lastValueEur}€ (7d:  *${result.changeOver7d}%*)\n`;
      }
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
