import { RestController } from './rest-controller';
import express from 'express';

export class MonitoringController extends RestController {
  configureRoutes = (): express.Application => {
    const { app } = this;

    app
      .route('/monitoring')
      .get((_: express.Request, res: express.Response) => {
        res.status(200).send('Health: Good');
      });

    return app;
  };
}
