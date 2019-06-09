import axios from 'axios';
import { decamelizeKeys } from 'humps';

const apiKeys = [
  process.env.CMC_API_KEY_1,
  process.env.CMC_API_KEY_2,
  process.env.CMC_API_KEY_3,
];

const formatConfig = ({ params, ...opts } = {}) => ({
  ...opts,
  params: decamelizeKeys(params),
});

const formatResponse = response => {
  return response;
};

const get = (uri, config = {}) => {
  const apiKeyIndex = Math.floor(Math.random() * 3);

  const api = axios.create({
    baseURL: 'https://pro-api.coinmarketcap.com/v1',
    headers: {
      'X-CMC_PRO_API_KEY': apiKeys[apiKeyIndex],
    },
  });

  return api.get(uri, formatConfig(config)).then(formatResponse);
};

export const getAllCryptocurrencies = params =>
  get('/cryptocurrency/listings/latest', {
    params: { convert: 'USD', ...params },
  });

export const getCryptocurrency = (currency, convert) =>
  get('/cryptocurrency/quotes/latest', {
    params: { symbol: currency, convert: convert },
  });

export const getCryptocurrencyMeta = currency =>
  get('/cryptocurrency/info', {
    params: {
      symbol: currency,
    },
  });
