import {
  getAllCryptocurrencies,
  getAllCryptocurrenciesMeta,
} from 'api/coinMarketCap';

export default db => {
  const getAllCurrencies = async () => {
    try {
      const hour = new Date().getHours();
      const minutes = new Date().getMinutes();
      if (hour !== 1 && minutes !== 0) {
        return;
      }

      const { data } = await getAllCryptocurrencies({
        sortDir: 'desc',
        limit: 4000,
      });

      const currencies = data?.data ?? [];

      const currenciesToGetMeta = [];

      await Promise.all(
        currencies.map(async currency => {
          const searchedCurrency = await db
            .collection('currencies')
            .findOne({ symbol: currency?.symbol });

          if (!Boolean(searchedCurrency)) {
            currenciesToGetMeta.push(currency?.symbol);

            const payload = {
              ...currency,
              quote: {
                USD: {
                  ...currency?.quote?.USD,
                  last_updated: new Date(),
                },
              },
            };
            await db.collection('currencies').insertOne(payload);
          } else {
            await db.collection('currencies').updateOne(
              { symbol: currency?.symbol },
              {
                $set: {
                  ...searchedCurrency,
                  ...currency,
                  quote: {
                    USD: {
                      ...currency?.quote?.USD,
                      last_updated: new Date(),
                    },
                  },
                },
              },
            );
          }
        }),
      );

      if (currenciesToGetMeta.length > 0) {
        const { data: metaCurrenciesData } = await getAllCryptocurrenciesMeta({
          symbol: currenciesToGetMeta.join(','),
        });

        currenciesToGetMeta.forEach(async symbol => {
          const searchedCurrency = await db
            .collection('currencies')
            .findOne({ symbol });

          const currencyMeta = metaCurrenciesData?.data?.[symbol];

          await db.collection('currencies').updateOne(
            { symbol },
            {
              $set: {
                ...searchedCurrency,
                meta: currencyMeta,
              },
            },
          );
        });
      }
    } catch (err) {
      console.error(err);
      setTimeout(getAllCurrencies, 10 * 1000);
    }
  };
  setInterval(getAllCurrencies, 60 * 1000);
};
