const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');
const delay = require('timeout-as-promise');

module.exports = (bot, channelId) => {
  const messageToChannel = async () => {
    const minutes = new Date().getMinutes();
    if (minutes !== 0) {
      return;
    }
    while (true) {
      try {
        const tickers = await fetchTickers();

        let bestCurrencies = tickers
          .slice(0, 100)
          .sort((a, b) => { return parseFloat(b.percent_change_1h) - parseFloat(a.percent_change_1h); })
          .slice(0, 5);

        let message = '_Top 5 of cryptocurrencies_ 🔝\n\n';

        for (const ticker of tickers.slice(0, 5)) {
          const result = await fetchTicker(ticker.id);
          message = message + `*${ticker.symbol}* ${result.lastValueEur}€ - $${result.lastValueUsd} (*${result.changeOver1h}*%)\n`;
        }

        message = message + '\n------------------------------\n_Best performing currencies_ 🏅\n\n';

        for (const bestCurrencie of bestCurrencies) {
          const result = await fetchTicker(bestCurrencie.id);
          message += `*${bestCurrencie.symbol}* - ${result.lastValueEur}€ (1h:  ${result.changeOver1h}%)\n`;
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
