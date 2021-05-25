import { RestController } from './RestController';
import express from 'express';

export class MonitoringController extends RestController {
  constructor(app: express.Application) {
    super(app);
  }

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
