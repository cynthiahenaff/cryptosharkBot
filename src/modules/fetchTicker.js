import { getCryptocurrency, getCryptocurrencyMeta } from 'api/coinMarketCap';

const fetchTicker = async (currency, variant) => {
  const { data: dataEur } = await getCryptocurrency(currency, 'EUR');
  const { data: dataUsd } = await getCryptocurrency(currency, 'USD');

  if (variant !== 'baseValue') {
    const { data: dataBtc } = await getCryptocurrency(currency, 'BTC');
    const { data: tickerMetaData } = await getCryptocurrencyMeta(currency);
    return {
      ...dataUsd.data[currency],
      quote: {
        ...dataBtc.data[currency].quote,
        ...dataUsd.data[currency].quote,
        ...dataEur.data[currency].quote,
      },
      ...tickerMetaData.data[currency],
    };
  }

  return {
    ...dataUsd.data[currency],
    quote: {
      ...dataUsd.data[currency].quote,
      ...dataEur.data[currency].quote,
    },
  };
};
export default fetchTicker;
