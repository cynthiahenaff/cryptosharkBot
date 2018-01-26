const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('worst24h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let worstCurrencies = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(a.percent_change_24h) - parseFloat(b.percent_change_24h); })
      .slice(0, 5);

    try {
      let message = (await Promise.all(
        worstCurrencies.map(
          async (worstCurrencie) => {
            const result = await fetchTicker(worstCurrencie.id);
            return `/${worstCurrencie.symbol} - ${result.lastValueEur}€ (24h:  *${result.changeOver24h}%*)`;
          }
        )
      )).join('\n');
      message += '\n\n/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
