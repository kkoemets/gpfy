import { InversifyConfig } from './inversify.config';
import { Container } from 'inversify';

export const InversifyContainer: Container = new InversifyConfig().container;
