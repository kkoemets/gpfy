import { Logger } from 'tslog';

export const getLogger: () => Logger = () => new Logger();
