import { parseValue } from 'utils/ticker';
import { ERROR } from 'utils/messages';
import { errorHandling } from 'utils';
import getCurrencyQuote from '../getCurrencyQuote';
import getTopCurrencies from 'modules/db/getTopCurrencies';

export default (bot, db) => {
  bot.command(['top10', 'Top10', 'topten', 'TopTen', 'topTen'], async ctx => {
    ctx.reply('I’m searching…');

    try {
      const tickers = await getTopCurrencies(db, 10);

      const currenciesMessage = await Promise.all(
        (tickers || []).map(async ({ symbol, name }) => {
          const { quote } = await getCurrencyQuote({ db, symbol });
          const { lastValueUsd, lastValueEur } = await parseValue(quote, true);
          return [
            `/${symbol} - *${name}*`,
            `\t\`USD: ${lastValueUsd}\``,
            `\t\`EUR: ${lastValueEur}\``,
          ].join('\n');
        }),
      );

      const message = [
        ...currenciesMessage,
        '/help to see the others commands!',
      ].join('\n');

      ctx.replyWithMarkdown(message);
    } catch (err) {
      ctx.reply(ERROR);
      errorHandling({
        title: `Top 10 Error`,
        body: JSON.stringify(err?.response?.data, null, 2),
      });
    }
  });
};
