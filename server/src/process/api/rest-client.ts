import { injectable } from 'inversify';
import { toDocument as toDoc } from './document';

@injectable()
export abstract class RestClient {
  protected toDocument: (html: string) => Document = toDoc;
}
