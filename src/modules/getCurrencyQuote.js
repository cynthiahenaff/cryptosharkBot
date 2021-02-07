import { getCryptocurrency } from 'api/coinMarketCap';
import { checkIfQuoteIsOutdated } from 'utils/ticker';

const getCurrencyQuote = async ({ db, symbol }) => {
  const currency = await db.collection('currencies').findOne({ symbol });

  const usdQuote = currency?.quote?.USD;
  const eurQuote = currency?.quote?.EUR;

  if (!Boolean(usdQuote) || checkIfQuoteIsOutdated(usdQuote)) {
    const { data: dataUsd } = await getCryptocurrency(symbol, 'USD');

    await db.collection('currencies').updateOne(
      { symbol: currency?.symbol },
      {
        $set: {
          ...currency,
          ...dataUsd?.data[symbol],
          quote: {
            ...currency?.quote,
            USD: {
              ...dataUsd?.data[symbol]?.quote?.USD,
              last_updated: new Date(),
            },
          },
        },
      },
    );
  }

  if (!Boolean(eurQuote) || checkIfQuoteIsOutdated(eurQuote)) {
    const currency = await db.collection('currencies').findOne({ symbol });
    const { data } = await getCryptocurrency(symbol, 'EUR');

    await db.collection('currencies').updateOne(
      { symbol: currency?.symbol },
      {
        $set: {
          ...currency,
          ...data?.data[symbol],
          quote: {
            ...currency?.quote,
            EUR: {
              ...data?.data[symbol]?.quote?.EUR,
              last_updated: new Date(),
            },
          },
        },
      },
    );
  }

  const updatedCurrency = await db.collection('currencies').findOne({ symbol });

  return updatedCurrency;
};
export default getCurrencyQuote;
