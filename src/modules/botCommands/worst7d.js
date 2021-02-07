import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseValue } from 'utils/ticker';
import { ERROR } from 'utils/messages';
import { errorHandling } from 'utils';

export default bot => {
  bot.command('worst7d', async ctx => {
    ctx.reply('I’m searching…');

    try {
      const { data } = await getAllCryptocurrencies({
        sort: 'percent_change_7d',
        sortDir: 'asc',
        limit: 10,
      });

      const currencies = (data?.data ?? [])
        .filter(t => Boolean(t?.quote?.USD?.percent_change_7d))
        .slice(0, 5);

      const currenciesMessage = (currencies || []).map(
        ({ symbol, name, quote }) => {
          const { changeOver7d } = parseValue(quote, true);
          return `/${symbol} - ${name}\n\t*${changeOver7d}*%\n`;
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
        title: `Worst 7d Error`,
        body: JSON.stringify(err?.response?.data, null, 2),
      });
    }
  });
};
