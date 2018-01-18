const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('worst7d', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let worstCurrencies = tickers
      .slice(0, 50)
      .sort((a, b) => { return parseFloat(a.percent_change_7d) - parseFloat(b.percent_change_7d); })
      .slice(0, 5);

    try {
      let message = '';
      for (const worstCurrencie of worstCurrencies) {
        const result = await fetchTicker(worstCurrencie.id);
        message += `/${worstCurrencie.symbol} - ${result.lastValueEur}€ (1h:  *${result.changeOver7d}%*)\n`;
      }
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
