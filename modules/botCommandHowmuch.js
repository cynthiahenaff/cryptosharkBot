const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = (bot) => {
  bot.command(['howMuch', 'howmuch'], async (ctx) => {
    ctx.reply('I\'m searching...');
    try {
      const tickers = await fetchTickers();
      let message = '';
      for (const ticker of tickers.slice(0, 6)) {
        const result = await fetchTicker(ticker.id);
        message = message + `${ticker.name} (${ticker.symbol})\n*${result.lastValueEur}€*   -   $${result.lastValueUsd}\n`;
      }
      message += '\n/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    }
    catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
