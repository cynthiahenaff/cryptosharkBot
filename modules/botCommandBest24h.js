const fetchTickers = require('./fetchTickers');
const parseTicker = require('./parseTicker');


module.exports = (bot) => {
  bot.command('best24h', async (ctx) => {
    ctx.reply('I\'m searching...');
    const tickers = await fetchTickers();
    let perCurrencyBestTickers = tickers
      .slice(0, 100)
      .sort((a, b) => { return parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h); })
      .slice(0, 5);

    try {
      let message = '';
      for (const perCurrencyBestTicker of perCurrencyBestTickers) {
        const result = await parseTicker(perCurrencyBestTicker, true);

        message += `/${perCurrencyBestTicker.symbol} - ${perCurrencyBestTicker.name}\n\t*${result.changeOver24h}*%\n\n`;
      }

      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });

};
