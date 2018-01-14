const fetchTickers = require('./fetchTickers');

module.exports = (bot) => {
  bot.command('help', async (ctx) => {
    const tickers = await fetchTickers();
    let message = '/howMuch - Query the market\n';
    for (const ticker of tickers.slice(0, 10)) {
      message = message + `/${ticker.symbol} - Value of *${ticker.name}* in EUR/USD\n`;
    }
    ctx.replyWithMarkdown(message);
  });
};
