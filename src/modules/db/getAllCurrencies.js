import { errorHandling } from 'utils';

export default async db => {
  try {
    const currencies = await db
      .collection('currencies')
      .find()
      .sort({ cmc_rank: 1 })
      .toArray();

    return currencies || [];
  } catch (err) {
    errorHandling({
      title: 'Database error: getAllCurrencies',
      body: JSON.stringify(err, 2, null),
    });
  }
};
