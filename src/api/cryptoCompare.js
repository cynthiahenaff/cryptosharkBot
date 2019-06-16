import axios from 'axios';
import { decamelizeKeys } from 'humps';

const api = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data',
  headers: {
    authorization: `Apikey ${process.env.CC_API_KEY}`,
  },
});

const formatConfig = ({ params, ...opts } = {}) => ({
  ...opts,
  params: decamelizeKeys(params),
});

const formatResponse = response => {
  return response;
};

const get = (uri, config = {}) =>
  api.get(uri, formatConfig(config)).then(formatResponse);
