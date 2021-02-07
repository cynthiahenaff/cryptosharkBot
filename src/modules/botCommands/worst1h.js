import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseValue } from 'utils/ticker';
import { errorHandling } from 'utils';
import { ERROR } from 'utils/messages';

export default bot => {
  bot.command('worst1h', async ctx => {
    ctx.reply('I’m searching…');

    try {
      const { data } = await getAllCryptocurrencies({
        sort: 'percent_change_1h',
        sortDir: 'asc',
        limit: 10,
      });

      const currencies = (data?.data ?? [])
        .filter(t => Boolean(t?.quote?.USD?.percent_change_1h))
        .slice(0, 5);

      const currenciesMessage = (currencies || []).map(
        ({ symbol, name, quote }) => {
          const { changeOver1h } = parseValue(quote, true);
          return `/${symbol} - ${name}\n\t*${changeOver1h}*%\n`;
        },
      );

      const message = [
        ...currenciesMessage,
        '/help to see the others commands!',
      ].join('\n');

      ctx.replyWithMarkdown(message);
    } catch (err) {
      ctx.reply(ERROR);
      errorHandling({
        title: `Worst 1h Error`,
        body: JSON.stringify(err?.response?.data, null, 2),
      });
    }
  });
};
