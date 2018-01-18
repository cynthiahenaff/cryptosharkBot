const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('worst1h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let worstCurrencies = tickers
      .slice(0, 50)
      .sort((a, b) => { return parseFloat(a.percent_change_1h) - parseFloat(b.percent_change_1h); })
      .slice(0, 5);

    try {
      let message = '';
      for (const worstCurrencie of worstCurrencies) {
        const result = await fetchTicker(worstCurrencie.id);
        message += `/${worstCurrencie.symbol} - ${result.lastValueEur}€ (1h:  *${result.changeOver1h}%*)\n`;
      }
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
