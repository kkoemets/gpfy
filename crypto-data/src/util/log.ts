import { Logger } from 'tslog';

export const createLogger: () => Logger = () => new Logger();
