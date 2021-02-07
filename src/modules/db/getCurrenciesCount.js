import { errorHandling } from 'utils';

export default async db => {
  try {
    const currenciesCount = await db.collection('currencies').countDocuments();

    return currenciesCount;
  } catch (err) {
    errorHandling({
      title: 'Database error: getCurrenciesCount',
      body: JSON.stringify(err, 2, null),
    });
  }
};
