const fetchTickers = require('./fetchTickers');
const fetchTicker = require('./fetchTicker');
const delay = require('timeout-as-promise');

module.exports = (bot, channelId) => {
  const messageToChannel = async () => {
    while (true) {
      try {
        const tickers = await fetchTickers();
        let message = 'I send you every hour the top 5 of cryptocurrencies 🔝💰\n\n';
        for (const ticker of tickers.slice(0, 5)) {
          const result = await fetchTicker(ticker.id);
          message = message + `*${ticker.name}*: ${result.lastValueEur}€\nChange (1h): _${result.changeOver1h}%_\n\n`;
        }
        message = message + `\nYou can ask me for *more* than *${tickers.length} currencies* by clicking on this link @ButterInTheSpinachBot 🤖`;
        bot.telegram.sendMessage(channelId, message, { 'parse_mode': 'Markdown' });
        break;
      }
      catch (error) {
        await delay(10 * 1000);
      }
    }
  };

  setInterval(messageToChannel, 60 * 60 * 1000);
};
