import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { get } from 'lodash';

const botCommandHelp = bot => {
  bot.command('help', async ctx => {
    const { data } = await getAllCryptocurrencies({
      sortDir: 'desc',
      limit: 10,
    });
    const tickers = get(data, 'data', []);

    let message =
      '/top10 - Query the market\n\n' + '*Top 10 currencies by market cap*\n';
    for (const t of tickers) {
      message = message + `/${t.symbol} - Value of ${t.name} in EUR/USD\n`;
    }
    message =
      message +
      '\n*Best performing currencies*' +
      '\n/best1h – Top 5 performing currencies in the last hour' +
      '\n/best24h – Top 5 performing currencies in the last 24h' +
      '\n/best7d – Top 5 performing currencies in the last week' +
      '\n\n*Less performing currencies*' +
      '\n/worst1h – Least 5 performing currencies in the last hour' +
      '\n/worst24h – Least 5 performing currencies in the last 24h' +
      '\n/worst7d – Least 5 performing currencies in the last week' +
      '\n\n/about – More informations about dev' +
      '\n\n Want to receive the rate of the cryptocurrencies every hour? Follow this link 👇' +
      '\n[CryptoShark Channel](https://t.me/cryptoshark_channel)';
    ctx.replyWithMarkdown(message);
  });
};

export default botCommandHelp;
