import { get } from 'lodash';
import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseTicker } from 'utils/parseTicker';

export default bot => {
  bot.command('worst7d', async ctx => {
    ctx.reply('I’m searching…');

    const { data } = await getAllCryptocurrencies({
      sort: 'percent_change_7d',
      sortDir: 'asc',
      limit: 100,
    });

    const tickers = get(data, 'data', []).filter(
      t => get(t, 'quote.USD.percent_change_7d') !== null,
    );

    try {
      let message = '';
      for (const t of tickers.slice(0, 5)) {
        const tValue = await parseTicker(t, true);

        message += `/${t.symbol} - ${t.name}\n\t*${tValue.changeOver7d}*%\n\n`;
      }

      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    } catch (e) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
