import connector from './connector';
import { OfferingsContainer } from 'types';

export const getOfferings = async (): Promise<OfferingsContainer> => {
  const { data } = await connector.get('/offerings/');
  return data;
};
