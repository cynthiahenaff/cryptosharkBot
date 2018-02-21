const fetchTickers = require('./fetchTickers');
const parseTicker = require('./parseTicker');

module.exports = (bot) => {
  bot.command('worst7d', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let perCurrencyWorstTickers = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(a.percent_change_7d) - parseFloat(b.percent_change_7d); })
      .slice(0, 5);

    try {
      let message = '';
      for (const perCurrencyWorstTicker of perCurrencyWorstTickers) {
        const result = await parseTicker(perCurrencyWorstTicker, true);

        message += `/${perCurrencyWorstTicker.symbol} - ${perCurrencyWorstTicker.name}\n\t*${result.changeOver7d}*%\n\n`;
      }

      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
