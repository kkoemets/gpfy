import { JSDOM } from 'jsdom';

export const toDocument = (html: string): Document =>
  new JSDOM(html).window.document;
