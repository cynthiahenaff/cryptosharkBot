const fetchTickers = require('./fetchTickers');
const delay = require('timeout-as-promise');
const parseTicker = require('./parseTicker');


module.exports = (bot, channelId) => {
  const messageToChannel = async () => {
    const minutes = new Date().getMinutes();
    if (minutes !== 0) {
      return;
    }
    while (true) {
      try {
        const tickers = await fetchTickers();

        let message = '*Top 5 of cryptocurrencies* 🔝\n\n' +
                      '\`     |  USD |  EUR |  1H  \`\n';

        for (const ticker of tickers.slice(0, 5)) {
          const result = await parseTicker(ticker, false);
          message += `\`${ticker.symbol.padEnd(5)}| ${result.lastValueUsd.padEnd(5)}| ${result.lastValueEur.padEnd(5)}|${result.changeOver1h.padStart(5)}%\`\n`;
        }

        message = message + '\n------------------------------\n' +
                            '*Best performing currencies* 🏅\n\n' +
                            '\`     |  USD |  EUR |  1H  \`\n';

        const perCurrencyBestTickers = tickers
          .slice(0, 100)
          .sort((a, b) => { return parseFloat(b.percent_change_1h) - parseFloat(a.percent_change_1h); })
          .slice(0, 5);

        for (const perCurrencyBestTicker of perCurrencyBestTickers) {
          const result = await parseTicker(perCurrencyBestTicker, false);
          message += `\`${perCurrencyBestTicker.symbol.padEnd(5)}| ${result.lastValueUsd.padEnd(5)}| ${result.lastValueEur.padEnd(5)}|${result.changeOver1h.padStart(5)}%\`\n`;
        }

        message += `\nYou can ask me for *more* than *${tickers.length} currencies* by clicking on this link @ButterInTheSpinachBot 🤖`;
        bot.telegram.sendMessage(channelId, message, { 'parse_mode': 'Markdown' });
        break;
      }
      catch (error) {
        await delay(10 * 1000);
      }
    }
  };

  setInterval(messageToChannel, 60 * 1000);
};
