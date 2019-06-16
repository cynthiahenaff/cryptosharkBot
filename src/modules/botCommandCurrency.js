import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { getCryptocurrencyMeta } from 'api/coinMarketCap';
import { get } from 'lodash';
import fetchTicker from './fetchTicker';
import { parseTicker } from 'utils/parseTicker';
import Markup from 'telegraf/markup';
import { format } from 'date-fns';
import { errorHandling } from 'utils';

export default async bot => {
  const { data } = await getAllCryptocurrencies({ limit: 2500 });
  const tickers = get(data, 'data', []);

  bot.action(/about-.*/, async ctx => {
    const currencyAsked = get(ctx, 'update.callback_query.data', '').split(
      '-',
    )[1];
    const { data } = await getCryptocurrencyMeta(currencyAsked);
    const t = get(data, `data[${currencyAsked}]`);
    return ctx.replyWithMarkdown(
      `[ ](${t.logo.replace('64x64', '128x128')})` +
        `\n/${t.symbol} - *${t.name}*` +
        `\n\n${t.description}` +
        `\n\nCreation date : ${format(t.date_added, 'DD MMMM YYYY')}` +
        `\n\nWebsite : [${get(t, 'urls.website')}](${get(t, 'urls.website')})` +
        `\n\nTechnical doc : [${get(t, 'urls.technical_doc')}](${get(
          t,
          'urls.technical_doc',
        )})`,
    );
  });

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
            `[ ](${ticker.logo.replace('64x64', '128x128')})` +
              `\n/${ticker.symbol} - *${ticker.name}*` +
              '\n\nValue' +
              `\n\t\`USD:\t${tickerValue.lastValueUsd.padStart(8)}\`` +
              `\n\t\`EUR:\t${tickerValue.lastValueEur.padStart(8)}\`` +
              `\n\t\`BTC:\t${tickerValue.lastValueBtc.padStart(8)}\`` +
              '\n\nChange' +
              `\n\t\`1h:\t ${tickerValue.changeOver1h.padStart(7)}%\`` +
              `\n\t\`24h:\t${tickerValue.changeOver24h.padStart(7)}%\`` +
              `\n\t\`7d:\t ${tickerValue.changeOver7d.padStart(7)}%\`` +
              '\n\nMarket cap' +
              `\n\`USD:\t${tickerValue.marketcapUsd.padStart(15)}\`` +
              `\n\`EUR:\t${tickerValue.marketcapEur.padStart(15)}\`` +
              '\n\n/help to see the others commands',
            Markup.inlineKeyboard([
              Markup.callbackButton(
                `See more informations about ${ticker.name}`,
                `about-${ticker.symbol}`,
              ),
            ]).extra(),
          );
        } catch (e) {
          errorHandling(get(e, 'response.data') || e);

          ctx.reply(
            'Sorry there is an error. Please try again in few minutes.',
          );
        }
      },
    );
  }
};
