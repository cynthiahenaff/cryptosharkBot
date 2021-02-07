import { get } from 'lodash';
import getCurrencyQuote from '../getCurrencyQuote';
import { parseValue } from 'utils/ticker';
import { Markup } from 'telegraf';
import { format } from 'date-fns';
import { errorHandling } from 'utils';
import { ERROR } from 'utils/messages';
import getAllCurrencies from 'modules/db/getAllCurrencies';

export default async (bot, db) => {
  const tickers = await getAllCurrencies(db);

  bot.action(/about-.*/, async ctx => {
    try {
      const symbol = get(ctx, 'update.callback_query.data', '').split('-')[1];

      const { meta } = await db.collection('currencies').findOne({ symbol });

      const message = [
        // `[ ](${meta.logo.replace('64x64', '128x128')})`,
        `/${meta.symbol} - *${meta.name}*`,
        '',
        `${meta.description}`,
        '',
        `Creation date: ${format(new Date(meta.date_added), 'dd MMMM yyyy')}`,
        '',
        `Website: [${meta?.urls?.website ?? 'no website'}](${
          meta?.urls?.website
        })`,
        '',
        `Technical doc: [${meta?.urls.technical_doc ?? 'no doc'}](${
          meta?.urls?.technical_doc
        })`,
      ].join('\n');

      return ctx.replyWithMarkdown(message);
    } catch (err) {
      console.log(err);
      errorHandling({
        title: `Currency Meta Error : ${symbol}`,
        body: JSON.stringify(err?.response?.data, null, 2),
      });

      ctx.reply(ERROR);
    }
  });

  for (const t of tickers.slice(0, 3800)) {
    bot.command(
      [
        t?.symbol,
        t?.symbol.toLowerCase(),
        t?.slug.replace('-', ''),
        t?.name.replace(' ', ''),
        t?.name.toLowerCase().replace(' ', ''),
        t?.name.toUpperCase().replace(' ', ''),
      ],
      async ctx => {
        ctx.reply('I’m searching…');

        try {
          const {
            quote,
            meta,
            symbol,
            name,
            cmc_rank,
          } = await getCurrencyQuote({
            db,
            symbol: t?.symbol,
          });

          const {
            lastValueUsd,
            lastValueEur,
            changeOver1h,
            changeOver24h,
            changeOver7d,
            marketCapUsd,
            marketCapEur,
          } = await parseValue(quote, true);

          const message = [
            Boolean(meta)
              ? `[ ](${meta.logo.replace('64x64', '128x128')})`
              : '',
            `/${symbol} - *${name}*`,
            '',
            'Value',
            `\t\`USD:\t${lastValueUsd.padStart(8)}\``,
            `\t\`EUR:\t${lastValueEur.padStart(8)}\``,
            '',
            'Change',
            `\t\`1h:\t ${changeOver1h.padStart(7)}%\``,
            `\t\`24h:\t${changeOver24h.padStart(7)}%\``,
            `\t\`7d:\t ${changeOver7d.padStart(7)}%\``,
            '',
            'Market cap',
            `\`Rank:\t#${cmc_rank}\``,
            `\`USD:\t${marketCapUsd.padStart(15)}\``,
            `\`EUR:\t${marketCapEur.padStart(15)}\``,
            '',
            '/help to see the others commands',
          ].join('\n');

          ctx.replyWithMarkdown(
            message,
            Boolean(meta) &&
              Markup.inlineKeyboard([
                Markup.button.callback(
                  `See more informations about ${name}`,
                  `about-${symbol}`,
                ),
              ]),
          );
        } catch (err) {
          console.log(err);
          errorHandling({
            title: `Currency Error : ${t?.symbol}`,
            body: JSON.stringify(err?.response?.data, null, 2),
          });

          ctx.reply(ERROR);
        }
      },
    );
  }
};
