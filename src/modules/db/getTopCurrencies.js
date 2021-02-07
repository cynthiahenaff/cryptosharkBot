import { errorHandling } from 'utils';

export default async (db, limit = 5) => {
  try {
    const currencies = await db
      .collection('currencies')
      .find()
      .sort({ cmc_rank: 1 })
      .limit(limit)
      .toArray();

    return currencies || [];
  } catch (err) {
    errorHandling({
      title: 'Database error: getTopCurrencies',
      body: JSON.stringify(err, 2, null),
    });
  }
};
