const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');

module.exports = async (bot) => {
  const tickers = await fetchTickers();
  for (const ticker of tickers) {
    bot.command([ ticker.symbol, ticker.symbol.toLowerCase(), ticker.id.replace(/-/g, '') ], async (ctx) => {
      try {
        const result = await fetchTicker(ticker.id);
        ctx.replyWithMarkdown(`${ticker.name} (${ticker.symbol})
*${result.lastValueEur}€* - $${result.lastValueUsd}

   Change 1h:  ${result.changeOver1h.padStart(7)}%
   Change 24h: *${result.changeOver24h.padStart(7)}%*
   Change 7d:  ${result.changeOver7d.padStart(7)}%`);
      }
      catch(error) {
        ctx.reply('Sorry there is an error. Please try again in a few minutes.');
      }
    });
  }
};
