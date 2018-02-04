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
      let message = (await Promise.all(
        worstCurrencies.map(
          async (worstCurrencie) => {
            const result = await fetchTicker(worstCurrencie.id, true);
            return `/${worstCurrencie.symbol} - ${worstCurrencie.name}\n\t*${result.changeOver7d}*%\n`;
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
