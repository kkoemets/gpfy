import { ILogObj, Logger } from 'tslog';

export const createLogger: () => Logger<ILogObj> = () => new Logger();
