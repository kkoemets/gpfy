import { RestController } from './RestController';
import express from 'express';
import { findContractSummaryApi } from '../api/bot/contract/find-contract-summary-api';

export class ContractController extends RestController {
  constructor(app: express.Application) {
    super(app);
  }

  configureRoutes = (): express.Application => {
    const { app } = this;

    app
      .route('/bot/contract/summary')
      .get(async (req: express.Request, res: express.Response) => {
        const contract: string | undefined = req?.query?.contract?.toString();
        if (!contract) {
          throw new Error();
        }

        const summaryText = await findContractSummaryApi(contract);
        res.json({ summaryText });
      });

    return app;
  };
}
