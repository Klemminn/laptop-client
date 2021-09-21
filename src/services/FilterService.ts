import connector from './connector';
import { Filter } from 'types';

export const createFilter = async (filter: Filter): Promise<string> => {
  const { data } = await connector.post('/filters/create/', filter);
  return data;
};

export const getFilter = async (code: string): Promise<Filter> => {
  const { data } = await connector.get(`/filters/${code}`);
  return data;
};
