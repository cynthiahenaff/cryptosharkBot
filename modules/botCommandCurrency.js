const fetchTickers = require('./fetchTickers');
const parseTicker = require('./parseTicker');

module.exports = async (bot) => {
  const tickers = await fetchTickers();
  for (const ticker of tickers) {
    bot.command([ ticker.symbol, ticker.symbol.toLowerCase(), ticker.id.replace(/-/g, '') ], async (ctx) => {
      try {
        const result = await parseTicker(ticker, true);
        ctx.replyWithMarkdown(
          `/${ticker.symbol} - *${ticker.name}*\n`+
          '\n' +
          'Value\n' +
          `\t\`USD:\t${result.lastValueUsd.padStart(8)}\`\n` +
          `\t\`EUR:\t${result.lastValueEur.padStart(8)}\`\n` +
          '\n' +
          'Change\n' +
          `\t\`1h:\t ${result.changeOver1h.padStart(7)}%\`\n` +
          `\t\`24h:\t${result.changeOver24h.padStart(7)}%\`\n` +
          `\t\`7d:\t ${result.changeOver7d.padStart(7)}%\`\n` +
          '\n' +
          'Market cap\n' +
          `\`USD:\t${result.marketcapUsd.padStart(15)}\`\n` +
          `\`EUR:\t${result.marketcapEur.padStart(15)}\`\n` +
          '\n/help to see the others commands'
        );
      }
      catch(error) {
        ctx.reply('Sorry there is an error. Please try again in a few minutes.');
      }
    });
  }
};
