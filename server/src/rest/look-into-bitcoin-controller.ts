import { RestController } from './rest-controller';
import express from 'express';
import { findBtc2YearMovingAverageApi } from '../api/bot/find-btc-2-year-moving-average-api';

export class LookIntoBitcoinController extends RestController {
  constructor(app: express.Application) {
    super(app);
  }

  configureRoutes = (): express.Application => {
    const { app } = this;

    app
      .route('/bot/lookIntoBitcoin/2YearMovingAvg')
      .get(async (_: express.Request, res: express.Response) => {
        res.json(await findBtc2YearMovingAverageApi());
      });

    return app;
  };
}
