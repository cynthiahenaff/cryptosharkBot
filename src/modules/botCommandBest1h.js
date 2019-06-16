import { get } from 'lodash';
import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseTicker } from './parseTicker';

module.exports = (bot, webhook) => {
  bot.command('best1h', async ctx => {
    ctx.reply('I’m searching…');

    const { data } = await getAllCryptocurrencies({
      sort: 'percent_change_1h',
      sortDir: 'desc',
      limit: 100,
    });

    const tickers = get(data, 'data', []).filter(
      t => get(t, 'quote.USD.percent_change_1h') !== null,
    );

    try {
      let message = '';
      for (const t of tickers.slice(0, 5)) {
        const tValue = await parseTicker(t, true);

        message += `/${t.symbol} - ${t.name}\n\t*${tValue.changeOver1h}*%\n\n`;
      }

      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    } catch (e) {
      console.error(get(e, 'response.data') || e);
      await webhook.send({
        text: get(e, 'response.data') || e,
      });
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
