import { get } from 'lodash';
import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseTicker } from 'utils/parseTicker';
import delay from 'timeout-as-promise';
import fetchTicker from './fetchTicker';

export default (bot, channelId) => {
  const messageToChannel = async () => {
    const minutes = new Date().getMinutes();
    if (minutes !== 0) {
      return;
    }

    while (true) {
      try {
        const { data } = await getAllCryptocurrencies({
          sortDir: 'desc',
          limit: 5,
        });
        const tickers = get(data, 'data', []);

        let message =
          '*Top 5 cryptocurrencies* 🔝\n\n' + '`     |  USD |  EUR |  1H  `\n';

        for (const t of tickers) {
          const ticker = await fetchTicker(t.symbol);
          const tValue = await parseTicker(ticker, false);
          message += `\`${ticker.symbol.padEnd(
            5,
          )}| ${tValue.lastValueUsd.padEnd(5)}| ${tValue.lastValueEur.padEnd(
            5,
          )}|${tValue.changeOver1h.padStart(5)}%\`\n`;
        }

        message =
          message +
          '\n------------------------------\n' +
          '*Best performing currencies* 🏅\n\n' +
          '`      |    1H   `\n';

        const { data: bestCurrenciesData } = await getAllCryptocurrencies({
          sort: 'percent_change_1h',
          sortDir: 'desc',
          limit: 5,
        });
        const bestTickers = get(bestCurrenciesData, 'data', []);

        for (const t of bestTickers) {
          const tValue = await parseTicker(t, false);
          message += `\`${t.symbol.padEnd(6)}| ${tValue.changeOver1h.padStart(
            7,
          )}%\`\n`;
        }

        message +=
          '\nYou can ask me for *more* than *2500 currencies* by clicking on this link @cryptoshark_bot 🤖';
        bot.telegram.sendMessage(channelId, message, {
          parse_mode: 'Markdown',
        });
        break;
      } catch (error) {
        await delay(10 * 1000);
      }
    }
  };

  setInterval(messageToChannel, 10 * 1000);
};
