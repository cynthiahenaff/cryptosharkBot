import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { get } from 'lodash';
import fetchTicker from './fetchTicker';
import { parseTicker } from './parseTicker';

module.exports = async bot => {
  const { data } = await getAllCryptocurrencies({ limit: 2500 });
  const tickers = get(data, 'data', []);

  for (const t of tickers) {
    bot.command(
      [
        t.symbol,
        t.symbol.toLowerCase(),
        t.slug,
        t.name,
        t.slug.replace('-', ' '),
      ],
      async ctx => {
        try {
          const ticker = await fetchTicker(t.symbol);
          const tickerValue = await parseTicker(ticker, true);

          ctx.replyWithMarkdown(
            `[ ](${ticker.logo.replace('64x64', '128x128')})\n` +
              `/${ticker.symbol} - *${ticker.name}*\n` +
              '\n' +
              'Value\n' +
              `\t\`USD:\t${tickerValue.lastValueUsd.padStart(8)}\`\n` +
              `\t\`EUR:\t${tickerValue.lastValueEur.padStart(8)}\`\n` +
              `\t\`BTC:\t${tickerValue.lastValueBtc.padStart(8)}\`\n` +
              '\n' +
              'Change\n' +
              `\t\`1h:\t ${tickerValue.changeOver1h.padStart(7)}%\`\n` +
              `\t\`24h:\t${tickerValue.changeOver24h.padStart(7)}%\`\n` +
              `\t\`7d:\t ${tickerValue.changeOver7d.padStart(7)}%\`\n` +
              '\n' +
              'Market cap\n' +
              `\`USD:\t${tickerValue.marketcapUsd.padStart(15)}\`\n` +
              `\`EUR:\t${tickerValue.marketcapEur.padStart(15)}\`\n` +
              '\n/help to see the others commands',
          );
        } catch (e) {
          console.error(get(e, 'response.data') || e);
          ctx.reply(
            'Sorry there is an error. Please try again in a few minutes.',
          );
        }
      },
    );
  }
};
