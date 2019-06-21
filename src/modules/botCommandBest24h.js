import { get } from 'lodash';
import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseTicker } from 'utils/parseTicker';
import { ERROR } from 'utils/messages';

export default bot => {
  bot.command('best24h', async ctx => {
    ctx.reply('I’m searching…');

    const { data } = await getAllCryptocurrencies({
      sort: 'percent_change_24h',
      sortDir: 'desc',
      limit: 100,
    });
    const tickers = get(data, 'data', []).filter(
      t => get(t, 'quote.USD.percent_change_24h') !== null,
    );

    try {
      let message = '';
      for (const t of tickers.slice(0, 5)) {
        const tValue = await parseTicker(t, true);

        message += `/${t.symbol} - ${t.name}\n\t*${tValue.changeOver24h}*%\n\n`;
      }

      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    } catch (e) {
      ctx.reply(ERROR);
    }
  });
};
