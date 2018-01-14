const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best1h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let bestCurrencies = tickers
      .slice(0, 50)
      .sort((a, b) => { return parseFloat(b.percent_change_1h) - parseFloat(a.percent_change_1h); })
      .slice(0, 5);

    try {
      let message = '';
      for (const bestCurrencie of bestCurrencies) {
        const result = await fetchTicker(bestCurrencie.id);
        message += `/${bestCurrencie.symbol} - ${result.lastValueEur}€ (1h:  *${result.changeOver1h}%*)\n`;
      }
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
