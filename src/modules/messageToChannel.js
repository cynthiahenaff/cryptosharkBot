import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseValue } from 'utils/ticker';
import getCurrencyQuote from './getCurrencyQuote';
import getTopCurrencies from 'modules/db/getTopCurrencies';
import getCurrenciesCount from 'modules/db/getCurrenciesCount';

const channelId = process.env.CHANNEL_ID;

export default (bot, db) => {
  const messageToChannel = async () => {
    const minutes = new Date().getMinutes();
    if (minutes !== 0) {
      return;
    }

    try {
      const count = await getCurrenciesCount(db);
      const topCurrencies = await getTopCurrencies(db);

      const topCurrenciesMessages = await Promise.all(
        (topCurrencies || []).map(async ({ symbol }) => {
          const { quote } = await getCurrencyQuote({ db, symbol });
          const { lastValueUsd, lastValueEur, changeOver1h } = await parseValue(
            quote,
            false,
          );
          return `\`${symbol.padEnd(5)}| ${lastValueUsd.padEnd(
            5,
          )}| ${lastValueEur.padEnd(5)}|${changeOver1h.padStart(5)}%\``;
        }),
      );

      const { data: bestCurrenciesData } = await getAllCryptocurrencies({
        sort: 'percent_change_1h',
        sortDir: 'desc',
        limit: 5,
      });

      const bestCurrencies = bestCurrenciesData?.data ?? [];

      const bestPerformingCurrenciesMessages = await Promise.all(
        bestCurrencies.map(async ({ symbol, quote }) => {
          const { changeOver1h } = await parseValue(quote, false);
          return `\`${symbol.padEnd(6)}| ${changeOver1h.padStart(7)}%\``;
        }),
      );

      const message = [
        '*Top 5 cryptocurrencies* 🔝\n',
        '`     |  USD |  EUR |  1H  `',
        ...topCurrenciesMessages,
        '\n------------------------------\n',
        '*Best performing currencies* 🏅\n',
        '`      |    1H   `',
        ...bestPerformingCurrenciesMessages,
        `\nYou can ask me for *${count} currencies* by clicking on this link @cryptoshark\\_bot 🤖`,
      ].join('\n');

      await bot.telegram.sendMessage(channelId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error(error);
      setTimeout(messageToChannel, 10 * 1000);
    }
  };

  setInterval(messageToChannel, 60 * 1000);
};
