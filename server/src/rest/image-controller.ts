import { RestController } from './rest-controller';
import express from 'express';
import {
  findBtc2YearMovingAverageApi,
  findRainbowChartApi,
} from './controller-api/bot/image-controller-api';

export class ImageController extends RestController {
  configureRoutes = (): express.Application => {
    const { app } = this;
    app
      .route('/bot/images/2YearMovingAvg')
      .get(async (_: express.Request, res: express.Response) => {
        res.json(await findBtc2YearMovingAverageApi());
      });

    app
      .route('/bot/images/rainbow')
      .get(async (_: express.Request, res: express.Response) => {
        res.json(await findRainbowChartApi());
      });

    return app;
  };
}
