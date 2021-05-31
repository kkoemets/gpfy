import express from 'express';
import { IncomingHttpHeaders } from 'http2';
import { getLogger } from '../../util/get-logger';

const log = getLogger();

export const validateBotRequestHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  validateHeaders(req.headers, (err?: Error) =>
    err ? res.sendStatus(403) : next(),
  );
};

const validateHeaders = (
  { userid, username }: IncomingHttpHeaders,
  callback: (err?: Error) => void,
) => {
  log.info(`Received headers userid-${userid} username-${username}`);
  if (!userid || !username) {
    log.warn('Invalid headers');
    callback(new Error('Invalid headers'));
  }

  callback();
};
