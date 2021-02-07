import getTopCurrencies from 'modules/db/getTopCurrencies';
import { errorHandling } from 'utils';
import { ERROR } from 'utils/messages';

const channelName = process.env.CHANNEL_NAME;
const channelUrl = process.env.CHANNEL_URL;

const botCommandHelp = (bot, db) => {
  bot.command(['help', 'HELP'], async ctx => {
    try {
      const tickers = await getTopCurrencies(db, 10);

      const topCurrenciesMessage = await (tickers || []).map(
        ({ symbol, name }) => {
          return `/${symbol} - Value of ${name} in EUR/USD`;
        },
      );

      const message = [
        '/top10 - Query the market about 10 currencies',
        '',
        'Enter / following by the name or the symbol of the currency without space or punctuation like these following examples: /xrp /bitcoin /netboxcoin',
        '',
        '*Top 10 currencies by market cap*',
        ...topCurrenciesMessage,
        '',
        '*Best performing currencies*',
        '/best1h – Top 5 performing currencies in the last hour',
        '/best24h – Top 5 performing currencies in the last 24h',
        '/best7d – Top 5 performing currencies in the last week',
        '',
        '*Less performing currencies*',
        '/worst1h – Least 5 performing currencies in the last hour',
        '/worst24h – Least 5 performing currencies in the last 24h',
        '/worst7d – Least 5 performing currencies in the last week',
        '',
        '/about – More informations about dev',
        '',
        'Want to receive the rate of the cryptocurrencies every hour? Follow this link 👇',
        `[${channelName}](${channelUrl})`,
      ].join('\n');

      ctx.replyWithMarkdown(message);
    } catch (err) {
      ctx.reply(ERROR);
      errorHandling({
        title: `Help Error`,
        body: JSON.stringify(err?.response?.data, null, 2),
      });
    }
  });
};

export default botCommandHelp;
