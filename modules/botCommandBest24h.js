const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command('best24h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let bestCurrencies = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h); })
      .slice(0, 5);

    try {
      let message = (await Promise.all(
        bestCurrencies.map(
          async (bestCurrencie) => {
            const result = await fetchTicker(bestCurrencie.id, true);
            return `/${bestCurrencie.symbol} - ${bestCurrencie.name}\n\t*${result.changeOver24h}*%\n`;
          }
        )
      )).join('\n');
      message += '\n/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });

};
